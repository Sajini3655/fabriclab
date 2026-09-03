# FabricLab — Interactive Material & Physics Laboratory

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online%20(GitHub%20Pages)-10b981?style=for-the-badge&logo=github)](https://sajini3655.github.io/fabriclab/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Sajini3655%2Ffabriclab-181717?style=for-the-badge&logo=github)](https://github.com/Sajini3655/fabriclab)
[![Tests Passing](https://img.shields.io/badge/Tests-10%2F10%20Passing-38bdf8?style=for-the-badge)](https://github.com/Sajini3655/fabriclab)
[![License: MIT](https://img.shields.io/badge/License-MIT-e07a5f?style=for-the-badge)](LICENSE.txt)

**FabricLab** is an interactive computational material physics laboratory running natively in the browser on **WebGPU** compute pipelines and **Extended Position-Based Dynamics (XPBD)**. It enables real-time client-side exploration of digital textile mechanics, compliant constraints, dihedral bending, aerodynamic wind fields, and rigid-body collisions with 60+ FPS performance.

---

## 🌟 Key Features

### 🔬 Real-Time GPU Physics Simulation (XPBD)
- **Native WebGPU Compute Engine**: Numerical sub-stepping, compliant distance constraints, dihedral bending, aerodynamic wind drag, and atomic surface normal accumulation execute entirely in parallel on GPU compute shaders (WGSL).
- **Parallel Gauss-Seidel Constraint Solving**: Greedy graph coloring partitions non-conflicting constraint edges into discrete color batches, preventing atomic race conditions across parallel GPU workgroups.

### 🧵 Parameterized Material Science System
- **8 Calibrated Material Presets**: Mulberry Silk, Organic Cotton, Raw Denim (14oz), Belgian Linen, Tanned Calfskin, Natural Latex Rubber, Merino Flannel Wool, and Sailcloth Duck Canvas.
- **Physical Parameters**: Calibrated area density ($	ext{kg/m}^2$), stretch compliance ($alpha = 1/k$), bending compliance ($alpha$), internal damping, friction, and specular roughness.
- **Material Specimen Catalog**: Comprehensive physical parameter distribution analysis with one-click laboratory loading.

### 🌪️ Environmental Fields & Aerodynamic Drag
- **Planetary Gravitational Fields**: Earth ($-9.81	ext{ m/s}^2$), Moon ($-1.62	ext{ m/s}^2$), Mars ($-3.72	ext{ m/s}^2$), Zero Gravity, and custom vectors.
- **Aerodynamic Wind Drag & Dynamic Flutter**: Directional wind vectors ($0	ext{--}40	ext{ m/s}$) with spatial turbulence and rotational azimuth control ($0	ext{--}360^circ$).
- **Rigid Body Colliders**: Sphere colliders and ground boundary planes with friction restitution.

### ✋ Direct 3D Raycasting & Anchor Pinning
- **Screen-to-World Raycasting**: Real-time unprojected 3D camera raycasting to grab, stretch, pull, and release cloth vertices in 3D world space.
- **Dynamic Anchor / Pinning Tool**: In-place editing mode allowing clicking individual particles to dynamically pin or unpin them in space with calibrated inverse-mass restoration.

### 🔥 Relative Deformation / Strain Visualization
- **Deformation Heat-Map**: Real-time fragment shader mapping localized surface curvature, normal deviation, and gravitational strain to a scientific Turbo colormap (Blue $	o$ Cyan $	o$ Green $	o$ Yellow $	o$ Red) with floating HUD legend.

### ⚖️ Analytical Material Comparison Matrix
- **Side-by-Side Comparison**: Direct comparative inspection of material properties, mass, compliance, and damping under matched physical environments.

### 💾 Persistent Laboratory Experiment Archive
- **Versioned JSON Snapshots**: Versioned schema (`schemaVersion: 1`) with local `localStorage` persistence, tag filtering, duplication, deletion, and schema-hardened JSON export/import.

### ⚡ Multi-Tier Performance Benchmark Suite
- **Automated Stress Testing**: Automated benchmark tiers ($5	ext{K}$ to $100	ext{K}$ particles) sampling frame times with `performance.now()`, computing Mean FPS, Min FPS, Mean Latency, and P95/P99 latency percentiles, with persistent session history and CSV export.

### 📱 Responsive Digital Material Studio UI
- **Modern Full-Width Layout**: Adaptive container (`min(92vw, 1560px)`), natural browser window scrolling for editorial views, dedicated full-viewport 3D workspace for `/lab`, and a 3-line expandable hamburger navigation menu for mobile devices.

---

## 🏛️ Architecture Overview

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
│ - Atomic Face Normals Accum.   │ - Relative Deformation Heatmap        │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Graphics & Compute Engine**: WebGPU API (WGSL compute and fragment shaders)
- **Programming Language**: TypeScript (strict mode, zero UI framework overhead)
- **Physics Solver**: Extended Position-Based Dynamics (XPBD) with Gauss-Seidel constraint projections
- **Build System**: Webpack 5.82.0, ts-loader, mini-css-extract-plugin, html-webpack-plugin (with content hashing)
- **Testing**: Node.js Native Test Runner (`node --test`)
- **Package Manager**: Yarn Classic (v1.22.22)
- **CI / CD**: GitHub Pages Automated Deployment

---

## 🗺️ Application Routes

- `/` — **Exhibition Home**: Focused exhibition hero stage introducing digital material simulation and real-time WebGPU status.
- `/lab` — **Main Laboratory**: Dedicated full-viewport 3D workstation, collapsible control docks, and floating toolbars.
- `/materials` — **Material Specimen Archive**: 8 calibrated physical textile specimens with parameter cards and detail modals.
- `/compare` — **Comparison Matrix**: Side-by-side analytical parameter matrix comparing dual material specimens.
- `/experiments` — **Research Archive**: Searchable laboratory snapshots with tag filtering, duplication, and JSON import/export.
- `/benchmark` — **Performance Laboratory**: Automated multi-tier stress tests ($5\text{K}\text{--}100\text{K}$ particles) and CSV export.
- `/about` — **Scientific Documentation & Attribution**: XPBD mathematical formulation, citations, and open-source attribution.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Yarn Classic (1.22.x)
- A WebGPU-capable browser (Google Chrome 113+, Microsoft Edge 113+, Brave)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sajini3655/fabriclab.git
cd fabriclab
yarn install
```

### 2. Launch Development Server
```bash
yarn start
```
Open `http://localhost:3000/` in a WebGPU-enabled browser.

### 3. Run Automated Unit Tests
```bash
yarn test
```

### 4. Build Production Release
```bash
yarn build
```

---

## 📑 Documentation Index

- [`docs/PHYSICS.md`](docs/PHYSICS.md) — Mathematical XPBD formulation, particle mass weighting, sub-stepping, and Gauss-Seidel coloring.
- [`docs/MATERIALS.md`](docs/MATERIALS.md) — Registry of 8 parameterized material presets and physical parameter definitions.
- [`docs/VISUALIZATION.md`](docs/VISUALIZATION.md) — Mathematical derivation and scope of the relative deformation heat-map.
- [`docs/BENCHMARKS.md`](docs/BENCHMARKS.md) — Benchmark tiers, sampling methodology, and latency percentiles.
- [`docs/EXPERIMENT_SCHEMA.md`](docs/EXPERIMENT_SCHEMA.md) — Schema version 1 JSON specification, sample payload, and import validation rules.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Detailed technical architecture breakdown and subsystem interactions.
- [`docs/ENGINEERING_DECISIONS.md`](docs/ENGINEERING_DECISIONS.md) — Engineering rationale for WebGPU, XPBD, client-side persistence, and decoupled telemetry.
- [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) — Known system boundaries and future roadmap opportunities.
- [`docs/DEMO_WALKTHROUGH.md`](docs/DEMO_WALKTHROUGH.md) — Structured live demonstration walkthrough script.
- [`docs/ATTRIBUTION.md`](docs/ATTRIBUTION.md) — Upstream open-source attribution (Harold Ozouf, `jspdown/cloth`, MIT License) and academic citations.
- [`docs/PHASE5_DOCUMENTATION_REPORT.md`](docs/PHASE5_DOCUMENTATION_REPORT.md) — Final documentation summary and verification report.
- [`docs/PHASE6_RELEASE_REPORT.md`](docs/PHASE6_RELEASE_REPORT.md) — Production release verification audit report.

---

## 📜 Open-Source Foundation & Research Attribution

FabricLab builds upon an open-source WebGPU XPBD cloth simulation foundation authored by **Harold Ozouf ([jspdown/cloth](https://github.com/jspdown/cloth))**, licensed under the **MIT License**.

### Academic Research References
1. **Position-Based Simulation of Compliant Constrained Dynamics (2016)**  
   *Miles Macklin, Matthias Müller, Nuttapong Chentanez* — ACM Transactions on Graphics (TOG) / SIGGRAPH 2016.
2. **Small Steps in Physics Simulation (2019)**  
   *Miles Macklin, Kier Storey, Michelle Lu, Pierre Terdiman, Stefan Jeschke, Matthias Müller* — ACM SIGGRAPH / SCA 2019.
3. **Detailed Rigid Body Simulation with Extended Position Based Dynamics (2020)**  
   *Matthias Müller, Miles Macklin, Chee Wee Kim, Stefan Jeschke*.

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.txt).
