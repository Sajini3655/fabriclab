import { store } from "../../state/Store";
import { SimulationEngine } from "../../simulation/engine/SimulationEngine";
import { MATERIAL_PRESETS } from "../../simulation/materials/MaterialPresets";

export class LandingPage {
    private el: HTMLElement;
    private engine: SimulationEngine;

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
        const silk = MATERIAL_PRESETS.silk;
        const denim = MATERIAL_PRESETS.denim;
        const latex = MATERIAL_PRESETS.rubber;

        this.el.innerHTML = `
            <div style="display: flex; flex-direction: column; width: 100%; gap: 72px;">
                
                <!-- ================================================================= -->
                <!-- 1. HERO SECTION: Split Exhibition Stage -->
                <!-- ================================================================= -->
                <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; min-height: 520px; padding-top: 12px;">
                    
                    <!-- Left: Editorial Opening -->
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div style="display: inline-flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary);"></span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600;">
                                Computational Physics // 01
                            </span>
                        </div>

                        <h1 style="font-size: clamp(38px, 4.5vw, 60px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.04; color: var(--text-primary);">
                            Understand<br/>
                            how digital<br/>
                            materials move.
                        </h1>

                        <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.65; max-width: 540px;">
                            FabricLab is an interactive computational material laboratory. Experiment with parameterized physical forces, compliant constraints, and WebGPU compute dynamics in real time.
                        </p>

                        <div style="display: flex; gap: 14px; margin-top: 8px; flex-wrap: wrap;">
                            <button class="btn btn-primary" id="btn-hero-lab" style="padding: 12px 28px; font-size: 13px;">
                                Open Laboratory →
                            </button>
                            <button class="btn btn-secondary" id="btn-hero-materials" style="padding: 12px 24px; font-size: 13px;">
                                Explore Materials
                            </button>
                        </div>

                        <!-- Technical Eyebrow Annotations -->
                        <div style="display: flex; gap: 24px; border-top: 1px solid var(--border-subtle); padding-top: 20px; margin-top: 12px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Solver</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">XPBD Sub-stepped</span>
                            </div>
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Compute</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">Native WebGPU</span>
                            </div>
                            <div>
                                <span style="display: block; color: var(--text-dim); text-transform: uppercase;">Geometry</span>
                                <span style="color: var(--text-secondary); font-weight: 600;">3,721 Vertices</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Material Exhibition Showcase -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 20px; position: relative; box-shadow: 0 24px 64px rgba(0,0,0,0.5);">
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #06b6d4;"></span>
                                <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--text-primary); text-transform: uppercase;">Active Simulation Preset: Mulberry Silk</span>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-emerald);">● Live 60 FPS</span>
                        </div>

                        <!-- Interactive Visual Specimen Stage -->
                        <div style="background: #06070a; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); height: 260px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                            <div style="width: 130px; height: 130px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 4px; box-shadow: 0 16px 40px rgba(6, 182, 212, 0.35); transform: rotate(12deg) skew(-4deg); transition: transform 0.4s ease; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); font-family: var(--font-mono); font-size: 10px; font-weight: 700;">
                                XPBD // SILK
                            </div>
                            <span style="position: absolute; bottom: 12px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
                                [ 10 Sub-Steps • Alpha Compliance: 0.002 • Damping: 0.12 ]
                            </span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span style="color: var(--text-secondary);">Direct 3D vertex manipulation & wind aerodynamics ready.</span>
                            <button class="btn btn-secondary btn-sm" id="btn-quick-enter-lab" style="padding: 6px 14px;">
                                Launch in Workstation ↗
                            </button>
                        </div>
                    </div>

                </div>

                <!-- ================================================================= -->
                <!-- 2. THE MATERIAL ARCHIVE: Asymmetric Object Showcase -->
                <!-- ================================================================= -->
                <div style="display: flex; flex-direction: column; gap: 28px; border-top: 1px solid var(--border-subtle); padding-top: 48px;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">02 / The Material Archive</span>
                            <h2 style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-top: 4px; letter-spacing: -0.03em;">Eight Parameterized Specimens</h2>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">Standardized virtual textiles calibrated with physical density, stretch compliance, and bending resistance.</p>
                        </div>
                        <button class="btn btn-secondary" id="btn-view-all-mats">View All Specimens →</button>
                    </div>

                    <!-- Asymmetrical Gallery Grid (Large Featured + Medium Cards) -->
                    <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 24px; width: 100%;">
                        
                        <!-- Featured: Mulberry Silk -->
                        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px;">
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-primary); font-weight: 600;">FEATURED SPECIMEN // 01</span>
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #06b6d4;"></span>
                                </div>
                                <h3 style="font-size: 22px; font-weight: 700; color: var(--text-primary);">${silk.name}</h3>
                                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">Ultra-fine protein filament fabric characterized by gossamer fluid drape, minimal bending resistance, and high responsiveness to turbulent wind fields.</p>
                            </div>

                            <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px;">
                                <div>
                                    <span style="color: var(--text-muted); display: block;">Mass</span>
                                    <span style="color: var(--text-primary); font-weight: 600;">${silk.density} kg/m²</span>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); display: block;">Bending α</span>
                                    <span style="color: var(--text-primary); font-weight: 600;">${silk.bendCompliance}</span>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); display: block;">Damping</span>
                                    <span style="color: var(--text-primary); font-weight: 600;">${silk.damping}</span>
                                </div>
                                <button class="btn btn-primary btn-sm simulate-mat-btn" data-id="silk" style="padding: 4px 12px;">Simulate →</button>
                            </div>
                        </div>

                        <!-- Medium 1: Raw Denim -->
                        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); font-weight: 600;">SPECIMEN // 03</span>
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #2563eb;"></span>
                                </div>
                                <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${denim.name}</h3>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Heavyweight twill weave with rigid warp tension and sharp structural folds under gravity.</p>
                            </div>

                            <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 11px;">
                                <span>${denim.density} kg/m²</span>
                                <button class="btn btn-secondary btn-sm simulate-mat-btn" data-id="denim">Simulate →</button>
                            </div>
                        </div>

                        <!-- Medium 2: Natural Latex -->
                        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); font-weight: 600;">SPECIMEN // 06</span>
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: #64748b;"></span>
                                </div>
                                <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${latex.name}</h3>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Hyper-elastic isotropic elastomer membrane displaying high stretch compliance and energy return.</p>
                            </div>

                            <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 11px;">
                                <span>${latex.density} kg/m²</span>
                                <button class="btn btn-secondary btn-sm simulate-mat-btn" data-id="rubber">Simulate →</button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ================================================================= -->
                <!-- 3. LABORATORY CAPABILITIES: What You Can Study -->
                <!-- ================================================================= -->
                <div style="display: flex; flex-direction: column; gap: 28px; border-top: 1px solid var(--border-subtle); padding-top: 48px;">
                    <div>
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">03 / Research Capabilities</span>
                        <h2 style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-top: 4px; letter-spacing: -0.03em;">Interactive Simulation Dimensions</h2>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%;">
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">A // MATERIAL BEHAVIOR</span>
                            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Compliance & Drape</h4>
                            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">Observe how elastic compliance (α) parameters prevent stiff locking and reproduce realistic fabric draping.</p>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">B // ENVIRONMENTAL FIELDS</span>
                            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Aerodynamics & Gravity</h4>
                            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">Apply turbulent wind vectors, adjust planetary gravitational acceleration, and configure rigid sphere colliders.</p>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">C // DIRECT 3D RAYCASTING</span>
                            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Tension & Dynamic Pinning</h4>
                            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">Pull and release cloth vertices in real time; toggle custom anchor points with calibrated inverse-mass restoration.</p>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">D // DEFORMATION MAPPING</span>
                            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">Strain Energy Heat-Map</h4>
                            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">Inspect local relative edge strain approximations visualized in real-time through the scientific Turbo colormap.</p>
                        </div>
                    </div>
                </div>

                <!-- ================================================================= -->
                <!-- 4. COMPARISON & EXPERIMENTS WORKFLOW -->
                <!-- ================================================================= -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; border-top: 1px solid var(--border-subtle); padding-top: 48px;">
                    
                    <!-- Comparison Matrix Card -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px;">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase;">Analytical Matrix</span>
                            <h3 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">Side-by-Side Comparison</h3>
                            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">Evaluate analytical trade-offs between silk, denim, leather, and rubber under matched physical parameters.</p>
                        </div>

                        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-family: var(--font-mono); font-size: 11px; display: flex; justify-content: space-between;">
                            <div>
                                <span style="color: var(--text-muted); display: block;">SPECIMEN A</span>
                                <span style="color: var(--text-primary); font-weight: 600;">Mulberry Silk</span>
                            </div>
                            <div style="text-align: center; color: var(--accent-primary); font-weight: 700;">VS</div>
                            <div style="text-align: right;">
                                <span style="color: var(--text-muted); display: block;">SPECIMEN B</span>
                                <span style="color: var(--text-primary); font-weight: 600;">Raw Denim</span>
                            </div>
                        </div>

                        <button class="btn btn-secondary" id="btn-goto-compare" style="align-self: flex-start;">
                            Launch Comparison Matrix →
                        </button>
                    </div>

                    <!-- Research Record Archive Card -->
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px;">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase;">Research Archive</span>
                            <h3 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">Reproducible Experiments</h3>
                            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5;">Save simulation snapshots, record parameter profiles, duplicate studies, and export hardened JSON archives.</p>
                        </div>

                        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-family: var(--font-mono); font-size: 11px; display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--accent-primary); font-weight: 600;">EXP-042 // SILK WIND AERODYNAMICS</span>
                                <span style="color: var(--text-muted);">03 SEP 2026</span>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 10px;">Gravity: Earth (-9.81 m/s²) • Wind: 18 m/s • Grid: 70×70</span>
                        </div>

                        <button class="btn btn-secondary" id="btn-goto-experiments" style="align-self: flex-start;">
                            Open Research Archive →
                        </button>
                    </div>

                </div>

                <!-- ================================================================= -->
                <!-- 5. PERFORMANCE & BENCHMARK PREVIEW -->
                <!-- ================================================================= -->
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 36px; display: flex; flex-direction: column; gap: 24px; border-top: 1px solid var(--border-subtle);">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">04 / GPU Compute Performance</span>
                            <h2 style="font-size: 26px; font-weight: 700; color: var(--text-primary); margin-top: 4px; letter-spacing: -0.03em;">Performance Stress Laboratory</h2>
                            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Hardware and browser-dependent frame latency throughput across resolution tiers.</p>
                        </div>
                        <button class="btn btn-secondary" id="btn-goto-benchmark">Open Benchmark Lab →</button>
                    </div>

                    <!-- Metrics Readout Row -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; border-top: 1px solid var(--border-subtle); padding-top: 24px;">
                        <div>
                            <span style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); line-height: 1;">60+</span>
                            <span style="display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase;">Target FPS</span>
                        </div>
                        <div>
                            <span style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); line-height: 1;">&lt; 16.6 ms</span>
                            <span style="display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase;">Sub-step Frame Latency</span>
                        </div>
                        <div>
                            <span style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); line-height: 1;">5K – 100K</span>
                            <span style="display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase;">Particle Stress Tiers</span>
                        </div>
                        <div>
                            <span style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); line-height: 1;">100% GPU</span>
                            <span style="display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase;">Workgroup Compute</span>
                        </div>
                    </div>
                </div>

                <!-- ================================================================= -->
                <!-- 6. FINAL EDITORIAL CTA: The Lab is Open -->
                <!-- ================================================================= -->
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 20px; border-top: 1px solid var(--border-subtle); padding-top: 56px; padding-bottom: 24px;">
                    <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;">
                        05 // The Laboratory
                    </span>
                    <h2 style="font-size: 36px; font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary);">
                        The lab is open.
                    </h2>
                    <p style="font-size: 16px; color: var(--text-secondary); max-width: 600px; line-height: 1.6;">
                        Build an experiment, modify physical parameters, change the environment, and observe what happens in real time.
                    </p>
                    <button class="btn btn-primary" id="btn-final-enter-lab" style="padding: 14px 32px; font-size: 14px; margin-top: 8px;">
                        Enter the Laboratory →
                    </button>
                </div>

            </div>
        `;

