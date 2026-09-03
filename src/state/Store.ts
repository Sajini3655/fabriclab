import { MaterialProperty } from "../types/material";
import { SimulationConfig, SimulationMetrics } from "../types/simulation";
import { EnvironmentConfig } from "../types/environment";
import { DEFAULT_MATERIAL, MATERIAL_PRESETS } from "../simulation/materials/MaterialPresets";

export type PageId = "landing" | "laboratory" | "materials" | "benchmarks" | "experiments" | "comparison" | "about";

type Listener<T> = (data: T) => void;

class Store {
    public activePage: PageId = "landing";
    public material: MaterialProperty = DEFAULT_MATERIAL;
    public comparisonMaterialA: MaterialProperty = MATERIAL_PRESETS.silk;
    public comparisonMaterialB: MaterialProperty = MATERIAL_PRESETS.denim;

    public simulation: SimulationConfig = {
        subSteps: 10,
        deltaTime: 0.016,
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
    };

    public environment: EnvironmentConfig = {
        gravity: [0, -9.81, 0],
        gravityPreset: "earth",
        windEnabled: false,
        windSpeed: 8,
        windDirectionDeg: 45,
        windTurbulence: 0.2,
        enableGroundPlane: false,
        groundHeight: -7.5,
        enableSphereCollider: false,
        sphereCenter: [0, 0, 0],
        sphereRadius: 2.2,
    };

    private listeners: Map<string, Set<Listener<any>>> = new Map();
    private emittingEvents: Set<string> = new Set();

    public subscribe<T>(event: string, listener: Listener<T>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        return () => this.listeners.get(event)?.delete(listener);
    }

    public emit<T>(event: string, data: T): void {
        const set = this.listeners.get(event);
        if (set) {
            if (this.emittingEvents.has(event)) {
                return;
            }
            this.emittingEvents.add(event);
            try {
                set.forEach((fn) => {
                    try {
                        fn(data);
                    } catch (err) {
                        console.error("Store listener error:", err);
                    }
                });
            } finally {
                this.emittingEvents.delete(event);
            }
        }
    }

    public setPage(page: PageId | string): void {
        const target = (page === "compare" ? "comparison" : page) as PageId;
        this.activePage = target;
        this.emit("page", target);
    }

    public setMaterial(mat: MaterialProperty): void {
        this.material = mat;
        this.emit("material", mat);
    }

    public setSimulation(partial: Partial<SimulationConfig>): void {
        this.simulation = { ...this.simulation, ...partial };
        this.emit("simulation", this.simulation);
    }

    public setEnvironment(partial: Partial<EnvironmentConfig>): void {
        this.environment = { ...this.environment, ...partial };
        this.emit("environment", this.environment);
    }

    public setMetrics(metrics: SimulationMetrics): void {
        this.emit("metrics", metrics);
    }
}

export const store = new Store();
