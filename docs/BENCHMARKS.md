# FabricLab — Performance Benchmark Laboratory

The **Performance Benchmark Suite** provides automated resolution scaling tests to measure WebGPU compute dispatch times, frame latencies, and throughput scaling.

---

## 1. Resolution Tiers

| Tier Label | Grid Divisions | Vertex Particles $(N+1)^2$ | Face Triangles $(N^2 \times 2)$ | Sub-steps |
| :--- | :--- | :--- | :--- | :--- |
| **5K (Standard)** | $50 \times 50$ | 2,601 | 5,000 | 10 |
| **10K (Dense)** | $70 \times 70$ | 5,041 | 9,800 | 10 |
| **25K (High Fidelity)** | $110 \times 110$ | 12,321 | 24,200 | 10 |
| **50K (Extreme)** | $160 \times 160$ | 25,921 | 51,200 | 10 |
| **100K (Stress Lab)** | $225 \times 225$ | 51,076 | 101,250 | 10 |

---

## 2. Measurement Methodology

1. **Grid Reallocation**: Temporarily rebuilds the active cloth mesh to the target resolution tier.
2. **Warm-up Phase**: Executes 15 frames to allow the GPU driver pipeline caches and shader workgroups to stabilize.
3. **High-Resolution Sampling**: Records frame delta times ($\Delta t_{\text{frame}}$) over $50\text{--}120$ frames using `performance.now()`.
4. **Statistical Percentile Processing**:
   - **Mean FPS**: $\frac{1000}{\text{Mean Frame Time}}$
   - **Min FPS**: $\frac{1000}{\max(\Delta t_{\text{frame}})}$
   - **P95 Latency**: 95th percentile frame time.
   - **P99 Latency**: 99th percentile frame time.
5. **State Restoration**: Restores the user's pre-benchmark simulation grid resolution and parameters.

---

## 3. Reference Test Environment & Performance Profile

> **Hardware Context**: Measurements conducted on Intel Iris Xe Graphics (Gen-12LP) via WebGPU D3D11 backend on Windows 11.

- **5K Tier**: $\approx 107\text{ FPS}$ ($9.31\text{ ms}$ latency)
- **10K Tier**: $\approx 84\text{ FPS}$ ($11.90\text{ ms}$ latency)
- **25K Tier**: $\approx 42\text{ FPS}$ ($23.80\text{ ms}$ latency)

*Performance is hardware-, driver-, browser-, and resolution-dependent.*
