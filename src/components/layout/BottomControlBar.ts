import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";

export class BottomControlBar {
    private el: HTMLElement;
    private engine: SimulationEngine;

    constructor(engine: SimulationEngine) {
        this.engine = engine;
        this.el = document.createElement("div");
        this.el.className = "bottom-control-bar";
        this.render();

        store.subscribe<any>("simulation", (sim: any) => {
            const playBtn = this.el.querySelector("#btn-play") as HTMLElement;
            if (playBtn) {
                playBtn.innerHTML = sim.paused ? "▶ Play" : "⏸ Pause";
            }
        });
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <button class="btn btn-primary" id="btn-play">▶ Play</button>
            <button class="btn btn-secondary" id="btn-step" title="Step One Frame (S / F)">⏭ Step</button>
            <button class="btn btn-secondary" id="btn-reset" title="Reset Mesh (R)">↺ Reset</button>

            <div class="control-separator"></div>

            <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">SPEED:</span>
                <button class="btn btn-secondary btn-sm speed-btn active" data-speed="1.0">1.0x</button>
                <button class="btn btn-secondary btn-sm speed-btn" data-speed="0.5">0.5x</button>
                <button class="btn btn-secondary btn-sm speed-btn" data-speed="0.25">0.25x</button>
                <button class="btn btn-secondary btn-sm speed-btn" data-speed="2.0">2.0x</button>
            </div>

            <div class="control-separator"></div>

            <div style="display: flex; align-items: center; gap: 4px;">
                <select id="select-cam-preset" class="text-input" style="width: auto; padding: 4px 8px; font-size: 11px; height: 26px;">
                    <option value="perspective">🎥 Perspective</option>
                    <option value="front">Front View</option>
                    <option value="side">Side View</option>
                    <option value="top">Top Down</option>
                    <option value="close">Close-up</option>
                </select>
            </div>

            <div class="control-separator"></div>

            <button class="btn btn-secondary" id="btn-screenshot" title="Capture Viewport Screenshot (PNG)">📸 Capture</button>
            <button class="btn btn-secondary" id="btn-save-exp">💾 Save Snapshot</button>
        `;

        const playBtn = this.el.querySelector("#btn-play") as HTMLButtonElement;
        playBtn.addEventListener("click", () => {
            const isPaused = this.engine.togglePaused();
            store.setSimulation({ paused: isPaused });
        });

        const stepBtn = this.el.querySelector("#btn-step") as HTMLButtonElement;
        stepBtn.addEventListener("click", () => this.engine.step());

        const resetBtn = this.el.querySelector("#btn-reset") as HTMLButtonElement;
        resetBtn.addEventListener("click", () => this.engine.resetSimulation());

        const camSelect = this.el.querySelector("#select-cam-preset") as HTMLSelectElement;
        camSelect.addEventListener("change", () => {
            this.engine.setCameraPreset(camSelect.value);
        });

        const screenshotBtn = this.el.querySelector("#btn-screenshot") as HTMLButtonElement;
        screenshotBtn.addEventListener("click", () => {
            const dataUrl = this.engine.captureScreenshotPNG();
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `FabricLab_${store.material.id}_${Date.now()}.png`;
            a.click();
        });

        const saveExpBtn = this.el.querySelector("#btn-save-exp") as HTMLButtonElement;
        saveExpBtn.addEventListener("click", () => {
            store.emit("openSaveModal", true);
        });

        this.el.querySelectorAll(".speed-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.el.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
                const target = e.currentTarget as HTMLElement;
                target.classList.add("active");
                const speed = parseFloat(target.dataset.speed || "1.0");
                this.engine.setSpeedMultiplier(speed);
                store.setSimulation({ speedMultiplier: speed });
            });
        });

        window.addEventListener("keydown", (e) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === "Space") {
                e.preventDefault();
                playBtn.click();
            } else if (e.code === "KeyR") {
                resetBtn.click();
            } else if (e.code === "KeyC") {
                this.engine.resetCamera();
            } else if (e.code === "KeyS" || e.code === "KeyF") {
                stepBtn.click();
            }
        });
    }
}
