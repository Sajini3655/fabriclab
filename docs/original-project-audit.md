# Technical Baseline Audit: jspdown/cloth

This document establishes the technical audit, architectural breakdown, verification results, and baseline evaluation for the open-source repository `jspdown/cloth`. This serves as the technical foundation for the future **FabricLab — Interactive Material & Physics Laboratory** project.

---

## 1. Repository & Metadata

- **Repository URL**: `https://github.com/jspdown/cloth`
- **Project Name**: `cloth`
- **Original Author**: Harold Ozouf (`jspdown`)
- **License**: MIT License (Copyright © 2023 Harold Ozouf) — Fully permits commercial use, modification, distribution, and private use.
- **Framework**: Vanilla TypeScript (No UI framework; direct DOM rendering)
- **Language**: TypeScript 5.0.4, WGSL (WebGPU Shading Language)
- **Build Tool**: Webpack 5.82.0 with `ts-loader` and `webpack-dev-server` 4.13.3
- **Package Manager**: Yarn (Yarn Classic lockfile `yarn.lock`, tested on Yarn v1.22.22)
- **Engines / Target**: Node.js `>=14`, Browsers with native WebGPU support

---

## 2. Current Features & Verification Status

| Feature | Claimed / Expected | Actual Working Status | Notes |
| :--- | :--- | :--- | :--- |
| **WebGPU Initialization** | Yes | **Working** | Required 1-line fallback fix for `adapter.requestAdapterInfo()` (see Compatibility section). |
| **XPBD Compute Simulation** | Yes | **Working** | Full GPU execution via 4 compute pipelines. |
| **Parallel Gauss-Seidel Solver** | Yes | **Working** | Graph coloring algorithm groups non-conflicting constraints to prevent write hazards. |
| **Gravity Physics** | Yes | **Working** | Configurable acceleration vector `(0, -9.8, 0)` integrated in semi-explicit Euler pass. |
| **Stretch & Bend Constraints** | Yes | **Working** | Configurable compliance parameters applied across mesh topology. |
| **Fixed Anchors** | Yes | **Working** | Top edge particles ($z = 0$) pinned with `inverseMass = 0.0`. |
| **Real-time Surface Normals** | Yes | **Working** | Computed dynamically on GPU using atomic accumulation in compute shader. |
| **3D Rendering Pipeline** | Yes | **Working** | Perspective projection, depth stencil pass, normal-based vertex coloring. |
| **Wireframe Mode** | Yes | **Working** | Toggled via keyboard shortcut `W`. |
| **Play / Pause / Restart** | Yes | **Working** | Toggled via UI button or `Spacebar`. |
| **Orbit Camera** | Yes | **Working** | Mouse drag orbits azimuth/elevation; mouse wheel controls zoom. |
| **Cloth Mouse Interaction** | Mentioned in README | **Not Implemented** | README claimed clicking/dragging pulls cloth; in reality, mouse events are captured exclusively by Orbit Camera. |
| **Collision Handling** | No | **Not Implemented** | No self-collision, ground plane, or rigid collider support. |

---

## 3. Architecture & Technical Breakdown

### 3.1 Frontend & Build Architecture
- **Bundling**: Webpack 5 config (`config/webpack.dev.js` and `config/webpack.prod.js`).
- **WGSL Loading**: Shaders are imported directly as raw strings using Webpack 5 built-in asset type (`type: "asset/source"`).
- **DOM & UI**: Monolithic vanilla TypeScript controllers (`controller.ts`, `logger.ts`, `monitor.ts`) rendering plain HTML templates into predefined container `<div>` elements.
- **Styling**: Single stylesheet `src/main.css` using monospace typography and fixed dimensions.

### 3.2 Physics Simulation Architecture
The simulation implements **Extended Position-Based Dynamics (XPBD)** with small-step sub-stepping based on:
1. *Macklin et al., 2016* — "Position-Based Simulation of Compliant Constrained Dynamics"
2. *Macklin et al., 2019* — "Small Steps in Physics Simulation"

