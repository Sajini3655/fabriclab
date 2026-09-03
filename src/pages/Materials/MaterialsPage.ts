import { store } from "../../state/Store";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";

export class MaterialsPage {
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
        const presets = Object.values(MATERIAL_PRESETS);

        this.el.innerHTML = `
            <div class="page-header">
                <div>
                    <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">01 / Specimens</span>
                    <h1 class="page-title" style="margin-top: 4px;">The Material Archive</h1>
                    <p class="page-subtitle">Eight calibrated digital textiles exploring density, compliance, and elasticity.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; width: 100%;">
                ${presets.map((m, idx) => `
                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; gap: 16px; transition: all 0.2s ease;" onmouseenter="this.style.borderColor='var(--border-medium)'; this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='var(--border-subtle)'; this.style.transform='none'">
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); font-weight: 600;">0${idx + 1} — ${m.category.toUpperCase()}</span>
                                <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${m.name}</h3>
                            </div>
                            <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: rgb(${Math.round(m.color[0]*255)}, ${Math.round(m.color[1]*255)}, ${Math.round(m.color[2]*255)}); box-shadow: 0 0 10px rgba(${Math.round(m.color[0]*255)}, ${Math.round(m.color[1]*255)}, ${Math.round(m.color[2]*255)}, 0.4);"></span>
                        </div>

                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; min-height: 38px;">${m.description}</p>

                        <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-muted);">Area Density</span>
                                <span style="font-family: var(--font-mono); color: var(--text-primary); font-weight: 500;">${m.density} kg/m²</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-muted);">Bending Compliance</span>
                                <span style="font-family: var(--font-mono); color: var(--text-primary); font-weight: 500;">${m.bendCompliance}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-muted);">Internal Damping</span>
                                <span style="font-family: var(--font-mono); color: var(--text-primary); font-weight: 500;">${m.damping}</span>
                            </div>
                        </div>

                        <button class="btn btn-secondary btn-sm load-mat-btn" data-mat="${m.id}" style="margin-top: 8px; width: 100%; padding: 8px;">
                            Simulate Specimen →
                        </button>
                    </div>
                `).join("")}
            </div>
        `;

        this.el.querySelectorAll(".load-mat-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const matId = (e.currentTarget as HTMLElement).dataset.mat;
                if (matId && MATERIAL_PRESETS[matId]) {
                    store.setMaterial(MATERIAL_PRESETS[matId]);
                    this.engine.setMaterial(MATERIAL_PRESETS[matId]);
                    store.setPage("laboratory");
                }
            });
        });
    }
}
