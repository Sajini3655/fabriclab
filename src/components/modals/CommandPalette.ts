import { store, PageId } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";

export class CommandPalette {
    private el: HTMLElement;
    private engine: SimulationEngine;
    private isOpen: boolean = false;

    constructor(engine: SimulationEngine) {
        this.engine = engine;
        this.el = document.createElement("div");
        this.el.className = "modal-backdrop";
        this.el.style.display = "none";
        this.render();

        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                this.toggle();
            } else if (e.key === "Escape" && this.isOpen) {
                this.close();
            }
        });

        store.subscribe<boolean>("openCommandPalette", (open: boolean) => {
            if (open && !this.isOpen) this.open();
            else if (!open && this.isOpen) this.close();
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    public open(): void {
        if (this.isOpen) return;
        this.isOpen = true;
        this.el.style.display = "flex";
        const input = this.el.querySelector("#cmd-input") as HTMLInputElement;
        if (input) {
            input.value = "";
            input.focus();
            this.filterCommands("");
        }
    }

    public close(): void {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.el.style.display = "none";
    }

    public toggle(): void {
        if (this.isOpen) this.close();
        else this.open();
    }

    private getCommands() {
        return [
            { id: "nav-lab", label: "Open Laboratory", category: "Navigation", icon: "🔬", action: () => store.setPage("laboratory") },
            { id: "nav-mat", label: "Open Material Library", category: "Navigation", icon: "🧪", action: () => store.setPage("materials") },
            { id: "nav-bench", label: "Open Performance Benchmarks", category: "Navigation", icon: "⚡", action: () => store.setPage("benchmarks") },
            { id: "nav-exp", label: "Open Saved Experiments", category: "Navigation", icon: "📁", action: () => store.setPage("experiments") },
            { id: "nav-comp", label: "Open Material Comparison", category: "Navigation", icon: "⚖️", action: () => store.setPage("comparison") },
            { id: "nav-about", label: "Open About & Attribution", category: "Navigation", icon: "📖", action: () => store.setPage("about") },

            { id: "sim-play", label: "Toggle Play / Pause", category: "Simulation", icon: "⏯", action: () => store.setSimulation({ paused: this.engine.togglePaused() }) },
            { id: "sim-reset", label: "Reset Cloth Simulation", category: "Simulation", icon: "↺", action: () => this.engine.resetSimulation() },
            { id: "sim-step", label: "Step Forward One Frame", category: "Simulation", icon: "⏭", action: () => this.engine.step() },
            { id: "sim-save", label: "Save Experiment Snapshot", category: "Simulation", icon: "💾", action: () => store.emit("openSaveModal", true) },

            { id: "view-shaded", label: "Set Display: PBR Shaded Mode", category: "Display", icon: "🎨", action: () => { this.engine.setViewMode("shaded"); store.setSimulation({ viewMode: "shaded" }); } },
            { id: "view-normal", label: "Set Display: Normal Vectors", category: "Display", icon: "🧭", action: () => { this.engine.setViewMode("normal"); store.setSimulation({ viewMode: "normal" }); } },
            { id: "view-wire", label: "Set Display: Wireframe Mode", category: "Display", icon: "🕸", action: () => { this.engine.setViewMode("wireframe"); store.setSimulation({ viewMode: "wireframe" }); } },
            { id: "view-stress", label: "Set Display: Stress Heat-Map View", category: "Display", icon: "🔥", action: () => { this.engine.setViewMode("stress"); store.setSimulation({ viewMode: "stress" }); } },

            { id: "cam-reset", label: "Reset Camera View", category: "Camera", icon: "🎥", action: () => this.engine.resetCamera() },
            { id: "cam-front", label: "Camera Preset: Front View", category: "Camera", icon: "🎥", action: () => this.engine.setCameraPreset("front") },
            { id: "cam-top", label: "Camera Preset: Top View", category: "Camera", icon: "🎥", action: () => this.engine.setCameraPreset("top") },
            { id: "cam-side", label: "Camera Preset: Side View", category: "Camera", icon: "🎥", action: () => this.engine.setCameraPreset("side") },

            ...Object.values(MATERIAL_PRESETS).map(m => ({
                id: "mat-" + m.id,
                label: "Select Material: " + m.name,
                category: "Materials",
                icon: "🧵",
                action: () => { store.setMaterial(m); this.engine.setMaterial(m); }
            }))
        ];
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="modal-card" style="width: 540px; max-height: 480px;">
                <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 16px; color: var(--accent-blue);">⌘</span>
                    <input type="text" id="cmd-input" class="text-input" style="border: none; background: transparent; font-size: 14px; padding: 0;" placeholder="Type a command or search..." />
                    <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-card); padding: 2px 6px; border-radius: 3px;">ESC</span>
                </div>
                <div id="cmd-list" style="overflow-y: auto; max-height: 380px; padding: 6px;"></div>
            </div>
        `;

        const input = this.el.querySelector("#cmd-input") as HTMLInputElement;
        input.addEventListener("input", () => this.filterCommands(input.value.toLowerCase().trim()));

        this.el.addEventListener("click", (e) => {
            if (e.target === this.el) this.close();
        });
    }

    private filterCommands(query: string): void {
        const list = this.el.querySelector("#cmd-list") as HTMLElement;
        const commands = this.getCommands().filter(c => c.label.toLowerCase().includes(query) || c.category.toLowerCase().includes(query));

        list.innerHTML = "";
        if (commands.length === 0) {
            list.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">No matching commands found.</div>`;
            return;
        }

        commands.forEach((c, idx) => {
            const item = document.createElement("div");
            item.className = "cmd-item" + (idx === 0 ? " active" : "");
            item.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.1s ease;";
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${c.icon}</span>
                    <span style="font-weight: 500;">${c.label}</span>
                </div>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">${c.category}</span>
            `;

            item.addEventListener("mouseenter", () => {
                list.querySelectorAll(".cmd-item").forEach(i => (i as HTMLElement).style.background = "transparent");
                item.style.background = "var(--bg-card-hover)";
            });

            item.addEventListener("click", () => {
                c.action();
                this.close();
            });

            list.appendChild(item);
        });
    }
}
