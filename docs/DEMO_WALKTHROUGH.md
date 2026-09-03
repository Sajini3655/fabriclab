# FabricLab — 3-Minute Demonstration Script

This walkthrough demonstrates FabricLab's core interactive capabilities in sequence.

---

### 0:00 — Introduction & Landing Page (`/`)
- Open `http://localhost:3000/`.
- Point out the hero title: **FabricLab — Interactive Material & Physics Laboratory**.
- Highlight WebGPU badges (`WEBGPU`, `XPBD`, `GPU COMPUTE`, `REAL-TIME SIMULATION`).
- Click **"ENTER LABORATORY"**.

### 0:25 — Main 3D Simulation Viewport (`/lab`)
- Observe the full-bleed 3D viewport running at $>90\text{ FPS}$.
- Show real-time telemetry (FPS, frame latency sparkline, particle count: 3,721).
- Click **Orbit Cam** and rotate the camera around the drape.

### 0:50 — Material Physics Experimentation
- In the left dock under **Materials**, switch from **Mulberry Silk** to **Raw Denim (14oz)**.
- Notice the immediate increase in bending stiffness and heavier folding behavior.
- Switch to **Natural Latex Rubber** and observe the elastic response.

### 1:15 — Direct 3D Raycasting & Anchor Tool
- Click **"✋ Grab Cloth"** on the floating overlay. Click and drag vertices in 3D space to pull the cloth.
- Click **"📌 Edit Anchors"**. Click individual particles to dynamically pin them in space.

### 1:45 — Environmental Forces & Colliders
- In the left dock under **Env**, enable **Aerodynamic Wind Drag** ($15\text{ m/s}$, azimuth $45^\circ$).
- Enable **Sphere Collider** and observe the cloth draping over the rigid sphere.

### 2:10 — Relative Deformation / Stress View
- On the top overlay, click **"🔥 Stress Heat-Map"**.
- Explain the thermal gradient (Blue $\to$ Green $\to$ Yellow $\to$ Red) mapping relative deformation and tensile tension concentrations around pinned vertices.

### 2:30 — Material Specimen Catalog & Comparison (`/materials`, `/compare`)
- Navigate to **MATERIALS** and inspect the 8 specimen cards. Open the Detail Modal for Raw Denim.
- Navigate to **COMPARE** and view the side-by-side analytical parameter matrix between Silk and Denim.

### 2:50 — Performance Benchmark Laboratory (`/benchmark`)
- Navigate to **BENCHMARK**. Click **"Run Tier"** on the 5K resolution tier.
- Observe real-time frame time sampling and the generated latency statistics table. Click **"Export CSV"**.

### 3:10 — Attribution & Architecture (`/about`)
- Navigate to **ABOUT** and show open-source attribution to Harold Ozouf (`jspdown/cloth`), MIT License, and research references (*Macklin et al. 2016, 2019*).
