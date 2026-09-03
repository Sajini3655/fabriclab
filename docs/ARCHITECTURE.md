# FabricLab Technical Architecture Document

FabricLab is an interactive 3D physics and material simulation platform built on **WebGPU** compute pipelines and **Extended Position-Based Dynamics (XPBD)**.

---

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FabricLab Application Shell                      │
├────────────────────────────────┬───────────────────────────────────────┤
│    Navigation & Routing        │  Command Palette & Modals (Ctrl+K)    │
│    (/, /lab, /materials, etc.) │  (Material Detail, Help, Onboarding)  │
├────────────────────────────────┴───────────────────────────────────────┤
│                       Reactive State Management                        │
│                   (Store.ts - Pub/Sub Event Bus)                       │
├────────────────────────────────┬───────────────────────────────────────┤
│     High-Level Orchestrator    │         Telemetry & Profiling         │
│     (SimulationEngine.ts)      │  (Throttled Metric Subscriptions)     │
└───────────────┬────────────────┴───────────────────┬───────────────────┘
                │                                    │
                ▼                                    ▼
┌────────────────────────────────┐   ┌───────────────────────────────────┐
│     Interactive Subsystems     │   │      Persistent Services          │
│ - 3D Raycaster & Vertex Grab   │   │ - ExperimentService (Storage)     │
│ - Anchor / Pinning Editor      │   │ - BenchmarkRunner (Stress Tests)  │
│ - Camera Orbit & Presets       │   │ - Export/Import JSON & CSV        │
└───────────────┬────────────────┘   └───────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      WebGPU Compute & Render Core                      │
├────────────────────────────────┬───────────────────────────────────────┤
│     GPU Compute Passes         │         GPU Render Pipelines          │
│ - Semi-Explicit Euler (Wind)   │ - PBR Double-Sided Shading            │
│ - XPBD Constraint Batches      │ - Normal Vectors Mode                 │
│ - Dihedral Bending Passes      │ - Wireframe Shader                    │
│ - Atomic Face Normals Accum.   │ - Stress/Strain Thermal Heatmap       │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## Core Simulation Pipeline

Each animation frame executes the following sub-stepped compute passes on the GPU:

1. **Sub-stepping Loop (e.g. 10 sub-steps per frame)**:
   - **Semi-Explicit Euler Pass** (`semi_explicit_euler.compute.wgsl`):
     - Predicts intermediate positions `x_pred = x + v * dt + g * dt^2`.
     - Applies aerodynamic wind drag forces `F_wind = c_drag * ((v_wind - v) · n) * n`.
     - Applies velocity damping and enforces rigid sphere & ground collider penetration constraints.
   - **Compliant Constraint Projection Passes** (`apply_constraint.compute.wgsl`):
     - Evaluates distance constraints and dihedral bending constraints.
     - Solves constraints across discrete Gauss-Seidel color batches to eliminate atomic write conflicts.
   - **Position Update Pass** (`update_position.compute.wgsl`):
     - Updates velocities `v = (x_pred - x) / dt` and sets `x = x_pred`.
2. **Normal Vector Pass** (`update_normal.compute.wgsl`):
   - Atomically computes face normals from cross-products of updated vertex positions.
3. **Render Pass** (`vert.wgsl`, `frag.wgsl`):
   - Renders 3D cloth surface using selected diagnostic display mode (PBR Shaded, Normal vectors, Wireframe, or Stress Heatmap).

---

## Decoupled Telemetry Performance Strategy

To ensure fluid $>100\text{ FPS}$ performance, telemetry metrics (FPS, frame latency, active particle counts) are decoupled from DOM re-render loops:
- The `requestAnimationFrame` loop in `SimulationEngine.ts` operates independently of UI view renders.
- Telemetry callbacks update lightweight HTML text nodes and a rolling canvas sparkline at throttled intervals (every 2-3 frames), maintaining $0\%$ CPU DOM overhead.
