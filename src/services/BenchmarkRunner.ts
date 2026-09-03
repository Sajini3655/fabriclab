import { SimulationEngine } from "../simulation/engine/SimulationEngine";
import { BenchmarkResult } from "../types/benchmark";

export interface BenchmarkTier {
    label: string;
    divisions: number;
    framesToSample: number;
}

export const BENCHMARK_TIERS: BenchmarkTier[] = [
    { label: "5K (Standard)", divisions: 50, framesToSample: 120 },
    { label: "10K (Dense)", divisions: 70, framesToSample: 100 },
    { label: "25K (High Fidelity)", divisions: 110, framesToSample: 80 },
    { label: "50K (Extreme)", divisions: 160, framesToSample: 60 },
    { label: "100K (Stress Lab)", divisions: 225, framesToSample: 50 },
];

export class BenchmarkRunner {
    private engine: SimulationEngine;
    private running: boolean = false;

    constructor(engine: SimulationEngine) {
        this.engine = engine;
    }

    public get isRunning(): boolean {
        return this.running;
    }

    public async runBenchmark(
        tier: BenchmarkTier,
        onProgress?: (progressPercent: number, currentFps: number) => void
    ): Promise<BenchmarkResult> {
        this.running = true;

        const originalWidthDivs = this.engine.config.widthDivisions;
        const originalHeightDivs = this.engine.config.heightDivisions;
        const originalPaused = this.engine.config.paused;

        // Apply benchmark resolution
        this.engine.setPhysics({
            widthDivisions: tier.divisions,
            heightDivisions: tier.divisions,
            paused: false
        });

        // Warm up for 15 frames
        for (let i = 0; i < 15; i++) {
            await new Promise(r => requestAnimationFrame(r));
        }

        const benchmarkConstraintCount = this.engine.cloth.constraints.count;
        const frameTimes: number[] = [];
        let lastTime = performance.now();

        for (let f = 0; f < tier.framesToSample; f++) {
            await new Promise(r => requestAnimationFrame(r));
            const now = performance.now();
            const dt = now - lastTime;
            lastTime = now;
            frameTimes.push(dt);

            if (onProgress && f % 5 === 0) {
                const instantFps = dt > 0 ? Math.round(1000 / dt) : 60;
                onProgress(Math.round((f / tier.framesToSample) * 100), instantFps);
            }
        }

        // Restore original setup
        this.engine.setPhysics({
            widthDivisions: originalWidthDivs,
            heightDivisions: originalHeightDivs,
            paused: originalPaused
        });

        this.running = false;

        // Calculate statistics
        const sorted = [...frameTimes].sort((a, b) => a - b);
        const sum = frameTimes.reduce((acc, v) => acc + v, 0);
        const avgFrameTime = sum / frameTimes.length;
        const avgFps = Math.round(1000 / avgFrameTime);
        const maxFrameTime = sorted[sorted.length - 1];
        const minFps = Math.round(1000 / maxFrameTime);
        const p99Index = Math.floor(sorted.length * 0.99);
        const p99FrameTime = sorted[p99Index] || avgFrameTime;

        const particleCount = (tier.divisions + 1) * (tier.divisions + 1);
        const triangleCount = tier.divisions * tier.divisions * 2;
        const constraintCount = benchmarkConstraintCount;

        return {
            id: "bench-" + Date.now(),
            timestamp: new Date().toISOString(),
            resolutionLabel: tier.label,
            divisions: tier.divisions,
            particleCount,
            triangleCount,
            constraintCount,
            avgFps,
            minFps,
            avgFrameTimeMs: Number(avgFrameTime.toFixed(2)),
            p99FrameTimeMs: Number(p99FrameTime.toFixed(2)),
            durationSeconds: Number((sum / 1000).toFixed(2)),
            gpuVendor: "WebGPU Device",
        };
    }
}
