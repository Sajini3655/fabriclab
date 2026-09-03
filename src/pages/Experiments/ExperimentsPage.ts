import { store } from "../../state/Store";
import { ExperimentService } from "../../services/ExperimentService";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { Experiment } from "../../types/experiment";

export class ExperimentsPage {
    private el: HTMLElement;
    private engine: SimulationEngine;
    private selectedIds: Set<string> = new Set();
    private searchQuery: string = "";

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
        let experiments = ExperimentService.getAll();
        if (this.searchQuery) {
            experiments = experiments.filter(e => 
                e.name.toLowerCase().includes(this.searchQuery) ||
                e.tags.some(t => t.toLowerCase().includes(this.searchQuery)) ||
                e.material.name.toLowerCase().includes(this.searchQuery)
            );
        }

        this.el.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Saved Experiments Archive</h1>
                    <p class="page-subtitle">Persistent laboratory snapshot library recording material configurations, environmental forces, and physical parameters.</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" id="btn-new-exp">+ New Snapshot</button>
                    <button class="btn btn-secondary" id="btn-compare-selected" ${this.selectedIds.size !== 2 ? 'disabled' : ''}>⚖️ Compare Selected (${this.selectedIds.size}/2)</button>
                    <button class="btn btn-secondary" id="btn-import-exp">📥 Import JSON</button>
                    <button class="btn btn-secondary" id="btn-export-exp">📤 Export JSON</button>
                    <input type="file" id="import-file-input" accept=".json" style="display: none;" />
                </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="exp-search-input" class="text-input" style="max-width: 340px;" placeholder="Search experiments by name, tag, or material..." value="${this.searchQuery}" />
                <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${experiments.length} snapshots in library</span>
            </div>

            ${experiments.length === 0 ? `
                <div style="background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-secondary); margin-top: 16px;">
                    <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">No Matching Experiments Found</h3>
                    <p style="font-size: 12px; max-width: 480px; margin: 0 auto 16px; color: var(--text-muted);">Configure physical parameters in the Main Laboratory and save a new snapshot here.</p>
                    <button class="btn btn-primary" id="btn-go-to-lab">🔬 Open Laboratory</button>
                </div>
            ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
                    ${experiments.map(exp => {
                        const isSelected = this.selectedIds.has(exp.id);
                        return `
                            <div style="background: var(--bg-surface); border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 10px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="checkbox" class="select-exp-check" data-id="${exp.id}" ${isSelected ? 'checked' : ''} style="cursor: pointer;" />
                                        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${exp.name}</h3>
                                    </div>
                                    ${exp.isPreset ? '<span style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-emerald); background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 3px;">CURATED PRESET</span>' : ''}
                                </div>

                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">${exp.description}</p>

                                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                    ${exp.tags.map(t => `<span style="font-size: 10px; font-family: var(--font-mono); background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-muted); padding: 2px 6px; border-radius: 3px;">#${t}</span>`).join("")}
                                </div>

                                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 4px;">
                                    <span>Material: <strong style="color: var(--text-primary);">${exp.material.name}</strong></span>
                                    <span>Grid: <strong style="color: var(--text-primary);">${exp.simulation.widthDivisions}x${exp.simulation.heightDivisions}</strong></span>
                                </div>

                                <div style="display: flex; gap: 6px; margin-top: 4px;">
                                    <button class="btn btn-primary btn-sm load-exp-btn" data-id="${exp.id}" style="flex: 1;">
                                        🔬 Load into Lab
                                    </button>
                                    <button class="btn btn-secondary btn-sm dup-exp-btn" data-id="${exp.id}">
                                        📑 Duplicate
                                    </button>
                                    ${!exp.isPreset ? `<button class="btn btn-secondary btn-sm del-exp-btn" data-id="${exp.id}" style="color: var(--accent-rose);">🗑</button>` : ''}
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            `}
        `;

        const searchInput = this.el.querySelector("#exp-search-input") as HTMLInputElement;
        searchInput?.addEventListener("input", () => {
            this.searchQuery = searchInput.value.toLowerCase().trim();
            this.render();
        });

        this.el.querySelector("#btn-go-to-lab")?.addEventListener("click", () => store.setPage("laboratory"));
        this.el.querySelector("#btn-new-exp")?.addEventListener("click", () => store.emit("openSaveModal", true));

        this.el.querySelector("#btn-compare-selected")?.addEventListener("click", () => {
            const ids = Array.from(this.selectedIds);
            if (ids.length === 2) {
                const exps = ExperimentService.getAll();
                const expA = exps.find(e => e.id === ids[0]);
                const expB = exps.find(e => e.id === ids[1]);
                if (expA && expB) {
                    store.comparisonMaterialA = expA.material;
                    store.comparisonMaterialB = expB.material;
                    store.setPage("comparison");
                }
            }
        });

        const importInput = this.el.querySelector("#import-file-input") as HTMLInputElement;
        this.el.querySelector("#btn-import-exp")?.addEventListener("click", () => importInput.click());

        importInput?.addEventListener("change", (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result as string;
                const ok = ExperimentService.importJSON(text);
                if (ok) {
                    alert("Experiments imported successfully.");
                    this.render();
                } else {
                    alert("Error: Invalid experiment archive format. Ensure JSON contains valid schemaVersion 1 snapshots.");
                }
            };
            reader.readAsText(file);
        });

        this.el.querySelector("#btn-export-exp")?.addEventListener("click", () => {
            const json = ExperimentService.exportJSON();
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `FabricLab_Experiments_${Date.now()}.json`;
            a.click();
        });

        this.el.querySelectorAll(".select-exp-check").forEach(c => {
            c.addEventListener("change", (e) => {
                const target = e.currentTarget as HTMLInputElement;
                const id = target.dataset.id;
                if (!id) return;
                if (target.checked) this.selectedIds.add(id);
                else this.selectedIds.delete(id);
                this.render();
            });
        });

        this.el.querySelectorAll(".load-exp-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.dataset.id;
                const exps = ExperimentService.getAll();
                const exp = exps.find(x => x.id === id);
                if (exp) {
                    store.setMaterial(exp.material);
                    store.setSimulation(exp.simulation);
                    store.setEnvironment(exp.environment);
                    this.engine.setMaterial(exp.material);
                    this.engine.setPhysics(exp.simulation);
                    this.engine.setEnvironment(exp.environment);
                    store.setPage("laboratory");
                }
            });
        });

        this.el.querySelectorAll(".dup-exp-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.dataset.id;
                if (id) {
                    ExperimentService.duplicate(id);
                    this.render();
                }
            });
        });

        this.el.querySelectorAll(".del-exp-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.dataset.id;
                if (id && confirm("Delete this experiment snapshot?")) {
                    ExperimentService.delete(id);
                    this.render();
                }
            });
        });
    }
}
