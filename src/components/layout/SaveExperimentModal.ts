import { store } from "../../state/Store";
import { ExperimentService } from "../../services/ExperimentService";

export class SaveExperimentModal {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "modal-backdrop";
        this.el.style.display = "none";
        this.render();

        store.subscribe<boolean>("openSaveModal", (open: boolean) => {
            this.el.style.display = open ? "flex" : "none";
            if (open) {
                const nameInput = this.el.querySelector("#exp-name-input") as HTMLInputElement;
                if (nameInput) {
                    nameInput.value = store.material.name + " Lab Snapshot";
                    nameInput.focus();
                }
            }
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3 style="font-size: 15px; font-weight: 700;">Save Experiment Snapshot</h3>
                    <button class="btn btn-secondary btn-sm" id="btn-close-modal" style="padding: 2px 6px;">✕</button>
                </div>

                <div class="modal-body">
                    <div>
                        <label style="display: block; font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Experiment Title</label>
                        <input type="text" id="exp-name-input" class="text-input" placeholder="e.g. Mulberry Silk High Wind Aerodynamics" />
                    </div>

                    <div>
                        <label style="display: block; font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Description</label>
                        <textarea id="exp-desc-input" class="text-input" style="height: 60px; resize: none;" placeholder="Record experimental parameters and observations..."></textarea>
                    </div>

                    <div>
                        <label style="display: block; font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Tags (comma separated)</label>
                        <input type="text" id="exp-tags-input" class="text-input" placeholder="e.g. Silk, Wind, Fluidity" />
                    </div>

                    <div style="background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; font-size: 11px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;">
                        <div>Active Material: <strong style="color: var(--text-primary);">${store.material.name}</strong></div>
                        <div>Resolution: <strong style="color: var(--text-primary);">${store.simulation.widthDivisions}x${store.simulation.heightDivisions}</strong></div>
                        <div>Gravity: <strong style="color: var(--text-primary);">${store.environment.gravityPreset.toUpperCase()}</strong></div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
                    <button class="btn btn-primary" id="btn-confirm-save">💾 Save to Archive</button>
                </div>
            </div>
        `;

        const closeModal = () => {
            this.el.style.display = "none";
            store.emit("openSaveModal", false);
        };

        this.el.querySelector("#btn-close-modal")?.addEventListener("click", closeModal);
        this.el.querySelector("#btn-cancel-modal")?.addEventListener("click", closeModal);

        this.el.querySelector("#btn-confirm-save")?.addEventListener("click", () => {
            const nameInput = this.el.querySelector("#exp-name-input") as HTMLInputElement;
            const descInput = this.el.querySelector("#exp-desc-input") as HTMLTextAreaElement;
            const tagsInput = this.el.querySelector("#exp-tags-input") as HTMLInputElement;

            const name = nameInput ? nameInput.value.trim() || "Untitled Experiment" : "Untitled Experiment";
            const desc = descInput ? descInput.value.trim() || "Laboratory experiment snapshot." : "Laboratory experiment snapshot.";
            const rawTags = tagsInput ? tagsInput.value.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [];
            const tags = rawTags.length > 0 ? rawTags : [store.material.name, "Simulation"];

            ExperimentService.save({
                name,
                description: desc,
                tags,
                material: store.material,
                simulation: store.simulation,
                environment: store.environment,
            });

            closeModal();
            store.setPage("experiments");
        });
    }
}
