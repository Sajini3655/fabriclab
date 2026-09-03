# FabricLab — Deformation & Stress Visualization

## Scientific Scope & Description

The **Stress Heat-Map View** (`viewMode: "stress"`) in FabricLab renders a real-time thermal gradient mapping **Relative Deformation / Strain Energy Approximation** across the cloth mesh.

---

## 1. Mathematical Formulation

The visualization signal is computed in the vertex and fragment shader stages (`vert.wgsl` and `frag.wgsl`):

1. **Surface Normal Deviation**:
   $$\Delta n = 1.0 - n_y$$
   Measures deviation of the local surface normal from the unconstrained horizontal plane.
2. **Vertical Deflection / Sag Ratio**:
   $$\Delta y_{\text{sag}} = \text{clamp}(|y_{\text{pos}}| \cdot 0.12, 0.0, 1.0)$$
   Captures localized gravitational sag and tensile elongation relative to anchor points.
3. **Combined Strain Metric**:
   $$\epsilon_{\text{relative}} = \text{clamp}(0.6 \cdot \Delta n + 0.5 \cdot \Delta y_{\text{sag}}, 0.0, 1.0)$$

---

## 2. Turbo Colormap Gradient

The scalar metric $\epsilon_{\text{relative}} \in [0, 1]$ is evaluated through a 5-stop Turbo thermal spectrum:
- **Low (0.00 – 0.25)**: Deep Blue $\to$ Cyan (Low deformation / resting state)
- **Moderate (0.25 – 0.50)**: Cyan $\to$ Green (Gentle drape / curvature)
- **Elevated (0.50 – 0.75)**: Green $\to$ Yellow (High tensile pull / bending crease)
- **High (0.75 – 1.00)**: Yellow $\to$ Crimson Red (Peak elongation / anchor stress concentrations)

---

## 3. What This Visualization Represents (and What It Does NOT)

### What It Represents:
- Real-time visual identification of high-curvature creases, fold lines, and tensile load transfer towards anchored vertices.
- Qualitative diagnostic of how different material compliance parameters alter deformation patterns.

### What It Does NOT Represent:
- **It is NOT a certified Cauchy stress tensor measurement.**
- **It is NOT a laboratory tensile strength or Young's modulus rating.**
- **It does NOT indicate material yield or tearing thresholds.**
