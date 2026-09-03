import { store } from "../../state/Store";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";

export class ComparisonPage {
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
        const matA = store.comparisonMaterialA;
        const matB = store.comparisonMaterialB;

        this.el.innerHTML = `
            <div class="page-header">
                <div>
                    <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">02 / Analysis</span>
                    <h1 class="page-title" style="margin-top: 4px;">Material Comparison</h1>
                    <p class="page-subtitle">Comparative parameter matrix between textile specimens under identical physical forces.</p>
                </div>
            </div>

            <div class="comparison-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; width: 100%;">
                <!-- Specimen A -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; display: flex; flex-direction: column; gap: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--accent-primary);">SPECIMEN A</span>
                        <select id="select-mat-a" class="text-input" style="width: auto; padding: 6px 12px;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matA.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${matA.name}</h2>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${matA.description}</p>

                    <div class="table-responsive-wrapper"><table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--text-primary); font-weight: 500;">${matA.category}</td></tr>
                            <tr><td>Area Density</td><td>${matA.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matA.stretchCompliance}</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matA.bendCompliance}</td></tr>
                            <tr><td>Velocity Damping</td><td>${matA.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matA.friction}</td></tr>
                            <tr><td>Stiffness Rating</td><td style="font-weight: 600; color: var(--text-primary);">${matA.stiffnessRating}</td></tr>
                        </tbody>
                    </table></div>

                    <button class="btn btn-secondary btn-sm" id="btn-load-a-lab" style="margin-top: 10px; padding: 8px;">
                        Load Specimen A into Laboratory →
                    </button>
                </div>

                <!-- Specimen B -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; display: flex; flex-direction: column; gap: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--accent-warm);">SPECIMEN B</span>
                        <select id="select-mat-b" class="text-input" style="width: auto; padding: 6px 12px;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matB.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${matB.name}</h2>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${matB.description}</p>

                    <table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--text-primary); font-weight: 500;">${matB.category}</td></tr>
                            <tr><td>Area Density</td><td>${matB.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matB.stretchCompliance}</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matB.bendCompliance}</td></tr>
                            <tr><td>Velocity Damping</td><td>${matB.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matB.friction}</td></tr>
                            <tr><td>Stiffness Rating</td><td style="font-weight: 600; color: var(--text-primary);">${matB.stiffnessRating}</td></tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary btn-sm" id="btn-load-b-lab" style="margin-top: 10px; padding: 8px;">
                        Load Specimen B into Laboratory →
                    </button>
                </div>
            </div>
        `;

        this.el.querySelector("#select-mat-a")?.addEventListener("change", (e) => {
            const id = (e.target as HTMLSelectElement).value;
            if (MATERIAL_PRESETS[id]) {
                store.comparisonMaterialA = MATERIAL_PRESETS[id];
                this.render();
            }
        });

        this.el.querySelector("#select-mat-b")?.addEventListener("change", (e) => {
            const id = (e.target as HTMLSelectElement).value;
            if (MATERIAL_PRESETS[id]) {
                store.comparisonMaterialB = MATERIAL_PRESETS[id];
                this.render();
            }
        });

        this.el.querySelector("#btn-load-a-lab")?.addEventListener("click", () => {
            store.setMaterial(store.comparisonMaterialA);
            this.engine.setMaterial(store.comparisonMaterialA);
            store.setPage("laboratory");
        });

        this.el.querySelector("#btn-load-b-lab")?.addEventListener("click", () => {
            store.setMaterial(store.comparisonMaterialB);
            this.engine.setMaterial(store.comparisonMaterialB);
            store.setPage("laboratory");
        });
    }
}
