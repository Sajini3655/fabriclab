# FabricLab — Key Engineering Decisions & Rationale

---

### 1. Why WebGPU over WebGL?
- **Native Compute Shaders**: WebGPU compute pipelines allow numerical Euler integration, constraint projections, and normal accumulations to execute as parallel workgroup kernels with direct read-write storage buffers, avoiding slow render-to-texture hacks.
- **Predictable Performance**: Low-overhead driver abstractions minimize CPU dispatch overhead.

### 2. Why Extended Position-Based Dynamics (XPBD)?
- **Compliance Formulations**: XPBD introduces elastic compliance $\alpha$, eliminating time-step and iteration dependency that plagues traditional PBD solvers.
- **Unconditional Numerical Stability**: Unlike force-based explicit Euler solvers, XPBD guarantees stability without divergence or particle explosions even under large sub-step intervals.

### 3. Why Browser-Based Architecture?
- **Zero-Install Scientific Accessibility**: Enables instant interaction, testing, and benchmarking on any WebGPU-capable browser without requiring local C++/CUDA toolchain installations.

### 4. Why Client-Side Local Persistence?
- **Offline Reliability & Privacy**: Experiments and benchmark history are stored directly in browser `localStorage` with JSON import/export, eliminating the need for server accounts, cloud databases, or backend microservices.

### 5. Why Decoupled Telemetry Architecture?
- **Zero Frame Stutters**: Simulation and GPU compute execute continuously in a lightweight `requestAnimationFrame` loop without triggering DOM re-renders, while telemetry updates text nodes and canvas sparklines at throttled intervals.
