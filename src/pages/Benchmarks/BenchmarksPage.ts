import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { BenchmarkRunner, BENCHMARK_TIERS } from "../../services/BenchmarkRunner";
import { BenchmarkResult } from "../../types/benchmark";

const BENCHMARK_STORAGE_KEY = "fabriclab_benchmark_history_v1";

export class BenchmarksPage {
    private el: HTMLElement;
    private runner: BenchmarkRunner;
    private results: BenchmarkResult[] = [];
    private history: BenchmarkResult[] = [];

    constructor(engine: SimulationEngine) {
        this.runner = new BenchmarkRunner(engine);
        this.el = document.createElement("div");
        this.el.className = "page-screen";
        this.loadHistory();
        this.render();
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private loadHistory(): void {
        try {
            const raw = localStorage.getItem(BENCHMARK_STORAGE_KEY);
            if (raw) this.history = JSON.parse(raw);
        } catch (e) {
            this.history = [];
        }
    }

    private saveHistory(): void {
        try {
            localStorage.setItem(BENCHMARK_STORAGE_KEY, JSON.stringify(this.history));
        } catch (e) {}
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">FabricLab XPBD Performance Benchmark Suite</h1>
                    <p class="page-subtitle">Automated resolution stress testing measuring sub-step frame latency, throughput, and WebGPU compute scaling.</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" id="btn-run-all-benchmarks">▶ Run Full Suite</button>
                    <button class="btn btn-secondary" id="btn-export-benchmarks">📥 Export CSV</button>
                </div>
            </div>

            <!-- Live Progress Bar -->
            <div id="benchmark-progress-box" style="display: none; background: var(--bg-surface); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 16px; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                    <span id="benchmark-status-label">Benchmarking Resolution Tier...</span>
                    <span id="benchmark-fps-live" style="font-family: var(--font-mono); color: var(--accent-emerald);">60 FPS</span>
                </div>
                <div style="width: 100%; height: 6px; background: var(--bg-base); border-radius: 3px; overflow: hidden;">
                    <div id="benchmark-progress-bar" style="width: 0%; height: 100%; background: var(--accent-blue); transition: width 0.1s ease;"></div>
                </div>
            </div>

            <!-- Benchmark Tiers Table -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Resolution Tier</th>
                            <th>Grid Divisions</th>
                            <th>Particles</th>
                            <th>Triangles</th>
                            <th>Mean FPS</th>
                            <th>Min FPS</th>
                            <th>Mean Latency</th>
                            <th>P99 Latency</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="benchmark-table-body">
                        ${BENCHMARK_TIERS.map(t => `
                            <tr data-tier="${t.label}">
                                <td style="font-weight: 600; color: var(--text-primary);">${t.label}</td>
                                <td>${t.divisions}x${t.divisions}</td>
                                <td>${((t.divisions+1)*(t.divisions+1)).toLocaleString()}</td>
                                <td>${(t.divisions*t.divisions*2).toLocaleString()}</td>
                                <td class="col-avg-fps" style="color: var(--text-muted);">-</td>
                                <td class="col-min-fps" style="color: var(--text-muted);">-</td>
                                <td class="col-avg-ft" style="color: var(--text-muted);">-</td>
                                <td class="col-p99-ft" style="color: var(--text-muted);">-</td>
                                <td>
                                    <button class="btn btn-secondary btn-sm run-single-btn" data-divisions="${t.divisions}" data-label="${t.label}">
                                        Run Tier
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <!-- Benchmark History Section -->
            <div style="margin-top: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div>
                        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Benchmark Execution History</h3>
                        <p style="font-size: 11px; color: var(--text-muted);">Locally stored historical stress test results across sessions.</p>
                    </div>
                    ${this.history.length > 0 ? '<button class="btn btn-secondary btn-sm" id="btn-clear-history" style="color: var(--accent-rose);">Clear History</button>' : ''}
                </div>

                ${this.history.length === 0 ? `
                    <div style="background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">
                        No historical benchmark runs recorded yet. Click "Run Full Suite" or "Run Tier" above.
                    </div>
                ` : `
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Tier</th>
                                    <th>Particles</th>
                                    <th>Mean FPS</th>
                                    <th>Mean Latency</th>
                                    <th>P99 Latency</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.history.slice(-8).reverse().map(h => `
                                    <tr>
                                        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${new Date(h.timestamp || Date.now()).toLocaleTimeString()}</td>
                                        <td style="font-weight: 600;">${h.resolutionLabel}</td>
                                        <td>${h.particleCount.toLocaleString()}</td>
                                        <td style="color: var(--accent-emerald); font-weight: 700;">${h.avgFps} FPS</td>
                                        <td style="color: var(--accent-cyan);">${h.avgFrameTimeMs} ms</td>
                                        <td style="color: var(--text-secondary);">${h.p99FrameTimeMs} ms</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;

        const runAllBtn = this.el.querySelector("#btn-run-all-benchmarks") as HTMLButtonElement;
        const exportBtn = this.el.querySelector("#btn-export-benchmarks") as HTMLButtonElement;
        const clearHistoryBtn = this.el.querySelector("#btn-clear-history") as HTMLButtonElement;
        const progressBox = this.el.querySelector("#benchmark-progress-box") as HTMLElement;
        const progressBar = this.el.querySelector("#benchmark-progress-bar") as HTMLElement;
        const statusLabel = this.el.querySelector("#benchmark-status-label") as HTMLElement;
        const liveFps = this.el.querySelector("#benchmark-fps-live") as HTMLElement;

        const runTier = async (tier: any) => {
            progressBox.style.display = "flex";
            statusLabel.textContent = `Executing ${tier.label} Stress Test...`;

            const res = await this.runner.runBenchmark(tier, (pct, fps) => {
                progressBar.style.width = `${pct}%`;
                liveFps.textContent = `${fps} FPS`;
            });

            this.results.push(res);
            this.history.push({ ...res, timestamp: Date.now() } as any);
            this.saveHistory();
            this.updateTableRow(res);
            progressBox.style.display = "none";
        };

        runAllBtn?.addEventListener("click", async () => {
            runAllBtn.disabled = true;
            for (const tier of BENCHMARK_TIERS) {
                await runTier(tier);
            }
            runAllBtn.disabled = false;
            this.render();
        });

        this.el.querySelectorAll(".run-single-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const b = e.currentTarget as HTMLElement;
                const divs = parseInt(b.dataset.divisions || "50");
                const label = b.dataset.label || "Custom";
                const tier = BENCHMARK_TIERS.find(t => t.divisions === divs) || { label, divisions: divs, framesToSample: 80 };
                await runTier(tier);
                this.render();
            });
        });

        clearHistoryBtn?.addEventListener("click", () => {
            this.history = [];
            this.saveHistory();
            this.render();
        });

        exportBtn?.addEventListener("click", () => {
            const dataToExport = this.history.length > 0 ? this.history : this.results;
            if (dataToExport.length === 0) {
                alert("Please run benchmark tests first before exporting results.");
                return;
            }
            let csv = "Timestamp,Resolution,Divisions,Particles,Triangles,Mean FPS,Min FPS,Mean Latency (ms),P99 Latency (ms)\n";
            dataToExport.forEach(r => {
                csv += `${new Date(r.timestamp || Date.now()).toISOString()},${r.resolutionLabel},${r.divisions},${r.particleCount},${r.triangleCount},${r.avgFps},${r.minFps},${r.avgFrameTimeMs},${r.p99FrameTimeMs}\n`;
            });

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `FabricLab_Benchmark_${Date.now()}.csv`;
            a.click();
        });
    }

    private updateTableRow(res: BenchmarkResult): void {
        const row = this.el.querySelector(`tr[data-tier="${res.resolutionLabel}"]`);
        if (!row) return;

        const fpsCol = row.querySelector(".col-avg-fps") as HTMLElement;
        const minCol = row.querySelector(".col-min-fps") as HTMLElement;
        const ftCol = row.querySelector(".col-avg-ft") as HTMLElement;
        const p99Col = row.querySelector(".col-p99-ft") as HTMLElement;

        if (fpsCol) {
            fpsCol.textContent = `${res.avgFps} FPS`;
            fpsCol.style.color = "var(--accent-emerald)";
            fpsCol.style.fontWeight = "700";
        }
        if (minCol) {
            minCol.textContent = `${res.minFps} FPS`;
            minCol.style.color = "var(--text-primary)";
        }
        if (ftCol) {
            ftCol.textContent = `${res.avgFrameTimeMs} ms`;
            ftCol.style.color = "var(--accent-cyan)";
        }
        if (p99Col) {
            p99Col.textContent = `${res.p99FrameTimeMs} ms`;
            p99Col.style.color = "var(--text-secondary)";
        }
    }
}
