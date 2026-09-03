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
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 860px; margin: 32px auto 60px auto; gap: 28px;">
                
                <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">
                    FabricLab Studio
                </span>

                <h1 style="font-size: 44px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.08; color: var(--text-primary); text-transform: uppercase;">
                    Interactive<br/>Material<br/>Laboratory
                </h1>

                <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.6; max-width: 580px;">
                    Explore how parameterized digital fabrics deform, flow, and respond to physical forces in real time on native WebGPU compute pipelines.
                </p>

                <div style="display: flex; gap: 12px; margin-top: 8px;">
                    <button class="btn btn-primary" id="btn-enter-lab" style="padding: 10px 24px; font-size: 13px;">
                        Enter Laboratory →
                    </button>
                    <button class="btn btn-secondary" id="btn-explore-materials" style="padding: 10px 20px; font-size: 13px;">
                        Explore Specimen Gallery
                    </button>
                </div>

                <!-- Three Clean Editorial Chapters (Rhythm & Breathing Space) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; width: 100%; margin-top: 56px; text-align: left; border-top: 1px solid var(--border-subtle); padding-top: 48px;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">01 — MATERIAL</span>
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Eight Parameterized Presets</h3>
                        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">From fluid gossamer silk to rigid raw denim, each producing a distinct physical response under compliant constraints.</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">02 — MOTION</span>
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Dynamic Forces & Interaction</h3>
                        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">Gravity fields, aerodynamic wind shears, rigid colliders, and direct 3D vertex manipulation in real time.</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">03 — COMPUTATION</span>
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">WebGPU Parallel XPBD</h3>
                        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">Small-step numerical sub-stepping and Gauss-Seidel constraint projections drive the simulation directly on GPU.</p>
                    </div>
                </div>

            </div>
        `;

        this.el.querySelector("#btn-enter-lab")?.addEventListener("click", () => store.setPage("laboratory"));
        this.el.querySelector("#btn-explore-materials")?.addEventListener("click", () => store.setPage("materials"));
    }
}
