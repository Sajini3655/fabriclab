import { MaterialProperty } from "./material";
import { EnvironmentConfig } from "./environment";

export type ViewMode = "shaded" | "normal" | "wireframe" | "stress";
export type InteractionMode = "orbit" | "grab" | "anchor";
export type CameraPreset = "perspective" | "front" | "side" | "top" | "close";
export type MeshResolutionPreset = "5k" | "10k" | "25k" | "50k" | "100k" | "custom";

export interface SimulationConfig {
    subSteps: number;
    deltaTime: number;
    relaxation: number;
    width: number;
    height: number;
    widthDivisions: number;
    heightDivisions: number;
    speedMultiplier: number;
    paused: boolean;
    viewMode: ViewMode;
    interactionMode: InteractionMode;
    pinTopEdge: boolean;
    pinCornersOnly: boolean;
    customPinnedParticleIds?: number[];
}

export interface SimulationMetrics {
    fps: number;
    frameTimeMs: number;
    computeTimeMs: number;
    particleCount: number;
    triangleCount: number;
    constraintCount: number;
    colorCount: number;
    subSteps: number;
    webgpuStatus: "ready" | "running" | "unsupported" | "error";
    adapterVendor: string;
    adapterArchitecture: string;
}
