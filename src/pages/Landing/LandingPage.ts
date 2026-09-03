import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";

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
            <div style="display: flex; flex-direction: column; width: 100%; min-height: calc(100vh - 200px); justify-content: center; padding: 24px 0;">
                
                <!-- ================================================================= -->
                <!-- HERO SECTION: Split Exhibition Stage -->
                <!-- ================================================================= -->
                <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center;">
                    
                    <!-- Left: Editorial Opening -->
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div style="display: inline-flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary);"></span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600;">
                                Computational Physics // 01
                            </span>
                        </div>

                        <h1 style="font-size: clamp(38px, 4.5vw, 60px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.04; color: var(--text-primary);">
                            Understand<br/>
                            how digital<br/>
                            materials move.
                        </h1>

                        <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.65; max-width: 540px;">
                            FabricLab is an interactive computational material laboratory. Experiment with parameterized physical forces, compliant constraints, and WebGPU compute dynamics in real time.
                        </p>

                        <div style="display: flex; gap: 14px; margin-top: 8px; flex-wrap: wrap;">
                            <button class="btn btn-primary" id="btn-hero-lab" style="padding: 12px 28px; font-size: 13px;">
                                Open Laboratory →
                            </button>
                            <button class="btn btn-secondary" id="btn-hero-materials" style="padding: 12px 24px; font-size: 13px;">
                                Explore Materials
                            </button>
                        </div>

                        <!-- Technical Eyebrow Annotations -->
                        <div style="display: flex; gap: 24px; border-top: 1px solid var(--border-subtle); padding-top: 20px; margin-top: 12px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Solver</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">XPBD Sub-stepped</span>
                            </div>
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Compute</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">Native WebGPU</span>
                            </div>
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Geometry</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">3,721 Vertices</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Material Exhibition Showcase -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 20px; position: relative; box-shadow: 0 24px 64px rgba(0,0,0,0.5);">
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #06b6d4;"></span>
                                <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--text-primary); text-transform: uppercase;">Active Simulation Preset: Mulberry Silk</span>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-emerald);">● Live 60 FPS</span>
                        </div>

                        <!-- Interactive Visual Specimen Stage -->
                        <div style="background: #06070a; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); height: 260px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                            <div style="width: 130px; height: 130px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 4px; box-shadow: 0 16px 40px rgba(6, 182, 212, 0.35); transform: rotate(12deg) skew(-4deg); transition: transform 0.4s ease; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); font-family: var(--font-mono); font-size: 10px; font-weight: 700;">
                                XPBD // SILK
                            </div>
                            <span style="position: absolute; bottom: 12px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
                                [ 10 Sub-Steps • Alpha Compliance: 0.002 • Damping: 0.12 ]
                            </span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span style="color: var(--text-secondary);">Direct 3D vertex manipulation & wind aerodynamics ready.</span>
                            <button class="btn btn-secondary btn-sm" id="btn-quick-enter-lab" style="padding: 6px 14px;">
                                Launch in Workstation ↗
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        `;

        // Event listeners
        const openLab = () => store.setPage("laboratory");
        const openMaterials = () => store.setPage("materials");

        this.el.querySelector("#btn-hero-lab")?.addEventListener("click", openLab);
        this.el.querySelector("#btn-quick-enter-lab")?.addEventListener("click", openLab);
        this.el.querySelector("#btn-hero-materials")?.addEventListener("click", openMaterials);
    }
}
