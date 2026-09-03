import { store } from "../../state/Store";

export class HelpModal {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "modal-backdrop";
        this.el.style.display = "none";
        this.render();

        store.subscribe<boolean>("openHelpModal", (open: boolean) => {
            this.el.style.display = open ? "flex" : "none";
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    public close(): void {
        this.el.style.display = "none";
        store.emit("openHelpModal", false);
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="modal-card" style="width: 520px;">
                <div class="modal-header">
                    <h3 style="font-size: 15px; font-weight: 700;">FabricLab Laboratory Guide & Controls</h3>
                    <button class="btn btn-secondary btn-sm" id="btn-close-help" style="padding: 2px 6px;">✕</button>
                </div>

                <div class="modal-body" style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <h4 style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Mouse & Touch Interactions</h4>
                        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 6px; background: var(--bg-base); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                            <span style="font-family: var(--font-mono); color: var(--accent-blue);">Left Drag</span>
                            <span>Orbit 3D camera (in Orbit Mode) or Pull cloth vertices (in Grab Mode).</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-blue);">Scroll Wheel</span>
                            <span>Zoom camera in and out smoothly.</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-blue);">Left Click</span>
                            <span>Toggle custom anchor pin at cursor (in Edit Anchors Mode).</span>
                        </div>

                        <h4 style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 6px;">Global Keyboard Shortcuts</h4>
                        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 6px; background: var(--bg-base); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">Spacebar</span>
                            <span>Play / Pause physics simulation.</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">R</span>
                            <span>Reset cloth geometry to initial state.</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">C</span>
                            <span>Reset camera orientation and zoom.</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">F / S</span>
                            <span>Step forward exactly one physics frame.</span>
                            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">Ctrl / ⌘ + K</span>
                            <span>Open Universal Command Palette.</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary" id="btn-ok-help">Got it</button>
                </div>
            </div>
        `;

        this.el.querySelector("#btn-close-help")?.addEventListener("click", () => this.close());
        this.el.querySelector("#btn-ok-help")?.addEventListener("click", () => this.close());
    }
}
