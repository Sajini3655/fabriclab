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
                    <h1 class="page-title">About FabricLab & Technical Architecture</h1>
                    <p class="page-subtitle">Next-generation WebGPU interactive material science laboratory powered by Extended Position-Based Dynamics (XPBD).</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 24px; max-width: 900px; line-height: 1.6; font-size: 13px; color: var(--text-secondary);">
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
                    <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Executive Summary</h2>
                    <p><strong>FabricLab</strong> is a real-time 3D physics and material simulation platform built with WebGPU. It enables engineering-grade virtual experimentation on physical textiles, elastomeric membranes, and structural fabrics with zero CPU-GPU transfer bottlenecks during simulation.</p>
                </div>

                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
                    <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Physics Engine: Extended Position-Based Dynamics (XPBD)</h2>
                    <p>Traditional mass-spring systems suffer from severe stiffness instability and time-step dependency. FabricLab executes compliant constraint dynamics directly on GPU compute pipelines using small-step sub-stepping.</p>
                    
                    <ul style="margin-left: 20px; margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
                        <li><strong>Semi-Explicit Euler Pass</strong>: Computes velocity updates and estimates predicted particle positions under gravitational, damping, and aerodynamic wind drag vectors.</li>
                        <li><strong>XPBD Constraint Projection</strong>: Evaluates distance and dihedral bend constraints using Lagrange multipliers.</li>
                        <li><strong>Parallel Gauss-Seidel Graph Coloring</strong>: Partitions non-adjacent constraint edges into discrete color batches, preventing atomic write races on shared vertex storage buffers across parallel GPU workgroups.</li>
                        <li><strong>Atomic Surface Normals</strong>: Dynamically computes cross-product triangle face normals in compute passes, accumulating normal vectors atomically for real-time PBR lighting.</li>
                    </ul>
                </div>

                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; border-left: 3px solid var(--accent-blue);">
                    <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Open-Source Foundation & Research Attribution</h2>
                    <p>FabricLab is built upon the open-source WebGPU XPBD cloth simulation foundation authored by <strong>Harold Ozouf (<a href="https://github.com/jspdown/cloth" target="_blank" style="color: var(--accent-blue);">jspdown/cloth</a>)</strong>, licensed under the MIT License.</p>
                    
                    <p style="margin-top: 10px;">The underlying physics simulation algorithms implement research published in:</p>
                    <ul style="margin-left: 20px; margin-top: 6px;">
                        <li><em>Position-Based Simulation of Compliant Constrained Dynamics (2016)</em> — Miles Macklin, Matthias Müller, Nuttapong Chentanez.</li>
                        <li><em>Small Steps in Physics Simulation (2019)</em> — Miles Macklin, Kier Storey, Michelle Lu, Pierre Terdiman, Stefan Jeschke, Matthias Müller.</li>
                    </ul>

                    <p style="margin-top: 10px;">FabricLab expands this core engine into a portfolio-grade product platform, adding the material science presets system, aerodynamic wind and collision systems, 3D mouse raycasting & vertex grabbing, automated multi-tier benchmarking suite, persistent experiment laboratory archive, dual material comparison mode, and decoupled high-performance UI architecture.</p>
                </div>
            </div>
        `;
    }
}
