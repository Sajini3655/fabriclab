import { store } from "../../state/Store";
import { MaterialProperty } from "../../types/material";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";

export class MaterialDetailModal {
    private el: HTMLElement;
    private engine: SimulationEngine;
    private currentMaterial: MaterialProperty | null = null;

    constructor(engine: SimulationEngine) {
        this.engine = engine;
        this.el = document.createElement("div");
        this.el.className = "modal-backdrop";
        this.el.style.display = "none";
        this.render();

        store.subscribe<MaterialProperty>("openMaterialDetail", (mat: MaterialProperty) => {
            if (mat) {
                this.currentMaterial = mat;
                this.updateContent();
                this.el.style.display = "flex";
            } else {
                this.el.style.display = "none";
            }
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    public close(): void {
        this.el.style.display = "none";
    }

    private updateContent(): void {
        if (!this.currentMaterial) return;
        const m = this.currentMaterial;
        const rgb = `rgb(${Math.round(m.color[0] * 255)}, ${Math.round(m.color[1] * 255)}, ${Math.round(m.color[2] * 255)})`;

        const title = this.el.querySelector("#mat-modal-title");
        const category = this.el.querySelector("#mat-modal-cat");
        const desc = this.el.querySelector("#mat-modal-desc");
        const chip = this.el.querySelector("#mat-modal-chip") as HTMLElement;

        if (title) title.textContent = m.name;
        if (category) category.textContent = m.category;
        if (desc) desc.textContent = m.description;
        if (chip) chip.style.background = rgb;

        const densityPct = Math.min(100, Math.round((m.density / 1.0) * 100));
        const bendPct = Math.min(100, Math.round((m.bendCompliance / 1.0) * 100));
        const stretchPct = Math.min(100, Math.round((m.stretchCompliance / 0.05) * 100));
        const dampingPct = Math.min(100, Math.round((m.damping / 0.1) * 100));
        const frictionPct = Math.min(100, Math.round((m.friction / 1.0) * 100));

        this.setBar("bar-density", "val-density", `${m.density} kg/m²`, densityPct);
        this.setBar("bar-bend", "val-bend", `${m.bendCompliance}`, bendPct);
        this.setBar("bar-stretch", "val-stretch", `${m.stretchCompliance}`, stretchPct);
        this.setBar("bar-damping", "val-damping", `${m.damping}`, dampingPct);
        this.setBar("bar-friction", "val-friction", `${m.friction}`, frictionPct);
    }

    private setBar(barId: string, valId: string, text: string, pct: number): void {
        const bar = this.el.querySelector("#" + barId) as HTMLElement;
        const val = this.el.querySelector("#" + valId) as HTMLElement;
        if (bar) bar.style.width = pct + "%";
        if (val) val.textContent = text;
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="modal-card" style="width: 520px;">
                <div class="modal-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span id="mat-modal-chip" class="material-chip" style="width: 16px; height: 16px;"></span>
                        <h3 id="mat-modal-title" style="font-size: 15px; font-weight: 700;">Material Specimen</h3>
                        <span id="mat-modal-cat" style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-blue); background: rgba(59,130,246,0.1); padding: 2px 6px; border-radius: 3px;">Natural</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="btn-close-mat-modal" style="padding: 2px 6px;">✕</button>
                </div>

                <div class="modal-body">
                    <p id="mat-modal-desc" style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;"></p>

                    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px;">
                        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); font-family: var(--font-mono);">XPBD Physical Calibrations</div>
                        
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                                <span style="color: var(--text-secondary);">Area Density / Mass</span>
                                <span id="val-density" class="control-value">0.18 kg/m²</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
                                <div id="bar-density" style="width: 20%; height: 100%; background: var(--accent-blue);"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                                <span style="color: var(--text-secondary);">Bending Compliance (Flexibility Resistance)</span>
                                <span id="val-bend" class="control-value">0.12</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
                                <div id="bar-bend" style="width: 15%; height: 100%; background: var(--accent-cyan);"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                                <span style="color: var(--text-secondary);">Stretch Compliance (Tensile Elasticity)</span>
                                <span id="val-stretch" class="control-value">0.0005</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
                                <div id="bar-stretch" style="width: 5%; height: 100%; background: var(--accent-emerald);"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                                <span style="color: var(--text-secondary);">Internal Damping Factor</span>
                                <span id="val-damping" class="control-value">0.025</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
                                <div id="bar-damping" style="width: 25%; height: 100%; background: var(--accent-amber);"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                                <span style="color: var(--text-secondary);">Surface Friction Coefficient</span>
                                <span id="val-friction" class="control-value">0.40</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden;">
                                <div id="bar-friction" style="width: 40%; height: 100%; background: var(--accent-rose);"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btn-cancel-mat-modal">Close</button>
                    <button class="btn btn-primary" id="btn-simulate-specimen">🔬 Simulate this Material in Lab</button>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-close-mat-modal")?.addEventListener("click", () => this.close());
        this.el.querySelector("#btn-cancel-mat-modal")?.addEventListener("click", () => this.close());
        this.el.querySelector("#btn-simulate-specimen")?.addEventListener("click", () => {
            if (this.currentMaterial) {
                store.setMaterial(this.currentMaterial);
                this.engine.setMaterial(this.currentMaterial);
                this.close();
                store.setPage("laboratory");
            }
        });
    }
}
