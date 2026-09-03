import * as vec3 from "../../math/vector3";
import { Cloth } from "../../cloth";
import { Camera } from "../../camera";
import { Renderer } from "../../renderer";
import { Solver } from "../../physic/solver";
import { buildPlaneGeometry } from "../../geometry";
import { Raycaster } from "./Raycaster";
import { MaterialProperty } from "../../types/material";
import { EnvironmentConfig } from "../../types/environment";
import { SimulationConfig, SimulationMetrics, ViewMode, InteractionMode } from "../../types/simulation";
import { DEFAULT_MATERIAL } from "../materials/MaterialPresets";

export class SimulationEngine {
    public canvas: HTMLCanvasElement;
    public device: GPUDevice;
    public camera: Camera;
    public renderer: Renderer;
    public solver: Solver;
    public cloth: Cloth;
    public raycaster: Raycaster;

    public material: MaterialProperty = DEFAULT_MATERIAL;
    public environment: EnvironmentConfig;
    public config: SimulationConfig;

    private running: boolean = false;
    private stepRequested: boolean = false;
    private onMetricsCb?: (metrics: SimulationMetrics) => void;

    private lastFrameTimestamp: number = 0;
    private frameCount: number = 0;
    private fpsAccumulator: number = 0;
    private currentFps: number = 60;
    private currentFrameTimeMs: number = 16.6;
    private currentComputeTimeMs: number = 2.0;

    constructor(
        canvas: HTMLCanvasElement,
        device: GPUDevice,
        initialMaterial: MaterialProperty = DEFAULT_MATERIAL
    ) {
        this.canvas = canvas;
        this.device = device;
        this.material = initialMaterial;

        this.environment = {
            gravityPreset: "earth",
            gravity: [0, -9.81, 0],
            windEnabled: false,
            windSpeed: 8,
            windDirectionDeg: 45,
            windElevationDeg: 0,
            windTurbulence: 0.2,
            enableSphereCollider: false,
            sphereRadius: 2.2,
            spherePosition: [0, -3.8, 0],
            enableGroundPlane: false,
            groundY: -7.5,
        };

        this.config = {
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
        };

        this.camera = new Camera(device, canvas, {
            width: canvas.width,
            height: canvas.height,
            distance: 7.8,
            rotationX: 18,
            rotationY: 0,
        });

        this.renderer = new Renderer(device, canvas);
        this.raycaster = new Raycaster(device);

        this.solver = new Solver(device, this.buildSolverConfig());
        this.cloth = this.buildClothMesh();

        this.initPointerInteractions();
        this.updateRendererStyle();
    }

    private buildSolverConfig() {
        const windRad = (this.environment.windDirectionDeg * Math.PI) / 180;
        const elevRad = (this.environment.windElevationDeg * Math.PI) / 180;

        let windVec = vec3.create(0, 0, 0);
        if (this.environment.windEnabled) {
            const speed = this.environment.windSpeed;
            windVec = vec3.create(
                Math.sin(windRad) * Math.cos(elevRad) * speed,
                Math.sin(elevRad) * speed,
                Math.cos(windRad) * Math.cos(elevRad) * speed
            );
        }

        return {
            deltaTime: this.config.deltaTime * this.config.speedMultiplier,
            subSteps: this.config.subSteps,
            gravity: vec3.create(
                this.environment.gravity[0],
                this.environment.gravity[1],
                this.environment.gravity[2]
            ),
            wind: windVec,
            damping: this.material.damping,
            friction: this.material.friction,
            sphereCenter: vec3.create(
                this.environment.spherePosition[0],
                this.environment.spherePosition[1],
                this.environment.spherePosition[2]
            ),
            sphereRadius: this.environment.enableSphereCollider ? this.environment.sphereRadius : 0,
            groundY: this.environment.groundY,
            enableGround: this.environment.enableGroundPlane,
        };
    }

    private buildClothMesh(): Cloth {
        const geometry = buildPlaneGeometry(
            this.device,
            this.config.width,
            this.config.height,
            this.config.widthDivisions,
            this.config.heightDivisions
        );

        if (this.cloth) {
            const oldCloth = this.cloth;
            this.solver.disposeObject(oldCloth.id);
            oldCloth.destroy();
        }

        const cloth = new Cloth(this.device, geometry, {
            unit: 0.01,
            density: this.material.density,
            stretchCompliance: this.material.stretchCompliance,
            bendCompliance: this.material.bendCompliance,
            pinTopEdge: this.config.pinTopEdge,
            pinCornersOnly: this.config.pinCornersOnly,
        });

        cloth.wireframe = this.config.viewMode === "wireframe";
        return cloth;
    }

    private updateRendererStyle(): void {
        this.renderer.updateRenderParams(
            this.material.color,
            this.material.roughness,
            [0.5, 1.0, 0.8],
            this.config.viewMode
        );
        this.cloth.wireframe = this.config.viewMode === "wireframe";
    }

    public setMaterial(material: MaterialProperty): void {
        this.material = material;
        this.solver.updateConfig({
            damping: material.damping,
            friction: material.friction,
        });

        // Rebuild cloth to recalculate node mass and compliance buffers
        this.cloth = this.buildClothMesh();
        this.updateRendererStyle();
    }

    public setEnvironment(env: Partial<EnvironmentConfig>): void {
        this.environment = { ...this.environment, ...env };
        this.solver.updateConfig(this.buildSolverConfig());
    }

