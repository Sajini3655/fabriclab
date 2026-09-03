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
            <div style="display: flex; flex-direction: column; width: 100%; gap: 48px; margin-top: 16px;">
                
                <!-- Hero Section (Wide & Impressive) -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 20px; max-width: 900px;">
                    <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent-primary); font-weight: 600;">
                        FabricLab Studio
                    </span>

                    <h1 style="font-size: 52px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; color: var(--text-primary); text-transform: uppercase;">
                        Interactive<br/>Material<br/>Laboratory
                    </h1>

                    <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.6; max-width: 680px;">
                        Explore how parameterized digital fabrics deform, flow, and respond to physical forces in real time on native WebGPU compute pipelines.
                    </p>

                    <div style="display: flex; gap: 14px; margin-top: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" id="btn-enter-lab" style="padding: 12px 28px; font-size: 14px;">
                            Enter Laboratory →
                        </button>
                        <button class="btn btn-secondary" id="btn-explore-materials" style="padding: 12px 24px; font-size: 14px;">
                            Explore Specimen Gallery
                        </button>
                    </div>
                </div>

                <!-- Three Wide Editorial Chapters Across Full 1500px Container -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; width: 100%; border-top: 1px solid var(--border-subtle); padding-top: 48px; margin-top: 16px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">01 — MATERIAL</span>
                        <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Eight Parameterized Presets</h3>
                        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">From fluid gossamer silk to rigid raw denim, each producing a distinct physical response under compliant constraints.</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">02 — MOTION</span>
                        <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Dynamic Forces & Interaction</h3>
                        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">Gravity fields, aerodynamic wind shears, rigid colliders, and direct 3D vertex manipulation in real time.</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">03 — COMPUTATION</span>
                        <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">WebGPU Parallel XPBD</h3>
                        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">Small-step numerical sub-stepping and Gauss-Seidel constraint projections drive the simulation directly on GPU.</p>
                    </div>
                </div>

            </div>
        `;

        this.el.querySelector("#btn-enter-lab")?.addEventListener("click", () => store.setPage("laboratory"));
        this.el.querySelector("#btn-explore-materials")?.addEventListener("click", () => store.setPage("materials"));
    }
}
