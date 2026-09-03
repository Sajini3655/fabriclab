import { store } from "../../state/Store";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";
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
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 900px; margin: 40px auto; gap: 24px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; padding: 4px 14px; font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan); font-weight: 600;">
                    <span class="status-dot"></span>
                    <span>WEBGPU NATIVE • XPBD PHYSICS ENGINE 3.0</span>
                </div>

                <h1 style="font-size: 38px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; color: var(--text-primary);">
                    FABRICLAB
                    <span style="display: block; font-size: 20px; font-weight: 500; color: var(--text-secondary); margin-top: 8px; letter-spacing: -0.01em;">
                        Interactive Material & Physics Laboratory
                    </span>
                </h1>

                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; max-width: 700px;">
                    Experiment with digital fabrics, compliant physical forces, dihedral constraints, aerodynamic wind shears, rigid colliders, and GPU compute performance in real time.
                </p>

                <div style="display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; justify-content: center;">
                    <button class="btn btn-primary" id="btn-enter-lab" style="padding: 10px 24px; font-size: 14px; font-weight: 600;">
                        🔬 Enter Main Laboratory
                    </button>
                    <button class="btn btn-secondary" id="btn-explore-materials" style="padding: 10px 20px; font-size: 14px;">
                        🧪 Material Specimen Catalog
                    </button>
                    <button class="btn btn-secondary" id="btn-open-benchmarks" style="padding: 10px 20px; font-size: 14px;">
                        ⚡ Performance Benchmarks
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; width: 100%; margin-top: 36px; text-align: left;">
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 18px;">⚡</div>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Native WebGPU Compute</h3>
                        <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">Numerical integration, constraint projections, and atomic normals execute 100% on GPU compute pipelines.</p>
                    </div>

                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 18px;">🧬</div>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">XPBD Compliant Physics</h3>
                        <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">Small-step sub-stepping with parallel Gauss-Seidel constraint graph coloring eliminates stiffness instability.</p>
                    </div>

                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 18px;">🔬</div>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">8 Calibrated Textiles</h3>
                        <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">Silk, Denim, Leather, Rubber, Cotton, Linen, Wool, and Canvas with area mass, bending compliance, and damping.</p>
                    </div>

                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 18px;">✋</div>
                        <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Direct 3D Raycasting</h3>
                        <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">Grab, pull, and release vertices in space or click to place custom physical anchor pins.</p>
                    </div>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-enter-lab")?.addEventListener("click", () => {
            store.setPage("laboratory");
        });

        this.el.querySelector("#btn-explore-materials")?.addEventListener("click", () => {
            store.setPage("materials");
        });

        this.el.querySelector("#btn-open-benchmarks")?.addEventListener("click", () => {
            store.setPage("benchmarks");
        });
    }
}
