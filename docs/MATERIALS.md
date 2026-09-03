# FabricLab — Material Parameterization & Presets

FabricLab provides eight parameterized material presets configured to demonstrate distinct physical and visual drape behaviors within the XPBD simulation engine.

---

## Parameter Definitions

| Parameter | Unit | Physical & Simulation Meaning |
| :--- | :--- | :--- |
| **Area Density** ($\rho$) | $\text{kg/m}^2$ | Surface area mass of the textile sheet, governing inertia and gravitational sag. |
| **Stretch Compliance** ($\alpha$) | $\text{m/N}$ | Compliance of edge distance constraints. Lower values yield high tensile rigidity; higher values yield elastic stretching. |
| **Bending Compliance** ($\alpha_{\text{bend}}$) | $\text{rad/N}$ | Compliance of dihedral angle bending across adjacent triangle pairs. Controls resistance to creasing and folding. |
| **Velocity Damping** | $[0, 1]$ | Numerical dissipation factor per sub-step, simulating internal fiber friction and air resistance. |
| **Surface Friction** | $[0, 1]$ | Tangential velocity attenuation coefficient during collider contact (sphere and ground plane). |
| **Specular Roughness** | $[0, 1]$ | Microfacet optical roughness influencing specular highlight sharpness and Fresnel rim reflections. |

---

## Material Specimen Registry

```typescript
export const MATERIAL_PRESETS: Record<string, MaterialProperty> = {
    silk: {
        id: "silk",
        name: "Mulberry Silk",
        category: "Natural Filament",
        density: 0.065,              // Extremely lightweight
        stretchCompliance: 0.0001,   // Low stretch
        bendCompliance: 0.015,       // Fluid, highly flexible drape
        damping: 0.012,
        friction: 0.15,
        roughness: 0.18,             // Silky sheen
        color: [0.35, 0.78, 0.85]
    },
    cotton: {
        id: "cotton",
        name: "Organic Cotton",
        category: "Staple Fiber",
        density: 0.180,              // Balanced standard weave
        stretchCompliance: 0.0005,
        bendCompliance: 0.120,       // Moderate creasing resistance
        damping: 0.025,
        friction: 0.40,
        roughness: 0.65,             // Matte diffuse
        color: [0.88, 0.86, 0.82]
    },
    denim: {
        id: "denim",
        name: "Raw Denim (14oz)",
        category: "Heavy Twill",
        density: 0.450,              // Heavy mass
        stretchCompliance: 0.00002,  // Zero perceptible stretch
        bendCompliance: 0.650,       // High bending stiffness / structural folds
        damping: 0.050,
        friction: 0.65,
        roughness: 0.85,
        color: [0.18, 0.28, 0.52]
    },
    linen: {
        id: "linen",
        name: "Belgian Linen",
        category: "Bast Fiber",
        density: 0.230,
        stretchCompliance: 0.00008,
        bendCompliance: 0.380,       // Crisp, structured drape
        damping: 0.030,
        friction: 0.45,
        roughness: 0.72,
        color: [0.78, 0.72, 0.62]
    },
    leather: {
        id: "leather",
        name: "Tanned Calfskin",
        category: "Full-Grain Leather",
        density: 0.780,              // High mass
        stretchCompliance: 0.00001,  // Inextensible
        bendCompliance: 0.880,       // Heavy bending resistance
        damping: 0.080,
        friction: 0.75,
        roughness: 0.35,             // Subtle sheen
        color: [0.45, 0.24, 0.14]
    },
    rubber: {
        id: "rubber",
        name: "Natural Latex Rubber",
        category: "Elastomer Sheet",
        density: 0.850,
        stretchCompliance: 0.045,    // High elastic elongation
        bendCompliance: 0.060,       // Flexible bending
        damping: 0.070,
        friction: 0.90,              // High surface grip
        roughness: 0.12,             // Glossy reflection
        color: [0.15, 0.15, 0.18]
    },
    wool: {
        id: "wool",
        name: "Merino Flannel Wool",
        category: "Animal Protein",
        density: 0.360,
        stretchCompliance: 0.002,
        bendCompliance: 0.180,
        damping: 0.045,              // High internal damping
        friction: 0.55,
        roughness: 0.90,             // Soft diffuse
        color: [0.48, 0.18, 0.22]
    },
    canvas: {
        id: "canvas",
        name: "Sailcloth Duck Canvas",
        category: "Technical Duck",
        density: 0.540,
        stretchCompliance: 0.00003,
        bendCompliance: 0.720,       // Heavy tensile fabric
        damping: 0.040,
        friction: 0.60,
        roughness: 0.80,
        color: [0.72, 0.68, 0.56]
    }
};
```

> **Scientific Transparency**: The parameters above are *calibrated simulation constants* tuned for realistic qualitative behavior inside FabricLab's numerical solver, rather than certified physical laboratory test certificates.
