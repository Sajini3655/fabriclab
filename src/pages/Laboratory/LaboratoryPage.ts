import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";
import { MaterialProperty } from "../../types/material";
import { ViewMode, InteractionMode } from "../../types/simulation";

export class LaboratoryPage {
    private el: HTMLElement;
    private engine: SimulationEngine;
    private sparklineCanvas!: HTMLCanvasElement;
    private sparklineCtx!: CanvasRenderingContext2D;
    private frameHistory: number[] = [];
    private graphMode: "ft" | "fps" = "ft";

    constructor(engine: SimulationEngine) {
        this.engine = engine;
        this.el = document.createElement("div");
        this.el.className = "main-view-container";
        this.render();
        this.initSubscriptions();
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    private render(): void {
        this.el.innerHTML = `
            <div class="lab-viewport-container" id="viewport-container"></div>
            <div class="dock-backdrop" id="dock-backdrop"></div>
            <div class="mobile-dock-toggles">
                <button class="btn btn-secondary btn-sm" id="btn-toggle-left-dock">⚙️ Controls</button>
                <button class="btn btn-secondary btn-sm" id="btn-toggle-right-dock">📊 Telemetry</button>
            </div>

            <div class="viewport-overlay">
                <div style="display: flex; gap: 2px;">
                    <button class="overlay-btn active" data-mode="shaded">Shaded</button>
                    <button class="overlay-btn" data-mode="normal">Normals</button>
                    <button class="overlay-btn" data-mode="wireframe">Wireframe</button>
                    <button class="overlay-btn" data-mode="stress">🔥 Stress Heat-Map</button>
                </div>
                <div class="control-separator"></div>
                <div style="display: flex; gap: 2px;">
                    <button class="overlay-btn active" id="btn-mode-orbit">🎥 Orbit Cam</button>
                    <button class="overlay-btn" id="btn-mode-grab">✋ Grab Cloth</button>
                    <button class="overlay-btn" id="btn-mode-anchor">📌 Edit Anchors</button>
                </div>
            </div>

            <div id="stress-legend" style="display: none; position: absolute; bottom: 80px; right: calc(var(--panel-width) + 24px); background: var(--bg-panel); backdrop-filter: blur(12px); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; z-index: 15; font-size: 10px; font-family: var(--font-mono);">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">XPBD Strain Energy / Stress</div>
                <div style="width: 140px; height: 8px; background: linear-gradient(90deg, #0d32cc, #00cce6, #1ae64c, #f2cc1a, #f22626); border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                    <span>Low (0%)</span>
                    <span>Med</span>
                    <span>High (100%)</span>
                </div>
            </div>

            <aside class="dock-panel dock-left" id="dock-left">
                <div class="dock-header">
                    <span class="dock-title">Laboratory Controls</span>
     <button class="dock-close-btn" id="btn-close-left-dock" title="Close Panel">✕</button>
                    <div class="dock-tabs">
                        <button class="dock-tab-btn active" data-tab="materials">Materials</button>
                        <button class="dock-tab-btn" data-tab="physics">Physics</button>
                        <button class="dock-tab-btn" data-tab="environment">Env</button>
                    </div>
                </div>

                <div class="dock-body">
                    <div id="tab-content-materials" class="tab-pane">
                        <div class="control-group">
                            <div class="group-header">
                                <span>Material Specimen</span>
                                <button class="btn btn-secondary btn-sm" id="btn-view-all-materials" style="font-size: 10px; padding: 2px 6px;">Catalog →</button>
                            </div>
                            <div class="material-grid" id="material-selector-grid"></div>
                        </div>
                    </div>

                    <div id="tab-content-physics" class="tab-pane" style="display: none;">
                        <div class="control-group">
                            <div class="group-header">XPBD Solver Parameters</div>
                            <div class="control-row">
                                <div class="control-label">
                                    <span>Sub-Steps / Frame</span>
                                    <span class="control-value" id="val-substeps">10</span>
                                </div>
                                <input type="range" id="slider-substeps" min="1" max="30" step="1" value="10" />
                            </div>

                            <div class="control-row">
                                <div class="control-label">
                                    <span>Mesh Grid Divisions</span>
                                    <span class="control-value" id="val-divisions">60x60</span>
                                </div>
                                <input type="range" id="slider-divisions" min="20" max="150" step="10" value="60" />
                            </div>

                            <div class="control-row">
                                <div class="control-label">
                                    <span>Anchor / Pinning Mode</span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 4px;">
                                    <button class="btn btn-secondary btn-sm pin-btn active" data-pin="top">Top Edge</button>
                                    <button class="btn btn-secondary btn-sm pin-btn" data-pin="corners">2 Corners</button>
                                    <button class="btn btn-secondary btn-sm pin-btn" data-pin="free">Free</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="tab-content-environment" class="tab-pane" style="display: none;">
                        <div class="control-group">
                            <div class="group-header">Gravitational Field</div>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 4px;">
                                <button class="btn btn-secondary btn-sm grav-btn active" data-grav="earth">Earth</button>
                                <button class="btn btn-secondary btn-sm grav-btn" data-grav="moon">Moon</button>
                                <button class="btn btn-secondary btn-sm grav-btn" data-grav="mars">Mars</button>
                                <button class="btn btn-secondary btn-sm grav-btn" data-grav="zero">Zero G</button>
                            </div>
                        </div>

                        <div class="control-group" style="margin-top: 12px;">
                            <div class="group-header">
                                <span>Aerodynamic Wind Drag</span>
                                <input type="checkbox" id="check-wind" style="cursor: pointer;" />
                            </div>
                            <div class="control-row">
                                <div class="control-label">
                                    <span>Wind Speed</span>
                                    <span class="control-value" id="val-wind-speed">8 m/s</span>
                                </div>
                                <input type="range" id="slider-wind-speed" min="0" max="40" step="1" value="8" />
                            </div>
                            <div class="control-row">
                                <div class="control-label">
                                    <span>Wind Azimuth (0 - 360°)</span>
                                    <span class="control-value" id="val-wind-dir">45°</span>
                                </div>
                                <input type="range" id="slider-wind-dir" min="0" max="360" step="5" value="45" />
                            </div>
                        </div>

                        <div class="control-group" style="margin-top: 12px;">
                            <div class="group-header">
                                <span>Rigid Colliders</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; cursor: pointer;">
                                    <input type="checkbox" id="check-sphere" />
                                    <span>Sphere Collider (r=2.2m)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; cursor: pointer;">
                                    <input type="checkbox" id="check-ground" />
                                    <span>Ground Plane (y = -7.5m)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <aside class="dock-panel dock-right" id="dock-right">
                <div class="dock-header">
                    <span class="dock-title">Live Telemetry & Diagnostics</span>
     <button class="dock-close-btn" id="btn-close-right-dock" title="Close Panel">✕</button>
                </div>

                <div class="dock-body">
                    <div class="metrics-grid">
                        <div class="metric-tile">
                            <span class="metric-name">Frame Rate</span>
                            <span class="metric-val" id="metric-fps" style="color: var(--accent-emerald);">60 FPS</span>
                        </div>
                        <div class="metric-tile">
                            <span class="metric-name">Frame Latency</span>
                            <span class="metric-val" id="metric-frametime">16.6 ms</span>
                        </div>
                        <div class="metric-tile">
                            <span class="metric-name">Active Particles</span>
                            <span class="metric-val" id="metric-particles">3,721</span>
                        </div>
                        <div class="metric-tile">
                            <span class="metric-name">XPBD Constraints</span>
                            <span class="metric-val" id="metric-constraints">18,240</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <div class="group-header">
                            <span>Rolling Telemetry</span>
                            <div style="display: flex; gap: 4px;">
                                <button class="btn btn-secondary btn-sm" id="btn-toggle-graph" style="font-size: 9px; padding: 1px 5px;">FPS / Latency</button>
                            </div>
                        </div>
                        <canvas class="sparkline-canvas" id="sparkline-canvas" width="280" height="60"></canvas>
                    </div>

                    <div class="control-group" style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                        <div class="group-header" id="inspector-mat-name">Mulberry Silk</div>
                        <p id="inspector-mat-desc" style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;"></p>
                        
                        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                <span style="color: var(--text-muted);">Area Density:</span>
                                <span class="control-value" id="inspector-density">0.065 kg/m²</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                <span style="color: var(--text-muted);">Stretch Compliance:</span>
                                <span class="control-value" id="inspector-stretch">0.0001</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                <span style="color: var(--text-muted);">Bending Compliance:</span>
                                <span class="control-value" id="inspector-bend">0.015</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                <span style="color: var(--text-muted);">Internal Damping:</span>
                                <span class="control-value" id="inspector-damping">0.012</span>
                            </div>
                        </div>

                        <button class="btn btn-secondary btn-sm" id="btn-inspect-modal" style="margin-top: 8px;">
                            🔬 Open Full Specimen Analysis
                        </button>
                    </div>
                </div>
            </aside>
        `;

        const vpContainer = this.el.querySelector("#viewport-container") as HTMLElement;
        vpContainer.appendChild(this.engine.canvas);

        this.sparklineCanvas = this.el.querySelector("#sparkline-canvas") as HTMLCanvasElement;
        this.sparklineCtx = this.sparklineCanvas.getContext("2d")!;

        this.initMaterialGrid();
        this.initDockTabs();
        this.initControlListeners();
     this.initMobileDockListeners();
    }

    private initMaterialGrid(): void {
        const grid = this.el.querySelector("#material-selector-grid") as HTMLElement;
        grid.innerHTML = "";

        Object.values(MATERIAL_PRESETS).forEach((mat) => {
            const card = document.createElement("div");
            card.className = "material-card" + (mat.id === store.material.id ? " active" : "");
            card.dataset.id = mat.id;

            const rgb = `rgb(${Math.round(mat.color[0] * 255)}, ${Math.round(mat.color[1] * 255)}, ${Math.round(mat.color[2] * 255)})`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span class="material-chip" style="background: ${rgb};"></span>
                    <span style="font-size: 9px; color: var(--text-muted); font-family: var(--font-mono);">${mat.category}</span>
                </div>
                <div class="material-card-name">${mat.name}</div>
                <div class="material-card-meta">${mat.stiffnessRating} Stiffness</div>
            `;

            card.addEventListener("click", () => {
                store.setMaterial(mat);
                this.engine.setMaterial(mat);
            });

            grid.appendChild(card);
        });
    }

    private initDockTabs(): void {
        this.el.querySelectorAll(".dock-tab-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.el.querySelectorAll(".dock-tab-btn").forEach(b => b.classList.remove("active"));
                const target = e.currentTarget as HTMLElement;
                target.classList.add("active");

                const tab = target.dataset.tab;
                this.el.querySelectorAll(".tab-pane").forEach(p => (p as HTMLElement).style.display = "none");
                const activePane = this.el.querySelector(`#tab-content-${tab}`) as HTMLElement;
                if (activePane) activePane.style.display = "block";
            });
        });
    }

    private initControlListeners(): void {
        this.el.querySelectorAll("[data-mode]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.el.querySelectorAll("[data-mode]").forEach(b => b.classList.remove("active"));
                const target = e.currentTarget as HTMLElement;
                target.classList.add("active");
                const mode = target.dataset.mode as ViewMode;
                store.setSimulation({ viewMode: mode });
                this.engine.setViewMode(mode);

                const legend = this.el.querySelector("#stress-legend") as HTMLElement;
                if (legend) {
                    legend.style.display = mode === "stress" ? "block" : "none";
                }
            });
        });

        const orbitBtn = this.el.querySelector("#btn-mode-orbit") as HTMLElement;
        const grabBtn = this.el.querySelector("#btn-mode-grab") as HTMLElement;
        const anchorBtn = this.el.querySelector("#btn-mode-anchor") as HTMLElement;

        const setInterMode = (mode: InteractionMode) => {
            orbitBtn.classList.toggle("active", mode === "orbit");
            grabBtn.classList.toggle("active", mode === "grab");
            anchorBtn.classList.toggle("active", mode === "anchor");
            this.engine.setInteractionMode(mode);
            store.setSimulation({ interactionMode: mode });
        };

        orbitBtn.addEventListener("click", () => setInterMode("orbit"));
        grabBtn.addEventListener("click", () => setInterMode("grab"));
        anchorBtn.addEventListener("click", () => setInterMode("anchor"));

        const substepsSlider = this.el.querySelector("#slider-substeps") as HTMLInputElement;
        const substepsVal = this.el.querySelector("#val-substeps") as HTMLElement;
        substepsSlider.addEventListener("input", () => {
            const val = parseInt(substepsSlider.value);
            substepsVal.textContent = val.toString();
            this.engine.setPhysics({ subSteps: val });
            store.setSimulation({ subSteps: val });
        });

        const divsSlider = this.el.querySelector("#slider-divisions") as HTMLInputElement;
        const divsVal = this.el.querySelector("#val-divisions") as HTMLElement;
        divsSlider.addEventListener("change", () => {
            const val = parseInt(divsSlider.value);
            divsVal.textContent = `${val}x${val}`;
            this.engine.setPhysics({ widthDivisions: val, heightDivisions: val });
            store.setSimulation({ widthDivisions: val, heightDivisions: val });
        });

        this.el.querySelectorAll(".pin-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.el.querySelectorAll(".pin-btn").forEach(b => b.classList.remove("active"));
                const target = e.currentTarget as HTMLElement;
                target.classList.add("active");
                const pin = target.dataset.pin;
                if (pin === "top") {
                    this.engine.setPhysics({ pinTopEdge: true, pinCornersOnly: false });
                } else if (pin === "corners") {
                    this.engine.setPhysics({ pinTopEdge: false, pinCornersOnly: true });
                } else {
                    this.engine.setPhysics({ pinTopEdge: false, pinCornersOnly: false });
                }
            });
        });

        this.el.querySelectorAll(".grav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.el.querySelectorAll(".grav-btn").forEach(b => b.classList.remove("active"));
                const target = e.currentTarget as HTMLElement;
                target.classList.add("active");
                const grav = target.dataset.grav;
                let g = [0, -9.81, 0];
                if (grav === "moon") g = [0, -1.62, 0];
                if (grav === "mars") g = [0, -3.72, 0];
                if (grav === "zero") g = [0, 0, 0];

                this.engine.setEnvironment({ gravity: g as [number, number, number], gravityPreset: grav as any });
                store.setEnvironment({ gravity: g as [number, number, number], gravityPreset: grav as any });
            });
        });

        const windCheck = this.el.querySelector("#check-wind") as HTMLInputElement;
        const windSpeedSlider = this.el.querySelector("#slider-wind-speed") as HTMLInputElement;
        const windSpeedVal = this.el.querySelector("#val-wind-speed") as HTMLElement;
        const windDirSlider = this.el.querySelector("#slider-wind-dir") as HTMLInputElement;
        const windDirVal = this.el.querySelector("#val-wind-dir") as HTMLElement;

        const updateWind = () => {
            const enabled = windCheck.checked;
            const speed = parseFloat(windSpeedSlider.value);
            const dir = parseFloat(windDirSlider.value);
            windSpeedVal.textContent = `${speed} m/s`;
            windDirVal.textContent = `${dir}°`;

            this.engine.setEnvironment({
                windEnabled: enabled,
                windSpeed: speed,
                windDirectionDeg: dir
            });
        };

        windCheck.addEventListener("change", updateWind);
        windSpeedSlider.addEventListener("input", updateWind);
        windDirSlider.addEventListener("input", updateWind);

        const sphereCheck = this.el.querySelector("#check-sphere") as HTMLInputElement;
        const groundCheck = this.el.querySelector("#check-ground") as HTMLInputElement;

        sphereCheck.addEventListener("change", () => {
            this.engine.setEnvironment({ enableSphereCollider: sphereCheck.checked });
        });

        groundCheck.addEventListener("change", () => {
            this.engine.setEnvironment({ enableGroundPlane: groundCheck.checked });
        });

        this.el.querySelector("#btn-view-all-materials")?.addEventListener("click", () => {
            store.setPage("materials");
        });

        this.el.querySelector("#btn-inspect-modal")?.addEventListener("click", () => {
            store.emit("openMaterialDetail", store.material);
        });

        this.el.querySelector("#btn-toggle-graph")?.addEventListener("click", () => {
            this.graphMode = this.graphMode === "ft" ? "fps" : "ft";
        });
    }

    
    private initMobileDockListeners(): void {
        const leftDock = this.el.querySelector("#dock-left") as HTMLElement;
        const rightDock = this.el.querySelector("#dock-right") as HTMLElement;
        const backdrop = this.el.querySelector("#dock-backdrop") as HTMLElement;

        const toggleLeft = this.el.querySelector("#btn-toggle-left-dock");
        const toggleRight = this.el.querySelector("#btn-toggle-right-dock");
        const closeLeft = this.el.querySelector("#btn-close-left-dock");
        const closeRight = this.el.querySelector("#btn-close-right-dock");

        const closeAll = () => {
            leftDock?.classList.remove("dock-mobile-open");
            rightDock?.classList.remove("dock-mobile-open");
            backdrop?.classList.remove("dock-backdrop-active");
        };

        toggleLeft?.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = leftDock.classList.contains("dock-mobile-open");
            closeAll();
            if (!isOpen) {
                leftDock.classList.add("dock-mobile-open");
                backdrop.classList.add("dock-backdrop-active");
            }
        });

        toggleRight?.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = rightDock.classList.contains("dock-mobile-open");
            closeAll();
            if (!isOpen) {
                rightDock.classList.add("dock-mobile-open");
                backdrop.classList.add("dock-backdrop-active");
            }
        });

        closeLeft?.addEventListener("click", closeAll);
        closeRight?.addEventListener("click", closeAll);
        backdrop?.addEventListener("click", closeAll);
    }

    private initSubscriptions(): void {
        store.subscribe<MaterialProperty>("material", (mat: MaterialProperty) => {
            this.el.querySelectorAll(".material-card").forEach(c => {
                c.classList.toggle("active", (c as HTMLElement).dataset.id === mat.id);
            });

            const nameEl = this.el.querySelector("#inspector-mat-name");
            const descEl = this.el.querySelector("#inspector-mat-desc");
            const densEl = this.el.querySelector("#inspector-density");
            const stretchEl = this.el.querySelector("#inspector-stretch");
            const bendEl = this.el.querySelector("#inspector-bend");
            const dampEl = this.el.querySelector("#inspector-damping");

            if (nameEl) nameEl.textContent = mat.name;
            if (descEl) descEl.textContent = mat.description;
            if (densEl) densEl.textContent = `${mat.density} kg/m²`;
            if (stretchEl) stretchEl.textContent = mat.stretchCompliance.toString();
            if (bendEl) bendEl.textContent = mat.bendCompliance.toString();
            if (dampEl) dampEl.textContent = mat.damping.toString();
        });

        this.engine.onMetrics((m) => {
            const fpsEl = this.el.querySelector("#metric-fps");
            const ftEl = this.el.querySelector("#metric-frametime");
            const partEl = this.el.querySelector("#metric-particles");
            const constEl = this.el.querySelector("#metric-constraints");

            if (fpsEl) fpsEl.textContent = `${m.fps} FPS`;
            if (ftEl) ftEl.textContent = `${m.frameTimeMs} ms`;
            if (partEl) partEl.textContent = m.particleCount.toLocaleString();
            if (constEl) constEl.textContent = m.constraintCount.toLocaleString();

            this.updateSparkline(this.graphMode === "ft" ? m.frameTimeMs : m.fps);
        });
    }

    private updateSparkline(val: number): void {
        this.frameHistory.push(val);
        if (this.frameHistory.length > 50) this.frameHistory.shift();

        const ctx = this.sparklineCtx;
        const w = this.sparklineCanvas.width;
        const h = this.sparklineCanvas.height;

        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        ctx.strokeStyle = this.graphMode === "ft" ? "#3b82f6" : "#10b981";
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const step = w / 50;
        const maxVal = this.graphMode === "ft" ? 33 : 144;

        for (let i = 0; i < this.frameHistory.length; i++) {
            const x = i * step;
            const y = Math.max(4, Math.min(h - 4, h - (this.frameHistory[i] / maxVal) * h));
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}
