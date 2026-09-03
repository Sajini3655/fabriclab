# FabricLab — Physics & Extended Position-Based Dynamics (XPBD)

FabricLab simulates deformable 2D textile sheets in 3D space using **Extended Position-Based Dynamics (XPBD)** executing entirely on WebGPU compute pipelines.

---

## 1. Cloth Representation & Mesh Topology

The cloth is discretized into a planar triangular mesh:
- **Particles ($N$)**: Grid vertices containing world-space positions $\mathbf{x} \in \mathbb{R}^3$, predicted positions $\mathbf{x}_{\text{pred}}$, velocities $\mathbf{v} \in \mathbb{R}^3$, and inverse masses $w = 1/m$.
- **Triangles ($T$)**: Index triplets defining connectivity and surface normal orientation.
- **Topology Extraction**:
  - **Distance Edges**: Direct topological edges connecting adjacent vertices.
  - **Bending Edges**: Pairs of non-adjacent vertices across neighboring triangles sharing a common hinge edge.

---

## 2. Mass & Geometric Particle Weighting

Particle masses are calculated directly from triangular surface area and material area density $\rho_{\text{area}}$ ($\text{kg/m}^2$):
$$\text{Area}(T) = \frac{1}{2} \| (\mathbf{x}_b - \mathbf{x}_a) \times (\mathbf{x}_c - \mathbf{x}_a) \|$$
$$m_i = \sum_{T \in \text{Adj}(i)} \frac{1}{3} \cdot \text{unit} \cdot \text{Area}(T) \cdot \rho_{\text{area}}$$
$$w_i = \begin{cases} 0 & \text{if particle is pinned/anchored} \\ \frac{1}{m_i} & \text{otherwise} \end{cases}$$

---

## 3. Extended Position-Based Dynamics (XPBD) Formulation

Standard Position-Based Dynamics (PBD) suffers from time-step and iteration-dependent stiffness. XPBD (*Macklin et al., SIGGRAPH 2016*) resolves this by introducing elastic compliance $\alpha \ge 0$ (inverse physical stiffness $\alpha = 1/k$), deriving constraint projections from implicit Euler energy potentials.

For a distance constraint $C(\mathbf{x}_1, \mathbf{x}_2) = \|\mathbf{x}_1 - \mathbf{x}_2\| - d_0$:
1. Compute constraint violation: $C = \|\mathbf{x}_1 - \mathbf{x}_2\| - d_0$
2. Compute gradient: $\nabla C_1 = \frac{\mathbf{x}_1 - \mathbf{x}_2}{\|\mathbf{x}_1 - \mathbf{x}_2\|}, \quad \nabla C_2 = -\nabla C_1$
3. Compute time-scaled compliance: $\tilde{\alpha} = \frac{\alpha}{\Delta t_{\text{sub}}^2}$
4. Compute Lagrange multiplier increment:
   $$\Delta \lambda = \frac{-C(\mathbf{x})}{w_1 + w_2 + \tilde{\alpha}}$$
5. Project positions:
   $$\Delta \mathbf{x}_1 = +w_1 \nabla C_1 \Delta \lambda, \quad \Delta \mathbf{x}_2 = -w_2 \nabla C_1 \Delta \lambda$$

---

## 4. Sub-Stepping Integration Pipeline

Each animation frame ($Delta t = 1/60\text{s}$) is partitioned into $S$ discrete sub-steps ($Delta t_{\text{sub}} = \Delta t / S$, typically $S = 10\text{--}15$):

1. **Semi-Explicit Euler Pass** (`semi_explicit_euler.compute.wgsl`):
   - $\mathbf{v}^* = \mathbf{v} \cdot (1 - \text{damping}) + \mathbf{g} \Delta t_{\text{sub}} + \mathbf{F}_{\text{wind}} \Delta t_{\text{sub}}$
   - $\mathbf{x}_{\text{pred}} = \mathbf{x} + \mathbf{v}^* \Delta t_{\text{sub}}$
   - Rigid sphere and ground plane collision penetration resolution.
2. **Compliant Constraint Solvers** (`apply_constraint.compute.wgsl`):
   - Solves distance and dihedral bending constraints over discrete Gauss-Seidel color batches.
3. **Position & Velocity Update Pass** (`update_position.compute.wgsl`):
   - $\mathbf{v} = \frac{\mathbf{x}_{\text{pred}} - \mathbf{x}}{\Delta t_{\text{sub}}}$
   - $\mathbf{x} = \mathbf{x}_{\text{pred}}$
4. **Normal Accumulation Pass** (`update_normal.compute.wgsl`):
   - Computes surface normals from cross products of deformed face vertices with atomic integer accumulation.

---

## 5. Gauss-Seidel Constraint Graph Coloring

To execute constraint projections in parallel on GPU workgroups without race conditions or atomic write hazards, the constraint graph is partitioned on the CPU using a greedy graph coloring algorithm:
- Each color partition contains non-adjacent constraints sharing no common vertices.
- Compute passes dispatch one color batch at a time, guaranteeing conflict-free parallel memory writes.

---

## 6. Environmental Forces & Rigid Colliders

- **Aerodynamic Drag**: $\mathbf{F}_{\text{wind}} = c_{\text{drag}} \cdot (\mathbf{v}_{\text{wind}} - \mathbf{v}) \cdot \Delta t_{\text{sub}}$
- **Rigid Sphere Collider**: Detects particle penetration within sphere radius $R$ and projects position to surface: $\mathbf{x} = \mathbf{c} + \frac{\mathbf{x} - \mathbf{c}}{\|\mathbf{x} - \mathbf{c}\|} (R + \epsilon)$.
- **Rigid Ground Plane**: Clamps vertical position $y \ge y_{\text{ground}}$ with friction damping.
