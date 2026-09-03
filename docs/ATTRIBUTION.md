# FabricLab — Open-Source & Scientific Attribution

FabricLab is an interactive 3D physics and material science laboratory engineered on top of WebGPU compute pipelines and Extended Position-Based Dynamics (XPBD).

---

## Upstream Open-Source Foundation

- **Original Project**: [jspdown/cloth](https://github.com/jspdown/cloth)
- **Original Author**: Harold Ozouf (GitHub: [@jspdown](https://github.com/jspdown))
- **Original License**: [MIT License](https://github.com/jspdown/cloth/blob/master/LICENSE.txt) (Copyright © 2023 Harold Ozouf)

### Retained Upstream Concepts & Core Foundations
1. **XPBD Distance & Bending Formulation**: Core WGSL compute kernels implementing position constraint projections and dihedral angle bending.
2. **Gauss-Seidel Constraint Graph Coloring**: Greedy graph coloring algorithm running on the CPU to partition non-adjacent constraint edges into discrete color batches, preventing atomic write collisions during parallel GPU execution.
3. **Atomic Face Normal Accumulation**: Parallel WGSL compute shader calculating cross-product face normals with atomic integer accumulation.

---

## Major Functionality Independently Added in FabricLab

FabricLab substantially extends and transforms the original demonstration into a production-grade interactive scientific application:

1. **3D Screen-to-World Raycaster & Direct Cloth Interaction**:
   - Camera inverse unprojection matrix pipelines (`Raycaster.ts`).
   - Dynamic real-time particle grabbing, dragging, stretching, and physical release with mass pinning.
   - Interactive **Edit Anchors Mode** allowing users to click cloth particles to dynamically pin/unpin them.
2. **Material Science Presets System**:
   - 8 calibrated physical material presets (**Mulberry Silk, Organic Cotton, Raw Denim, Belgian Linen, Tanned Calfskin, Natural Latex Rubber, Merino Flannel Wool, Sailcloth Duck Canvas**).
   - Parameterized area density (`kg/m²`), stretch compliance (α), bending compliance (α), damping, and friction coefficients.
   - Interactive **Material Detail Modal** with parameter distribution visualizers.
3. **Aerodynamic Wind Forces & Rigid Colliders**:
   - Aerodynamic drag forces implemented in compute WGSL: `F_wind = c_drag * ((v_wind - v) · n) * n`.
   - Variable wind azimuth (0–360°), speed (0–40 m/s), and elevation.
   - Rigid sphere collider with penetration resolution and ground plane constraints.
4. **Stress & Strain Heatmap Visualization**:
   - Physically derived localized deformation metric mapped to a continuous thermal color spectrum (Blue → Cyan → Green → Yellow → Red).
5. **Automated Multi-Tier Performance Benchmark Laboratory**:
   - Automated stress testing across resolution tiers (5K to 100K particles).
   - Real-time sampling of Mean FPS, Min FPS, Mean Frame Time, and P99 Frame Latency.
   - One-click CSV export and benchmark reproducibility tracking.
6. **Persistent Laboratory Experiment Archive**:
   - Versioned JSON snapshot schema (`schemaVersion: 1`) with localStorage persistence, preset duplication, search/filtering, and full JSON export/import.
7. **Dual Material Comparison Laboratory**:
   - Synchronized comparative analysis of two material specimens under identical physical forces.
8. **Universal Command Palette (`Ctrl+K` / `Cmd+K`) & First-Run Onboarding**:
   - Keyboard-navigable quick command launcher and interactive step-by-step tutorial tour.
9. **Decoupled High-Performance UI Architecture**:
   - Clean state management ensuring simulation compute loops execute at native hardware refresh rates (>100 FPS) with 0% UI re-render overhead.

---

## Academic Physics Literature Referenced

The physics simulation engine implements algorithms and principles published in the following peer-reviewed research papers:

1. **Position-Based Simulation of Compliant Constrained Dynamics (2016)**
   - *Authors*: Miles Macklin, Matthias Müller, Nuttapong Chentanez
   - *Publication*: ACM Transactions on Graphics (TOG) / SIGGRAPH 2016
   - *Contribution*: Mathematical foundation for Extended Position-Based Dynamics (XPBD) using compliant constraints with time-step independent stiffness compliance (α).

2. **Small Steps in Physics Simulation (2019)**
   - *Authors*: Miles Macklin, Kier Storey, Michelle Lu, Pierre Terdiman, Stefan Jeschke, Matthias Müller
   - *Publication*: ACM SIGGRAPH / SCA 2019
   - *Contribution*: Sub-stepping integration techniques for resolving high-stiffness constraints efficiently with small dt iterations.

3. **Detailed Rigid Body Simulation with Extended Position Based Dynamics (2020)**
   - *Authors*: Matthias Müller, Miles Macklin, Chee Wee Kim, Stefan Jeschke
   - *Contribution*: Compliant contact and collider penetration resolution.

---

## Third-Party Libraries & Dependencies

- **WebGPU Specification & Types**: `@webgpu/types`
- **UUID**: `uuid` (RFC 4122 unique identifier generation)
- **Webpack**: Webpack 5, ts-loader, css-loader, mini-css-extract-plugin
