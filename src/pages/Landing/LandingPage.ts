import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";

export class LandingPage {
    private el: HTMLElement;
    private engine: SimulationEngine;

    constructor(engine: SimulationEngine) {
        this.engine = engine;
        this.el = document.createElement("div");
        this.el.className = "page-screen";
        this.render();
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 100%; margin: 16px 0 32px 0; gap: 20px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; background: #0f131a; border: 1px solid var(--border-medium); border-radius: var(--radius-xs); padding: 4px 10px; font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); letter-spacing: 0.08em;">
                    <span class="status-dot"></span>
                    <span>WEBGPU NATIVE // XPBD ENGINE 3.0 // HIGH-PRECISION INSTRUMENT</span>
                </div>

                <h1 style="font-size: 34px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: var(--text-primary); text-transform: uppercase;">
                    FABRICLAB
                    <span style="display: block; font-size: 15px; font-weight: 500; font-family: var(--font-mono); color: var(--text-secondary); margin-top: 6px; letter-spacing: 0.04em;">
                        Interactive Material & Physics Laboratory
                    </span>
                </h1>

                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; max-width: 620px;">
                    A real-time computational workstation for digital textiles, compliant physical forces, dihedral bending constraints, and GPU compute performance.
                </p>

                <div style="display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; justify-content: center;">
                    <button class="btn btn-primary" id="btn-enter-lab" style="padding: 8px 18px; font-size: 11px;">
                        🔬 ENTER LABORATORY
                    </button>
                    <button class="btn btn-secondary" id="btn-explore-materials" style="padding: 8px 14px; font-size: 11px;">
                        🧪 SPECIMEN CATALOG
                    </button>
                    <button class="btn btn-secondary" id="btn-open-benchmarks" style="padding: 8px 14px; font-size: 11px;">
                        ⚡ BENCHMARK SUITE
                    </button>
                </div>

                <!-- Architectural Ledger Sections -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; width: 100%; margin-top: 28px; text-align: left;">
                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">01 // COMPUTE CORE</span>
                        <h3 style="font-size: 12px; font-weight: 700; color: var(--text-primary);">Native WebGPU Shaders</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">Numerical sub-stepping, constraints, and atomic face normals execute in parallel on GPU workgroups.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">02 // SOLVER DYNAMICS</span>
                        <h3 style="font-size: 12px; font-weight: 700; color: var(--text-primary);">Extended PBD (XPBD)</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">Time-step independent elastic compliance (α) with Gauss-Seidel constraint graph coloring.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">03 // MATERIAL SCIENCE</span>
                        <h3 style="font-size: 12px; font-weight: 700; color: var(--text-primary);">8 Parameterized Specimens</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">Silk, Denim, Leather, Rubber, Cotton, Linen, Wool, and Canvas with calibrated area mass and damping.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">04 // DIRECT INTERACTION</span>
                        <h3 style="font-size: 12px; font-weight: 700; color: var(--text-primary);">3D Raycaster & Anchors</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">Real-time screen-to-world vertex dragging, dynamic pinning, and Turbo strain heat-map visualization.</p>
                    </div>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-enter-lab")?.addEventListener("click", () => store.setPage("laboratory"));
        this.el.querySelector("#btn-explore-materials")?.addEventListener("click", () => store.setPage("materials"));
        this.el.querySelector("#btn-open-benchmarks")?.addEventListener("click", () => store.setPage("benchmarks"));
    }
}
