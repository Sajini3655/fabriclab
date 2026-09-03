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
                    <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-primary); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">05 / Publication</span>
                    <h1 class="page-title" style="margin-top: 4px;">About FabricLab</h1>
                    <p class="page-subtitle">Computational physics, WebGPU compute shaders, and scientific foundations.</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 48px; max-width: 920px;">
                <!-- Section 01 -->
                <section style="display: flex; flex-direction: column; gap: 12px;">
                    <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">01 — THE LABORATORY</span>
                    <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Digital Materiality & Simulation</h2>
                    <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7;">
                        FabricLab is an interactive physics and material visualization instrument built on native WebGPU compute pipelines. It enables direct real-time experimentation with compliant elastic constraints, dihedral bending resistance, aerodynamic wind shears, and rigid body collisions.
                    </p>
                </section>

                <!-- Section 02 -->
                <section style="display: flex; flex-direction: column; gap: 12px;">
                    <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">02 — THE SIMULATION</span>
                    <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Extended Position-Based Dynamics (XPBD)</h2>
                    <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7;">
                        Unlike standard PBD where stiffness depends on time-step and iteration counts, XPBD introduces time-step independent elastic compliance (α = 1/k), directly deriving constraint projections from implicit Euler energy potentials.
                    </p>
                </section>

                <!-- Section 03 -->
                <section style="display: flex; flex-direction: column; gap: 12px;">
                    <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); font-weight: 600;">03 — ATTRIBUTION & CITATIONS</span>
                    <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Open Source Foundations</h2>
                    <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7;">
                        FabricLab builds upon an open-source WebGPU XPBD cloth simulation foundation authored by <strong>Harold Ozouf</strong> (<a href="https://github.com/jspdown/cloth" target="_blank" style="color: var(--accent-primary); text-decoration: none; border-bottom: 1px solid var(--accent-primary);">jspdown/cloth</a>), licensed under the MIT License.
                    </p>
                    <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-top: 6px;">
                        Academic References:<br/>
                        • Macklin et al. — <em>Position-Based Simulation of Compliant Constrained Dynamics</em> (SIGGRAPH 2016)<br/>
                        • Macklin et al. — <em>Small Steps in Physics Simulation</em> (SCA 2019)
                    </p>
                </section>
            </div>
        `;
    }
}