    public setPhysics(physics: Partial<SimulationConfig>): void {
        const needsMeshRebuild = (
            (physics.widthDivisions !== undefined && physics.widthDivisions !== this.config.widthDivisions) ||
            (physics.heightDivisions !== undefined && physics.heightDivisions !== this.config.heightDivisions) ||
            (physics.pinTopEdge !== undefined && physics.pinTopEdge !== this.config.pinTopEdge) ||
            (physics.pinCornersOnly !== undefined && physics.pinCornersOnly !== this.config.pinCornersOnly)
        );

        this.config = { ...this.config, ...physics };
        this.solver.updateConfig(this.buildSolverConfig());

        if (needsMeshRebuild) {
            this.cloth = this.buildClothMesh();
        }
        this.updateRendererStyle();
    }

    public setViewMode(mode: ViewMode): void {
        this.config.viewMode = mode;
        this.updateRendererStyle();
    }

    public setInteractionMode(mode: InteractionMode): void {
        this.config.interactionMode = mode;
        this.camera.controlsEnabled = mode === "orbit";
        this.canvas.style.cursor = mode === "grab" ? "grab" : mode === "anchor" ? "crosshair" : "default";
    }

    public setPaused(paused: boolean): void {
        this.config.paused = paused;
    }

    public togglePaused(): boolean {
        this.config.paused = !this.config.paused;
        return this.config.paused;
    }

    public step(): void {
        this.stepRequested = true;
    }

    public resetSimulation(): void {
        this.cloth = this.buildClothMesh();
        this.updateRendererStyle();
    }

    public setCameraPreset(preset: string): void {
        this.camera.setPreset(preset);
    }

    public captureScreenshotPNG(): string {
        return this.canvas.toDataURL("image/png");
    }

    public togglePinAtScreen(screenX: number, screenY: number): boolean {
        const ray = this.raycaster.createRayFromScreen(
            screenX, screenY,
            this.canvas.width,
            this.canvas.height,
            this.camera
        );
        return this.raycaster.togglePin(ray, this.cloth);
    }

    public clearAllPins(): void {
        this.raycaster.clearAllPins(this.cloth);
    }

    public getPinnedCount(): number {
        return this.raycaster.getPinnedCount(this.cloth);
    }

    public resetCamera(): void {
        this.camera.reset();
    }

    public setSpeedMultiplier(speed: number): void {
        this.config.speedMultiplier = speed;
        this.solver.updateConfig(this.buildSolverConfig());
    }

    public resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.camera.resize(width, height);
        this.renderer.resize(width, height);
    }

    public onMetrics(cb: (metrics: SimulationMetrics) => void): void {
        this.onMetricsCb = cb;
    }

    private initPointerInteractions(): void {
        let isPointerDown = false;

        this.canvas.addEventListener("pointerdown", (e) => {
            if (this.config.interactionMode === "anchor" && e.button === 0) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.togglePinAtScreen(x, y);
                return;
            }
            if (this.config.interactionMode === "grab" && e.button === 0) {
                this.canvas.style.cursor = "grabbing";
                isPointerDown = true;
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ray = this.raycaster.createRayFromScreen(
                    x, y,
                    this.canvas.width,
                    this.canvas.height,
                    this.camera
                );

                this.raycaster.startGrab(ray, this.cloth);
            }
        });

        window.addEventListener("pointermove", (e) => {
            if (isPointerDown && this.raycaster.isGrabbing) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ray = this.raycaster.createRayFromScreen(
                    x, y,
                    this.canvas.width,
                    this.canvas.height,
                    this.camera
                );

                this.raycaster.updateGrab(ray, this.cloth);
            }
        });

        window.addEventListener("pointerup", () => {
            if (isPointerDown) {
                isPointerDown = false;
                this.raycaster.endGrab(this.cloth);
                if (this.config.interactionMode === "grab") this.canvas.style.cursor = "grab";
            }
        });
    }

    public async run(): Promise<void> {
        this.running = true;
        this.lastFrameTimestamp = performance.now();

        const loop = async () => {
            if (!this.running) return;

            const now = performance.now();
            const deltaMs = now - this.lastFrameTimestamp;
            this.lastFrameTimestamp = now;

            this.fpsAccumulator += deltaMs;
            this.frameCount++;
            if (this.fpsAccumulator >= 250) {
                this.currentFps = Math.round((this.frameCount * 1000) / this.fpsAccumulator);
                this.currentFrameTimeMs = Number((this.fpsAccumulator / this.frameCount).toFixed(2));
                this.frameCount = 0;
                this.fpsAccumulator = 0;
            }

            if (this.cloth.uploadNeeded) {
                this.cloth.upload();
            }

            const encoder = this.device.createCommandEncoder();
            const computeStart = performance.now();

            const shouldSimulate = !this.config.paused || this.stepRequested;
            if (shouldSimulate) {
                this.solver.solve(encoder, this.cloth);
                this.stepRequested = false;
            }

            this.renderer.render(encoder, this.cloth, this.camera);
            this.device.queue.submit([encoder.finish()]);

            this.currentComputeTimeMs = Number((performance.now() - computeStart).toFixed(2));

            if (this.onMetricsCb && this.frameCount % 2 === 0) {
                this.onMetricsCb({
                    fps: this.currentFps,
                    frameTimeMs: this.currentFrameTimeMs,
                    computeTimeMs: this.currentComputeTimeMs,
                    particleCount: this.cloth.particles.count,
                    triangleCount: this.cloth.geometry.triangles.count,
                    constraintCount: this.cloth.constraints.count,
                    colorCount: this.cloth.constraints.colorCount,
                    subSteps: this.config.subSteps,
                    webgpuStatus: "ready",
                    adapterVendor: "WebGPU Active",
                    adapterArchitecture: "GPU Compute",
                });
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    public stop(): void {
        this.running = false;
    }
}
