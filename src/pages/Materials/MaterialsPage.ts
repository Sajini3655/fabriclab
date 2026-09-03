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
        this.el.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Material Physics Laboratory Specimen Gallery</h1>
                    <p class="page-subtitle">Standardized virtual textile specimens calibrated with XPBD stiffness, density, and damping parameters.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${Object.values(MATERIAL_PRESETS).map(mat => {
                    const rgb = `rgb(${Math.round(mat.color[0] * 255)}, ${Math.round(mat.color[1] * 255)}, ${Math.round(mat.color[2] * 255)})`;
                    return `
                        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="material-chip" style="background: ${rgb}; width: 18px; height: 18px;"></span>
                                    <h3 style="font-size: 14px; font-weight: 700;">${mat.name}</h3>
                                </div>
                                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-blue); background: rgba(59,130,246,0.1); padding: 2px 6px; border-radius: 3px;">${mat.category}</span>
                            </div>

                            <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4; min-height: 36px;">${mat.description}</p>

                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; font-size: 11px;">
                                <div><span style="color: var(--text-muted);">Density:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.density} kg/m²</span></div>
                                <div><span style="color: var(--text-muted);">Stretch α:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.stretchCompliance}</span></div>
                                <div><span style="color: var(--text-muted);">Bend α:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.bendCompliance}</span></div>
                                <div><span style="color: var(--text-muted);">Damping:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.damping}</span></div>
                                <div><span style="color: var(--text-muted);">Friction:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.friction}</span></div>
                                <div><span style="color: var(--text-muted);">Thickness:</span> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${mat.thicknessMm} mm</span></div>
                            </div>

                            <div style="display: flex; gap: 6px; margin-top: 4px;">
                                <button class="btn btn-primary btn-sm load-mat-btn" data-id="${mat.id}" style="flex: 1;">
                                    🔬 Load into Lab
                                </button>
                                <button class="btn btn-secondary btn-sm inspect-mat-btn" data-id="${mat.id}">
                                    📊 Analysis
                                </button>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;

        this.el.querySelectorAll(".load-mat-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.dataset.id;
                if (id && MATERIAL_PRESETS[id]) {
                    const mat = MATERIAL_PRESETS[id];
                    store.setMaterial(mat);
                    this.engine.setMaterial(mat);
                    store.setPage("laboratory");
                }
            });
        });

        this.el.querySelectorAll(".inspect-mat-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.dataset.id;
                if (id && MATERIAL_PRESETS[id]) {
                    store.emit("openMaterialDetail", MATERIAL_PRESETS[id]);
                }
            });
        });
    }
}
