export interface EnvironmentConfig {
    gravity: [number, number, number];
    gravityPreset: "earth" | "moon" | "mars" | "zero" | "custom";
    windEnabled: boolean;
    windSpeed: number;
    windDirectionDeg: number;
    windElevationDeg?: number;
    windTurbulence: number;
    enableGroundPlane: boolean;
    groundHeight?: number;
    groundY?: number;
    enableSphereCollider: boolean;
    sphereCenter?: [number, number, number];
    spherePosition?: [number, number, number];
    sphereRadius: number;
}
