import { store } from "../../state/Store";

const ONBOARDING_KEY = "fabriclab_onboarding_completed_v1";

export class OnboardingTour {
    private el: HTMLElement;
    private step: number = 0;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "onboarding-card";
        this.el.style.display = "none";
        this.render();

        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
            setTimeout(() => this.show(), 1000);
        }
    }

    public getElement(): HTMLElement {
        return this.el;
    }

    public show(): void {
        this.step = 0;
        this.updateStep();
        this.el.style.display = "flex";
    }

    public dismiss(): void {
        this.el.style.display = "none";
        localStorage.setItem(ONBOARDING_KEY, "true");
    }

    private updateStep(): void {
        const steps = [
            {
                title: "Welcome to FabricLab",
                body: "Explore realistic fabric physics running on native WebGPU compute pipelines with Extended Position-Based Dynamics (XPBD).",
                btn: "Next: Interaction →"
            },
            {
                title: "Direct 3D Cloth Manipulation",
                body: "Click '✋ Grab Cloth' in the top bar to pull, drag, and stretch virtual fabric vertices in 3D world space.",
                btn: "Next: Materials →"
            },
            {
                title: "Physical Material Presets",
                body: "Select between 8 textiles (Silk, Denim, Leather, Rubber) in the left panel to instantly alter compliance and mass.",
                btn: "Next: Environment →"
            },
            {
                title: "Forces, Wind & Colliders",
                body: "Open the Env tab to toggle aerodynamic wind shears, custom gravity, and rigid sphere colliders.",
                btn: "Start Experimenting 🔬"
            }
        ];

        const s = steps[this.step];
        const titleEl = this.el.querySelector("#onboard-title");
        const bodyEl = this.el.querySelector("#onboard-body");
        const nextBtn = this.el.querySelector("#btn-onboard-next");
        const stepNum = this.el.querySelector("#onboard-step-num");

        if (titleEl) titleEl.textContent = s.title;
        if (bodyEl) bodyEl.textContent = s.body;
        if (nextBtn) nextBtn.textContent = s.btn;
        if (stepNum) stepNum.textContent = `Step ${this.step + 1} of ${steps.length}`;
    }

    private render(): void {
        this.el.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span id="onboard-step-num" style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 600;">Step 1 of 4</span>
                <button id="btn-onboard-skip" style="background: transparent; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer;">Skip Tour ✕</button>
            </div>
            <h4 id="onboard-title" style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">Welcome to FabricLab</h4>
            <p id="onboard-body" style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; margin-top: 4px;"></p>
            <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                <button class="btn btn-primary btn-sm" id="btn-onboard-next">Next →</button>
            </div>
        `;

        this.el.querySelector("#btn-onboard-skip")?.addEventListener("click", () => this.dismiss());
        this.el.querySelector("#btn-onboard-next")?.addEventListener("click", () => {
            this.step++;
            if (this.step >= 4) {
                this.dismiss();
            } else {
                this.updateStep();
            }
        });
    }
}
