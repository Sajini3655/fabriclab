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
            <div style="display: flex; flex-direction: column; width: 100%; gap: 24px; margin: 8px 0 24px 0;">
                
                <!-- Hero Header -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 24px; width: 100%;">
                    <div style="display: inline-flex; align-items: center; gap: 8px; background: #0f131a; border: 1px solid var(--border-medium); border-radius: var(--radius-xs); padding: 4px 10px; font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); letter-spacing: 0.08em;">
                        <span class="status-dot"></span>
                        <span>WEBGPU NATIVE // XPBD ENGINE 3.0 // HIGH-PRECISION INSTRUMENT</span>
                    </div>

                    <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: var(--text-primary); text-transform: uppercase;">
                        FABRICLAB
                        <span style="display: block; font-size: 14px; font-weight: 500; font-family: var(--font-mono); color: var(--text-secondary); margin-top: 4px; letter-spacing: 0.04em;">
                            Interactive Material & Physics Laboratory
                        </span>
                    </h1>

                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; max-width: 820px;">
                        A real-time computational workstation for digital textiles, compliant physical forces, dihedral bending constraints, and GPU compute performance.
                    </p>

                    <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                        <button class="btn btn-primary" id="btn-enter-lab" style="padding: 8px 18px; font-size: 11px;">
                            🔬 ENTER MAIN LABORATORY
                        </button>
                        <button class="btn btn-secondary" id="btn-explore-materials" style="padding: 8px 14px; font-size: 11px;">
                            🧪 MATERIAL SPECIMEN CATALOG
                        </button>
                        <button class="btn btn-secondary" id="btn-open-benchmarks" style="padding: 8px 14px; font-size: 11px;">
                            ⚡ PERFORMANCE BENCHMARKS
                        </button>
                    </div>
                </div>

                <!-- 4-Column Balanced Ledger Grid Across Full Window -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; width: 100%;">
                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">01 // COMPUTE CORE</span>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Native WebGPU Shaders</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Numerical integration, constraint projections, and atomic normals execute 100% on GPU compute pipelines.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">02 // SOLVER DYNAMICS</span>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">XPBD Compliant Physics</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Small-step sub-stepping with parallel Gauss-Seidel constraint graph coloring eliminates stiffness instability.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">03 // MATERIAL SCIENCE</span>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">8 Parameterized Textiles</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Silk, Denim, Leather, Rubber, Cotton, Linen, Wool, and Canvas with area mass, bending compliance, and damping.</p>
                    </div>

                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">04 // DIRECT INTERACTION</span>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">3D Raycasting & Anchors</h3>
                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Screen-to-world cloth vertex pulling, dynamic pinning, and Turbo strain energy heat-map visualizations.</p>
                    </div>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-enter-lab")?.addEventListener("click", () => store.setPage("laboratory"));
        this.el.querySelector("#btn-explore-materials")?.addEventListener("click", () => store.setPage("materials"));
        this.el.querySelector("#btn-open-benchmarks")?.addEventListener("click", () => store.setPage("benchmarks"));
    }
}
