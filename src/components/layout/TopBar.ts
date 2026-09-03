import { store, PageId } from "../../state/Store";

export class TopBar {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement("header");
        this.el.className = "top-bar";
        this.render();

        store.subscribe<PageId>("page", () => this.updateNavActiveState());
        store.subscribe<any>("metrics", (m: any) => this.updateStatus(m.webgpuStatus, m.adapterVendor, m.fps));
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="brand-section">
                <div class="brand-logo" id="brand-logo-btn" style="cursor: pointer;">
                    <span>FabricLab</span>
                    <span class="brand-badge">XPBD 3.0</span>
                </div>
                <div class="brand-tagline">Interactive Physics Lab</div>
            </div>

            <nav class="nav-links" id="nav-links">
                <button class="nav-item" data-page="landing">Home</button>
                <button class="nav-item active" data-page="laboratory">Laboratory</button>
                <button class="nav-item" data-page="materials">Materials</button>
                <button class="nav-item" data-page="comparison">Comparison</button>
                <button class="nav-item" data-page="experiments">Experiments</button>
                <button class="nav-item" data-page="benchmarks">Benchmarks</button>
                <button class="nav-item" data-page="about">About & Science</button>
            </nav>

            <div class="status-section">
                <button class="btn btn-secondary btn-sm" id="btn-cmd-palette" title="Command Palette (Ctrl+K)">
                    <span>⌘K</span>
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-help" title="Help & Controls (?)">
                    <span>?</span>
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-settings" title="Settings">
                    <span>⚙</span>
                </button>
                <div class="webgpu-status-pill" id="webgpu-status-pill">
                    <span class="status-dot"></span>
                    <span id="webgpu-status-text">WebGPU READY</span>
                </div>
            </div>
        `;

        this.el.querySelector("#brand-logo-btn")?.addEventListener("click", () => store.setPage("landing"));

        this.el.querySelectorAll(".nav-item").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = (e.currentTarget as HTMLElement).dataset.page as PageId;
                if (target) store.setPage(target);
            });
        });

        this.el.querySelector("#btn-cmd-palette")?.addEventListener("click", () => store.emit("openCommandPalette", true));
        this.el.querySelector("#btn-help")?.addEventListener("click", () => store.emit("openHelpModal", true));
        this.el.querySelector("#btn-settings")?.addEventListener("click", () => store.emit("openSettingsModal", true));
    }

    private updateNavActiveState(): void {
        this.el.querySelectorAll(".nav-item").forEach(btn => {
            const page = (btn as HTMLElement).dataset.page;
            btn.classList.toggle("active", page === store.activePage);
        });
    }

    private updateStatus(status: string, vendor: string, fps: number): void {
        const text = this.el.querySelector("#webgpu-status-text");
        if (text) {
            text.textContent = status === "ready" ? `WebGPU READY • ${fps || 60} FPS` : status.toUpperCase();
        }
    }
}