#### Simulation Step Flow (Per Frame):
```
App.run() [requestAnimationFrame loop]
│
├── 1. CPU -> GPU Buffer Uploads (if geometry or parameters marked dirty)
│
├── 2. Solver.solve() Compute Pass [N Sub-Steps]:
│     │
│     ├── A. semiExplicitEuler Pipeline:
│     │      v_i = v_i + g * dt
│     │      x_tilde_i = x_i + v_i * dt
│     │
│     ├── B. applyConstraints Pipeline (Iterated per Constraint Graph Color):
│     │      Evaluates distance & dihedral constraints
│     │      Calculates Lagrange multiplier Δλ = -C(x) / (Σ w_i + α_tilde)
│     │      Corrects predicted positions x_tilde without race conditions
│     │
│     └── C. updatePositions Pipeline:
│            v_i = (x_tilde_i - x_i) / dt
│            x_i = x_tilde_i
│
├── 3. updateNormals Compute Pass:
│      Face normal cross product -> Atomic accumulation into normal buffer
│
└── 4. Renderer.render() Draw Pass:
       DrawIndexed with camera uniform buffer and depth-stencil buffer
```

### 3.3 Constraint Graph Coloring
To execute Gauss-Seidel constraint solving in parallel on the GPU without write hazards on shared particle vertices, the CPU builds an adjacency graph and partitions constraints into independent color batches (`Constraints.color()`). Within each color batch, no two constraints share a vertex, allowing conflict-free parallel execution across GPU compute workgroups.

### 3.4 WebGPU Pipelines & GPU Resources

| Pipeline Name | Type | Shaders | Bind Groups & Buffers |
| :--- | :--- | :--- | :--- |
| `semi-explicit-euler` | Compute | `semi_explicit_euler.compute.wgsl` | Group 0: positions, estimatedPositions, velocities, inverseMasses.<br>Group 1: solverConfig uniform. |
| `apply-constraint` | Compute | `apply_constraint.compute.wgsl` | Group 0: estimatedPositions, inverseMasses, restValues, compliances, affectedParticles.<br>Group 1: solverConfig.<br>Group 2: colorConfig (dynamic uniform offset). |
| `update-position` | Compute | `update_position.compute.wgsl` | Group 0: positions, estimatedPositions, velocities.<br>Group 1: solverConfig. |
| `update-normal` | Compute | `update_normal.compute.wgsl` | Group 0: positions, triangle indices, atomic normal storage buffer. |
| Main Mesh Render | Render | `vert.wgsl`, `frag.wgsl` | Group 0: Camera uniforms (projection & view matrix).<br>Attributes: position (`vec3<f32>`), normal (`vec3<i32>` scaled). |

---

## 4. Observable Baseline Performance Metrics

Measurements recorded under Google Chrome 152 on Windows 11 with integrated Intel GPU:

- **Cloth Mesh Dimensions**: 10m $\times$ 10m
- **Grid Subdivisions**: $100 \times 100$
- **Vertex / Particle Count**: $101 \times 101 = 10,201$ particles
- **Triangle Count**: $20,000$ triangles
- **Constraint Count**: ~50,000 constraints (~30,000 stretch + ~20,000 bend)
- **Color Batches**: Graph colored into ~16-32 independent dispatch passes
- **Sub-Steps**: 10 sub-steps per frame
- **Idle Frame Latency**: `~5.96 ms`
- **Active Simulation Frame Latency**: `~8.22 ms` (equivalent to `> 120 FPS` execution capability)

---

## 5. Problems, Limitations & Compatibility Findings

1. **WebGPU Specification Drift (`adapter.requestAdapterInfo`)**:
   - *Problem*: In `src/index.ts:41`, `await adapter.requestAdapterInfo()` threw `TypeError: adapter.requestAdapterInfo is not a function`.
   - *Cause*: W3C WebGPU specification transitioned `requestAdapterInfo()` to synchronous property `adapter.info`.
   - *Fix Applied*: `(adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : (adapter as any).info) || {}`.