        // Event listeners
        const openLab = () => store.setPage("laboratory");
        const openMaterials = () => store.setPage("materials");
        const openCompare = () => store.setPage("comparison");
        const openExperiments = () => store.setPage("experiments");
        const openBenchmark = () => store.setPage("benchmarks");

        this.el.querySelector("#btn-hero-lab")?.addEventListener("click", openLab);
        this.el.querySelector("#btn-quick-enter-lab")?.addEventListener("click", openLab);
        this.el.querySelector("#btn-final-enter-lab")?.addEventListener("click", openLab);
        this.el.querySelector("#btn-hero-materials")?.addEventListener("click", openMaterials);
        this.el.querySelector("#btn-view-all-mats")?.addEventListener("click", openMaterials);
        this.el.querySelector("#btn-goto-compare")?.addEventListener("click", openCompare);
        this.el.querySelector("#btn-goto-experiments")?.addEventListener("click", openExperiments);
        this.el.querySelector("#btn-goto-benchmark")?.addEventListener("click", openBenchmark);

        this.el.querySelectorAll(".simulate-mat-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id && MATERIAL_PRESETS[id]) {
                    store.setMaterial(MATERIAL_PRESETS[id]);
                    this.engine.setMaterial(MATERIAL_PRESETS[id]);
                    openLab();
                }
            });
        });
    }
}
