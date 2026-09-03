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
                    <h1 class="page-title">Material Specimen Catalog</h1>
                    <p class="page-subtitle">Eight parameterized physical specimens configured with surface area density, compliance, and internal damping.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; width: 100%;">
                ${presets.map((m, idx) => `
                    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 16px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.15s ease;" onmouseenter="this.style.borderColor='var(--border-medium)'" onmouseleave="this.style.borderColor='var(--border-subtle)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); font-weight: 700;">SPECIMEN // 0${idx + 1}</span>
                                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${m.name}</h3>
                            </div>
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: rgb(${Math.round(m.color[0]*255)}, ${Math.round(m.color[1]*255)}, ${Math.round(m.color[2]*255)});"></span>
                        </div>

                        <span style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-cyan); text-transform: uppercase;">${m.category}</span>

                        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; min-height: 32px;">${m.description}</p>

                        <div style="border-top: 1px solid var(--border-subtle); padding-top: 8px; display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); font-size: 10px;">
                            <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                                <span>Area Density:</span>
                                <span style="color: var(--text-primary); font-weight: 600;">${m.density} kg/m²</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                                <span>Bend Compliance:</span>
                                <span style="color: var(--text-primary); font-weight: 600;">${m.bendCompliance} rad/N</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
                                <span>Stretch Compliance:</span>
                                <span style="color: var(--text-primary); font-weight: 600;">${m.stretchCompliance} m/N</span>
                            </div>
                        </div>

                        <button class="btn btn-secondary btn-sm load-mat-btn" data-mat="${m.id}" style="margin-top: 4px; width: 100%;">
                            🔬 Simulate Specimen
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
