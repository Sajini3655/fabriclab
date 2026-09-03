export interface BenchmarkResult {
    id: string;
    timestamp: string;
    resolutionLabel: string;
    divisions: number;
    particleCount: number;
    triangleCount: number;
    constraintCount: number;
    avgFps: number;
    minFps: number;
    avgFrameTimeMs: number;
    p99FrameTimeMs: number;
    durationSeconds: number;
    gpuVendor: string;
}
