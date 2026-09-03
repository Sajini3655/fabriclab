import { store } from "../../state/Store";

export class SettingsModal {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "modal-backdrop";
        this.el.style.display = "none";
        this.render();

        store.subscribe<boolean>("openSettingsModal", (open: boolean) => {
            this.el.style.display = open ? "flex" : "none";
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    public close(): void {
        this.el.style.display = "none";
        store.emit("openSettingsModal", false);
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="modal-card" style="width: 480px;">
                <div class="modal-header">
                    <h3 style="font-size: 15px; font-weight: 700;">FabricLab Settings & Preferences</h3>
                    <button class="btn btn-secondary btn-sm" id="btn-close-settings" style="padding: 2px 6px;">✕</button>
                </div>

                <div class="modal-body" style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <div style="background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px;">
                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">Application Storage & Reset</div>
                            <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">Clear locally stored experiment snapshots and reset onboarding state.</p>
                            <button class="btn btn-secondary btn-sm" id="btn-clear-storage" style="color: var(--accent-rose); border-color: rgba(244,63,94,0.3);">
                                🗑 Reset Application Local Data
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary" id="btn-save-settings">Done</button>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-close-settings")?.addEventListener("click", () => this.close());
        this.el.querySelector("#btn-save-settings")?.addEventListener("click", () => this.close());
        this.el.querySelector("#btn-clear-storage")?.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all saved experiments and application data?")) {
                localStorage.clear();
                alert("Application data reset successfully.");
                location.reload();
            }
        });
    }
}
