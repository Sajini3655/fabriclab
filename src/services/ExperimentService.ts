import { Experiment } from "../types/experiment";
import { MATERIAL_PRESETS } from "../simulation/materials/MaterialPresets";

const STORAGE_KEY = "fabriclab_experiments_v1";

const DEFAULT_EXPERIMENTS: Experiment[] = [
    {
        id: "exp-silk-wind",
        name: "Mulberry Silk Fluid Wind Aerodynamics",
        description: "Study of hyper-flexible protein filament fabric subjected to 18 m/s turbulent wind shears.",
        tags: ["Silk", "Wind", "Fluidity"],
        createdAt: "2026-08-15T10:00:00.000Z",
        updatedAt: "2026-08-15T10:00:00.000Z",
        isPreset: true,
        material: MATERIAL_PRESETS.silk,
        simulation: {
            subSteps: 12,
            deltaTime: 1 / 60,
            relaxation: 1.0,
            width: 10,
            height: 10,
            widthDivisions: 70,
            heightDivisions: 70,
            speedMultiplier: 1.0,
            paused: false,
            viewMode: "shaded",
            interactionMode: "orbit",
            pinTopEdge: true,
            pinCornersOnly: false,
        },
        environment: {
            gravityPreset: "earth",
            gravity: [0, -9.81, 0],
            windEnabled: true,
            windSpeed: 18,
            windDirectionDeg: 55,
            windElevationDeg: 10,
            windTurbulence: 0.45,
            enableSphereCollider: false,
            sphereRadius: 2.2,
            spherePosition: [0, -3.8, 0],
            enableGroundPlane: false,
            groundY: -7.5,
        }
    },
    {
        id: "exp-denim-moon",
        name: "Heavy Raw Denim Lunar Gravity Dynamics",
        description: "Observation of 14oz twill weave structural rigidity under 1.62 m/s² lunar gravitational acceleration.",
        tags: ["Denim", "Moon", "Structural"],
        createdAt: "2026-08-20T14:30:00.000Z",
        updatedAt: "2026-08-20T14:30:00.000Z",
        isPreset: true,
        material: MATERIAL_PRESETS.denim,
        simulation: {
            subSteps: 10,
            deltaTime: 1 / 60,
            relaxation: 1.0,
            width: 10,
            height: 10,
            widthDivisions: 60,
            heightDivisions: 60,
            speedMultiplier: 1.0,
            paused: false,
            viewMode: "shaded",
            interactionMode: "orbit",
            pinTopEdge: true,
            pinCornersOnly: false,
        },
        environment: {
            gravityPreset: "moon",
            gravity: [0, -1.62, 0],
            windEnabled: false,
            windSpeed: 0,
            windDirectionDeg: 0,
            windElevationDeg: 0,
            windTurbulence: 0,
            enableSphereCollider: false,
            sphereRadius: 2.2,
            spherePosition: [0, -3.8, 0],
            enableGroundPlane: false,
            groundY: -7.5,
        }
    },
    {
        id: "exp-rubber-sphere",
        name: "Latex Elastomer Sphere Collision & Drape",
        description: "Isotropic rubber membrane draped over a 2.4m rigid collider sphere to evaluate friction and elongation.",
        tags: ["Rubber", "Collision", "Elastomer"],
        createdAt: "2026-08-28T09:15:00.000Z",
        updatedAt: "2026-08-28T09:15:00.000Z",
        isPreset: true,
        material: MATERIAL_PRESETS.rubber,
        simulation: {
            subSteps: 15,
            deltaTime: 1 / 60,
            relaxation: 1.0,
            width: 10,
            height: 10,
            widthDivisions: 65,
            heightDivisions: 65,
            speedMultiplier: 1.0,
            paused: false,
            viewMode: "shaded",
            interactionMode: "orbit",
            pinTopEdge: false,
            pinCornersOnly: false,
        },
        environment: {
            gravityPreset: "earth",
            gravity: [0, -9.81, 0],
            windEnabled: false,
            windSpeed: 0,
            windDirectionDeg: 0,
            windElevationDeg: 0,
            windTurbulence: 0,
            enableSphereCollider: true,
            sphereRadius: 2.4,
            spherePosition: [0, -3.5, 0],
            enableGroundPlane: true,
            groundY: -7.0,
        }
    },
    {
        id: "exp-leather-corners",
        name: "Calfskin Dual-Corner Anchor Tension",
        description: "Stiff full-grain leather pinned exclusively at two corner vertices, analyzing catenary sag and shear lines.",
        tags: ["Leather", "Pinning", "Tension"],
        createdAt: "2026-09-01T16:00:00.000Z",
        updatedAt: "2026-09-01T16:00:00.000Z",
        isPreset: true,
        material: MATERIAL_PRESETS.leather,
        simulation: {
            subSteps: 12,
            deltaTime: 1 / 60,
            relaxation: 1.0,
            width: 10,
            height: 10,
            widthDivisions: 55,
            heightDivisions: 55,
            speedMultiplier: 1.0,
            paused: false,
            viewMode: "shaded",
            interactionMode: "orbit",
            pinTopEdge: false,
            pinCornersOnly: true,
        },
        environment: {
            gravityPreset: "earth",
            gravity: [0, -9.81, 0],
            windEnabled: false,
            windSpeed: 0,
            windDirectionDeg: 0,
            windElevationDeg: 0,
            windTurbulence: 0,
            enableSphereCollider: false,
            sphereRadius: 2.2,
            spherePosition: [0, -3.8, 0],
            enableGroundPlane: false,
            groundY: -7.5,
        }
    }
];

