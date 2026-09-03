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
                    <h1 class="page-title">Material Physics Comparison Matrix</h1>
                    <p class="page-subtitle">Side-by-side analytical comparative inspection of textile dynamics, compliance, and mass density.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%;">
                <!-- Specimen A -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-cyan);">SPECIMEN A</span>
                        <select id="select-mat-a" class="text-input" style="width: auto; padding: 4px 8px;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matA.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <h2 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${matA.name}</h2>
                    <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">${matA.description}</p>

                    <table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--accent-cyan);">${matA.category}</td></tr>
                            <tr><td>Area Density</td><td>${matA.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matA.stretchCompliance} m/N</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matA.bendCompliance} rad/N</td></tr>
                            <tr><td>Velocity Damping</td><td>${matA.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matA.friction}</td></tr>
                            <tr><td>Stiffness Profile</td><td style="font-weight: 700; color: var(--text-primary);">${matA.stiffnessRating}</td></tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary btn-sm" id="btn-load-a-lab" style="margin-top: 4px;">
                        🔬 Load Specimen A into Lab
                    </button>
                </div>

                <!-- Specimen B -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 18px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-emerald);">SPECIMEN B</span>
                        <select id="select-mat-b" class="text-input" style="width: auto; padding: 4px 8px;">
                            ${Object.values(MATERIAL_PRESETS).map(m => `<option value="${m.id}" ${m.id === matB.id ? "selected" : ""}>${m.name}</option>`).join("")}
                        </select>
                    </div>

                    <h2 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${matB.name}</h2>
                    <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">${matB.description}</p>

                    <table class="data-table">
                        <tbody>
                            <tr><td>Category</td><td style="color: var(--accent-emerald);">${matB.category}</td></tr>
                            <tr><td>Area Density</td><td>${matB.density} kg/m²</td></tr>
                            <tr><td>Stretch Compliance (α)</td><td>${matB.stretchCompliance} m/N</td></tr>
                            <tr><td>Bending Compliance (α)</td><td>${matB.bendCompliance} rad/N</td></tr>
                            <tr><td>Velocity Damping</td><td>${matB.damping}</td></tr>
                            <tr><td>Friction Coefficient</td><td>${matB.friction}</td></tr>
                            <tr><td>Stiffness Profile</td><td style="font-weight: 700; color: var(--text-primary);">${matB.stiffnessRating}</td></tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary btn-sm" id="btn-load-b-lab" style="margin-top: 4px;">
                        🔬 Load Specimen B into Lab
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