2. **Absence of Direct Cloth Raycasting / Dragging**:
   - *Problem*: User cannot grab, stretch, or pull cloth vertices with the mouse.
   - *Cause*: Mouse listeners only feed into camera orbit rotation.

3. **Hardcoded Top-Edge Boundary Condition**:
   - *Problem*: Pinned vertices are statically hardcoded in `cloth.ts` via `particle.position.z === 0`.
   - *Limitation*: No UI or API to select custom pin points (e.g., two corners, flagpole, curtain rings).

4. **Lack of Collisions**:
   - *Problem*: Cloth passes directly through itself and cannot interact with physical objects (spheres, cubes, terrain).

5. **Basic Rendering & Shading**:
   - *Problem*: Visual output maps normal vectors directly to RGB without lighting, roughness, specular reflection, PBR, ambient occlusion, or textures.

6. **UI & State Ergonomics**:
   - *Problem*: Modifying parameters in the HTML form and clicking "Apply" causes complete destruction and reconstruction of the GPU buffers, causing a visual stutter.

---

## 6. Reusable Foundation for FabricLab

The following components represent high technical value to reuse directly or expand for FabricLab:

1. **WGSL XPBD Core (`src/physic/shaders/`)**:
   - The WGSL compute shaders for XPBD position correction, numerical integration, and atomic normal generation are mathematically sound, highly optimized, and clean.
2. **Graph Coloring Solver (`src/physic/constraints.ts`)**:
   - The constraint graph coloring logic provides an effective foundation for hazard-free GPU Gauss-Seidel solving.
3. **Mesh Topology Extractor (`src/triangles.ts`)**:
   - Extracts unique edge pairs and adjacent triangle pairs for generating stretch and dihedral bend constraints.
4. **Camera & Math Utilities (`src/camera.ts`, `src/math/`)**:
   - Lightweight matrix and vector utilities tailored for WebGPU buffer layouts without external heavy math dependencies.

---

## 7. Key Files Inventory

| File Path | Description & Architectural Purpose |
| :--- | :--- |
| [`src/index.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/index.ts) | Application entry point; initializes WebGPU adapter/device and starts simulation loop. |
| [`src/app.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/app.ts) | Main application orchestrator managing RAF loop, solver invocation, and renderer. |
| [`src/renderer.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/renderer.ts) | WebGPU 3D render pipeline manager for cloth mesh and wireframe rendering. |
| [`src/cloth.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/cloth.ts) | Cloth entity model initializing particles, vertex masses, and structural/bend constraints. |
| [`src/physic/solver.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/solver.ts) | XPBD GPU solver managing compute pipelines, bind groups, and sub-step dispatch loops. |
| [`src/physic/constraints.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/constraints.ts) | Constraint buffer management and CPU graph coloring algorithm. |
| [`src/physic/particles.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/particles.ts) | Particle GPU buffer definitions (positions, velocities, estimated positions, inverse masses). |
| [`src/physic/shaders/apply_constraint.compute.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/shaders/apply_constraint.compute.wgsl) | Core WGSL XPBD constraint projection shader. |
| [`src/physic/shaders/semi_explicit_euler.compute.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/shaders/semi_explicit_euler.compute.wgsl) | WGSL Euler numerical integration and position estimation shader. |
| [`src/physic/shaders/update_position.compute.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/shaders/update_position.compute.wgsl) | WGSL position commit and velocity update shader. |
| [`src/physic/shaders/update_normal.compute.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/physic/shaders/update_normal.compute.wgsl) | WGSL atomic normal accumulation compute shader. |
| [`src/shaders/vert.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/shaders/vert.wgsl) | Vertex shader applying MVP transformation and normal unpacking. |
| [`src/shaders/frag.wgsl`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/shaders/frag.wgsl) | Fragment shader rendering normal colors. |
| [`src/camera.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/camera.ts) | 3D Orbit Camera with projection/view uniform buffer. |
| [`src/controller.ts`](file:///C:/Users/sajin/.gemini/antigravity/scratch/cloth/src/controller.ts) | DOM controller handling parameter inputs and play/pause/wireframe events. |
