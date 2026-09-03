export class AboutPage {
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
            <div class="page-header">
                <div>
                    <h1 class="page-title">Technical Specification & Architecture</h1>
                    <p class="page-subtitle">Computational principles, Extended Position-Based Dynamics (XPBD), and open-source foundations.</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 100%;">
                <!-- Chapter 01 -->
                <section style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">01 // THE COMPUTATIONAL INSTRUMENT</span>
                    <h2 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Interactive Physics & Material Science</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                        FabricLab is a browser-native 3D physics and material simulation workstation engineered with WebGPU compute pipelines. It enables real-time experimentation with compliant elastic constraints, dihedral bending, aerodynamic wind fields, and rigid body collisions.
                    </p>
                </section>

                <!-- Chapter 02 -->
                <section style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">02 // EXTENDED POSITION-BASED DYNAMICS (XPBD)</span>
                    <h2 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Compliant Constraint Formulation</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                        Standard PBD suffers from time-step and iteration-dependent stiffness artifacts. XPBD resolves this by introducing elastic compliance (α = 1/k), directly deriving constraint projections from implicit Euler energy potentials.
                    </p>
                    <div style="background: #080a0f; border: 1px solid var(--border-subtle); padding: 12px; font-family: var(--font-mono); font-size: 11px; color: var(--text-primary);">
                        Δλ = -C(x) / (w₁ + w₂ + α / Δt_sub²)
                    </div>
                </section>

                <!-- Chapter 03 -->
                <section style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan); font-weight: 700;">03 // OPEN-SOURCE FOUNDATION & ATTRIBUTION</span>
                    <h2 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Harold Ozouf (jspdown/cloth) & Research Literature</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                        FabricLab builds upon an open-source WebGPU XPBD cloth simulation foundation authored by <strong>Harold Ozouf</strong> (<a href="https://github.com/jspdown/cloth" target="_blank" style="color: var(--accent-cyan);">jspdown/cloth</a>), licensed under the <strong>MIT License</strong>.
                    </p>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                        Key Academic References:
                        <ul style="margin-left: 20px; margin-top: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">
                            <li>Macklin et al. — <em>Position-Based Simulation of Compliant Constrained Dynamics</em> (SIGGRAPH 2016)</li>
                            <li>Macklin et al. — <em>Small Steps in Physics Simulation</em> (SCA 2019)</li>
                        </ul>
                    </p>
                </section>
            </div>
        `;
    }
}
