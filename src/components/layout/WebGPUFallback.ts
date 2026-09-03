export class WebGPUFallback {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "page-screen";
        this.render();
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div style="max-width: 600px; margin: 80px auto; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(244, 63, 94, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-rose); font-size: 20px;">⚠</div>
                    <div>
                        <h2 style="font-size: 18px; font-weight: 700;">WebGPU Hardware Acceleration Required</h2>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">FabricLab runs high-performance XPBD compute shaders natively on the GPU.</p>
                    </div>
                </div>

                <div style="background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                    <p><strong>Supported Browsers:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 6px;">
                        <li>Google Chrome (v113+ on Windows / macOS / Linux)</li>
                        <li>Microsoft Edge (v113+)</li>
                        <li>Brave Browser (v1.51+)</li>
                    </ul>
                </div>

                <button class="btn btn-primary" onclick="location.reload()" style="align-self: flex-start;">
                    ↻ Retry WebGPU Initialization
                </button>
            </div>
        `;
    }
}