export class ExperimentService {
    public static getAll(): Experiment[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EXPERIMENTS));
                return DEFAULT_EXPERIMENTS;
            }
            return JSON.parse(raw);
        } catch {
            return DEFAULT_EXPERIMENTS;
        }
    }

    public static save(experiment: Omit<Experiment, "id" | "createdAt" | "updatedAt"> & { id?: string }): Experiment {
        const experiments = this.getAll();
        const now = new Date().toISOString();

        if (experiment.id) {
            const index = experiments.findIndex(e => e.id === experiment.id);
            if (index !== -1) {
                const updated: Experiment = {
                    ...experiments[index],
                    ...experiment,
                    updatedAt: now,
                };
                experiments[index] = updated;
                this.persist(experiments);
                return updated;
            }
        }

        const newExp: Experiment = {
            ...experiment,
            id: "exp-" + Math.random().toString(36).substring(2, 9),
            createdAt: now,
            updatedAt: now,
        };

        experiments.unshift(newExp);
        this.persist(experiments);
        return newExp;
    }

    public static delete(id: string): boolean {
        let experiments = this.getAll();
        experiments = experiments.filter(e => e.id !== id);
        this.persist(experiments);
        return true;
    }

    public static duplicate(id: string): Experiment | null {
        const experiments = this.getAll();
        const target = experiments.find(e => e.id === id);
        if (!target) return null;

        const copy: Experiment = {
            ...target,
            id: "exp-" + Math.random().toString(36).substring(2, 9),
            name: target.name + " (Copy)",
            isPreset: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        experiments.unshift(copy);
        this.persist(experiments);
        return copy;
    }

    public static exportJSON(): string {
        return JSON.stringify(this.getAll(), null, 2);
    }

    
    private static isValidExperiment(e: any): boolean {
        if (!e || typeof e !== "object") return false;
        if (typeof e.name !== "string" || e.name.trim().length === 0) return false;
        if (!e.material || typeof e.material.id !== "string") return false;
        if (!e.simulation || typeof e.simulation.widthDivisions !== "number") return false;
        if (!e.environment || !Array.isArray(e.environment.gravity)) return false;
        return true;
    }

    public static importJSON(jsonStr: string): boolean {
        try {
            const parsed = JSON.parse(jsonStr);
            const candidates = Array.isArray(parsed) ? parsed : [parsed];
            const valid = candidates.filter(this.isValidExperiment).map(e => ({
                id: e.id || "exp-" + Math.random().toString(36).substring(2, 9),
                schemaVersion: 1,
                name: e.name.trim(),
                description: e.description || "Imported laboratory experiment.",
                tags: Array.isArray(e.tags) ? e.tags : ["Imported"],
                createdAt: e.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isPreset: false,
                material: e.material,
                simulation: e.simulation,
                environment: e.environment,
            }));

            if (valid.length > 0) {
                const current = this.getAll();
                const merged = [...valid, ...current.filter(c => !valid.some(v => v.id === c.id))];
                this.persist(merged);
                return true;
            }
        } catch (err) {
            console.error("Experiment import validation error:", err);
        }
        return false;
    }

    private static persist(experiments: Experiment[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
        } catch (e) {
            console.error("Failed to persist experiments to localStorage:", e);
        }
    }
}
