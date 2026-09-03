# FabricLab — Experiment Archive Schema (V1)

FabricLab persists laboratory simulation configurations locally using a versioned JSON format (`schemaVersion: 1`).

---

## Schema Definition

```typescript
export interface Experiment {
    id: string;                         // UUID or unique string identifier
    schemaVersion?: number;             // Schema version (Current: 1)
    name: string;                       // Descriptive title
    description: string;                // Detailed experiment notes
    tags: string[];                     // Categorization tags for filtering
    createdAt: string;                  // ISO 8601 timestamp
    updatedAt: string;                  // ISO 8601 timestamp
    isPreset?: boolean;                 // Curated baseline template flag
    material: MaterialProperty;         // Full physical material configuration
    simulation: SimulationConfig;       // Solver sub-steps, divisions, pin modes
    environment: EnvironmentConfig;     // Gravity vector, wind speed/direction, colliders
}
```

---

## Representative JSON Example

```json
{
  "id": "exp-silk-wind",
  "schemaVersion": 1,
  "name": "Mulberry Silk Fluid Wind Aerodynamics",
  "description": "Study of hyper-flexible protein filament fabric subjected to 18 m/s turbulent wind shears.",
  "tags": ["Silk", "Wind", "Fluidity"],
  "createdAt": "2026-08-15T10:00:00.000Z",
  "updatedAt": "2026-08-15T10:00:00.000Z",
  "isPreset": true,
  "material": {
    "id": "silk",
    "name": "Mulberry Silk",
    "category": "Natural Filament",
    "density": 0.065,
    "stretchCompliance": 0.0001,
    "bendCompliance": 0.015,
    "damping": 0.012,
    "friction": 0.15,
    "roughness": 0.18,
    "color": [0.35, 0.78, 0.85]
  },
  "simulation": {
    "subSteps": 12,
    "deltaTime": 0.016666666666666666,
    "relaxation": 1.0,
    "width": 10,
    "height": 10,
    "widthDivisions": 70,
    "heightDivisions": 70,
    "speedMultiplier": 1.0,
    "paused": false,
    "viewMode": "shaded",
    "interactionMode": "orbit",
    "pinTopEdge": true,
    "pinCornersOnly": false
  },
  "environment": {
    "gravityPreset": "earth",
    "gravity": [0, -9.81, 0],
    "windEnabled": true,
    "windSpeed": 18,
    "windDirectionDeg": 55,
    "windElevationDeg": 10,
    "windTurbulence": 0.45,
    "enableSphereCollider": false,
    "sphereRadius": 2.2,
    "spherePosition": [0, -3.8, 0],
    "enableGroundPlane": false,
    "groundY": -7.5
  }
}
```

---

## Import Validation & Error Handling

When importing external JSON snapshots:
1. Validates that the input is valid JSON.
2. Checks that required fields (`name`, `material.id`, `simulation.widthDivisions`, `environment.gravity`) are present and correctly typed.
3. Automatically generates a fresh `id` if absent, sets `schemaVersion: 1`, and fills missing optional properties with default configurations.
4. Returns `false` and alerts the user if zero valid experiments could be parsed.
