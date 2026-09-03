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
                    <h1 class="page-title">Material Physics Comparison Laboratory</h1>
                    <p class="page-subtitle">Side-by-side comparative analysis of fabric behavior, bending compliance, and tensile response under identical physical forces.</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" id="btn-apply-comparison-lab">🔬 Load Active Specimen into Lab</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Material A -->
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--accent-cyan);">Specimen A: ${matA.name}</h2>
                        <select id="select-mat-a" class="text-input" style="width: auto;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matA.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">${matA.description}</p>

                    <table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--accent-blue);">${matA.category}</td></tr>
                            <tr><td>Density / Area Mass</td><td style="color: var(--accent-cyan);">${matA.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matA.stretchCompliance}</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matA.bendCompliance}</td></tr>
                            <tr><td>Velocity Damping</td><td>${matA.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matA.friction}</td></tr>
                            <tr><td>Calibrated Stiffness</td><td style="font-weight: 700;">${matA.stiffnessRating}</td></tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary btn-sm set-specimen-a-btn" style="margin-top: 8px;">
                        🔬 Set as Active Lab Material
                    </button>
                </div>

                <!-- Material B -->
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--accent-emerald);">Specimen B: ${matB.name}</h2>
                        <select id="select-mat-b" class="text-input" style="width: auto;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matB.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">${matB.description}</p>

                    <table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--accent-blue);">${matB.category}</td></tr>
                            <tr><td>Density / Area Mass</td><td style="color: var(--accent-cyan);">${matB.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matB.stretchCompliance}</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matB.bendCompliance}</td></tr>
                            <tr><td>Velocity Damping</td><td>${matB.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matB.friction}</td></tr>
                            <tr><td>Calibrated Stiffness</td><td style="font-weight: 700;">${matB.stiffnessRating}</td></tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary btn-sm set-specimen-b-btn" style="margin-top: 8px;">
                        🔬 Set as Active Lab Material
                    </button>
                </div>
            </div>
        `;

        const selectA = this.el.querySelector("#select-mat-a") as HTMLSelectElement;
        const selectB = this.el.querySelector("#select-mat-b") as HTMLSelectElement;

        selectA?.addEventListener("change", () => {
            store.comparisonMaterialA = MATERIAL_PRESETS[selectA.value];
            this.render();
        });

        selectB?.addEventListener("change", () => {
            store.comparisonMaterialB = MATERIAL_PRESETS[selectB.value];
            this.render();
        });

        this.el.querySelector(".set-specimen-a-btn")?.addEventListener("click", () => {
            store.setMaterial(store.comparisonMaterialA);
            this.engine.setMaterial(store.comparisonMaterialA);
            store.setPage("laboratory");
        });

        this.el.querySelector(".set-specimen-b-btn")?.addEventListener("click", () => {
            store.setMaterial(store.comparisonMaterialB);
            this.engine.setMaterial(store.comparisonMaterialB);
            store.setPage("laboratory");
        });

        this.el.querySelector("#btn-apply-comparison-lab")?.addEventListener("click", () => {
            store.setPage("laboratory");
        });
    }
}
