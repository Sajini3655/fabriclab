import { store, PageId } from "../../state/Store";

export class TopBar {
    private el: HTMLElement;
    private isMobileMenuOpen: boolean = false;

    constructor() {
        this.el = document.createElement("header");
        this.el.className = "top-bar";
        this.render();

        store.subscribe<PageId>("page", () => this.updateNavActiveState());
        store.subscribe<any>("metrics", (m: any) => this.updateStatus(m.fps));
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="brand-section">
                <div class="brand-logo" id="brand-logo-btn" title="FabricLab">
                    <span>FabricLab</span>
                    <span class="brand-badge">XPBD</span>
                </div>
            </div>

            <!-- Desktop Navigation Links -->
            <nav class="nav-links desktop-nav" id="nav-links">
                <button class="nav-item" data-page="landing">Home</button>
                <button class="nav-item active" data-page="laboratory">Laboratory</button>
                <button class="nav-item" data-page="materials">Materials</button>
                <button class="nav-item" data-page="comparison">Compare</button>
                <button class="nav-item" data-page="experiments">Experiments</button>
                <button class="nav-item" data-page="benchmarks">Benchmark</button>
                <button class="nav-item" data-page="about">About</button>
            </nav>

            <div class="status-section">
                <button class="btn btn-secondary btn-sm desktop-only" id="btn-cmd-palette" title="Command Palette (Ctrl+K)" style="padding: 4px 8px; font-family: var(--font-mono); font-size: 11px;">
                    <span>⌘K</span>
                </button>
                <button class="btn btn-secondary btn-sm desktop-only" id="btn-help" title="Help & Controls (?)" style="padding: 4px 8px;">
                    <span>?</span>
                </button>
                <div class="webgpu-status-pill desktop-only">
                    <span class="status-dot"></span>
                    <span id="webgpu-status-text">60 fps</span>
                </div>

                <!-- Mobile 3-Line Hamburger Button -->
                <button class="btn btn-secondary btn-sm mobile-hamburger-btn" id="btn-mobile-menu" aria-label="Toggle Menu">
                    <span id="hamburger-icon">☰</span>
                </button>
            </div>

            <!-- Mobile Navigation Drawer -->
            <div class="mobile-nav-drawer" id="mobile-nav-drawer">
                <button class="mobile-nav-item" data-page="landing">🏠 Home</button>
                <button class="mobile-nav-item" data-page="laboratory">🔬 Laboratory</button>
                <button class="mobile-nav-item" data-page="materials">🧶 Materials Archive</button>
                <button class="mobile-nav-item" data-page="comparison">⚖️ Material Comparison</button>
                <button class="mobile-nav-item" data-page="experiments">🧪 Research Experiments</button>
                <button class="mobile-nav-item" data-page="benchmarks">⚡ GPU Benchmarks</button>
                <button class="mobile-nav-item" data-page="about">📖 About & Citations</button>
            </div>
        `;

        const closeMobileMenu = () => {
            this.isMobileMenuOpen = false;
            const drawer = this.el.querySelector("#mobile-nav-drawer");
            const icon = this.el.querySelector("#hamburger-icon");
            if (drawer) drawer.classList.remove("open");
            if (icon) icon.textContent = "☰";
        };

        this.el.querySelector("#brand-logo-btn")?.addEventListener("click", () => {
            closeMobileMenu();
            store.setPage("landing");
        });

        this.el.querySelectorAll(".nav-item, .mobile-nav-item").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = (e.currentTarget as HTMLElement).dataset.page as PageId;
                if (target) {
                    closeMobileMenu();
                    store.setPage(target);
                }
            });
        });

        const hamburgerBtn = this.el.querySelector("#btn-mobile-menu");
        hamburgerBtn?.addEventListener("click", () => {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            const drawer = this.el.querySelector("#mobile-nav-drawer");
            const icon = this.el.querySelector("#hamburger-icon");
            if (drawer) drawer.classList.toggle("open", this.isMobileMenuOpen);
            if (icon) icon.textContent = this.isMobileMenuOpen ? "✕" : "☰";
        });

        this.el.querySelector("#btn-cmd-palette")?.addEventListener("click", () => store.emit("openCommandPalette", true));
        this.el.querySelector("#btn-help")?.addEventListener("click", () => store.emit("openHelpModal", true));
    }

    private updateNavActiveState(): void {
        const current = store.activePage;
        this.el.querySelectorAll(".nav-item, .mobile-nav-item").forEach(btn => {
            const page = (btn as HTMLElement).dataset.page;
            if (page === current || (page === "comparison" && (current as string) === "compare")) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    private updateStatus(fps: number): void {
        const textEl = this.el.querySelector("#webgpu-status-text");
        if (textEl && fps > 0) {
            textEl.textContent = `${fps} fps`;
        }
    }
}
