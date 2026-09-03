import * as vec3 from "./math/vector3";
import * as mat4 from "./math/matrix4";
import { Matrix4 } from "./math/matrix4";
import * as scalar from "./math/scalar";

export interface CameraConfig {
    fovy?: number;
    far?: number;
    near?: number;
    width: number;
    height: number;
    zoomSpeed?: number;
    distance?: number;
    rotationX?: number;
    rotationY?: number;
}

const f32Size = 4;

export class Camera {
    public buffer: GPUBuffer;
    public controlsEnabled: boolean = true;

    private readonly config: Required<CameraConfig>;
    private readonly device: GPUDevice;

    private zoom: number;
    private dragging: boolean;
    private rotateX: number;
    private rotateY: number;
    private x: number;
    private y: number;
    private lastX: number;
    private lastY: number;
    private readonly limitX: number;

    private projectionMatrix: Matrix4 = mat4.identity();
    private viewMatrix: Matrix4 = mat4.identity();

    constructor(device: GPUDevice, canvas: HTMLCanvasElement, config?: CameraConfig) {
        this.device = device;
        this.config = {
            fovy: Math.PI / 4,
            near: 0.01,
            far: 1000,
            zoomSpeed: 2,
            distance: 12,
            rotationX: 20,
            rotationY: 0,
            width: canvas.width || 1000,
            height: canvas.height || 600,
            ...config
        };

        this.zoom = 0;
        this.dragging = false;
        this.rotateX = this.config.rotationX;
        this.rotateY = this.config.rotationY;
        this.x = 0.0;
        this.y = 0.0;
        this.lastX = 0.0;
        this.lastY = 0.0;
        this.limitX = 85.0;

        this.buffer = device.createBuffer({
            size: 2 * f32Size * 4 * 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        canvas.addEventListener("mousedown", (e) => {
            if (!this.controlsEnabled || e.button !== 0) return;
            this.dragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        window.addEventListener("mouseup", () => {
            this.dragging = false;
        });

        canvas.addEventListener("wheel", (e) => {
            if (!this.controlsEnabled) return;
            this.onMouseWheel(e.deltaY);
        }, { passive: true });

        window.addEventListener("mousemove", (e) => {
            if (!this.controlsEnabled || !this.dragging) return;
            this.drag(e.clientX, e.clientY);
        });

        this.updateUniform();
    }

    public setPreset(preset: string): void {
        if (preset === "front") {
            this.rotateX = 0;
            this.rotateY = 0;
            this.zoom = 0;
        } else if (preset === "side") {
            this.rotateX = 0;
            this.rotateY = 90;
            this.zoom = 0;
        } else if (preset === "top") {
            this.rotateX = 85;
            this.rotateY = 0;
            this.zoom = 2;
        } else if (preset === "close") {
            this.rotateX = 15;
            this.rotateY = 25;
            this.zoom = 8;
        } else {
            // perspective default
            this.rotateX = this.config.rotationX;
            this.rotateY = this.config.rotationY;
            this.zoom = 0;
        }
        this.updateUniform();
    }

    public reset(): void {
        this.zoom = 0;
        this.rotateX = this.config.rotationX;
        this.rotateY = this.config.rotationY;
        this.updateUniform();
    }

    public resize(width: number, height: number): void {
        this.config.width = width;
        this.config.height = height;
        this.updateUniform();
    }

    public getProjectionMatrix(): Matrix4 {
        return this.projectionMatrix;
    }

    public getViewMatrix(): Matrix4 {
        return this.viewMatrix;
    }

    private onMouseWheel(y: number): void {
        this.zoom += y < 0 ? -1 : 1;
        if (this.zoom < -15) this.zoom = -15;
        if (this.zoom > 25) this.zoom = 25;
        this.updateUniform();
    }

    private drag(x: number, y: number): void {
        const degreesPerPixelX = 90.0 / this.config.height;
        const degreesPerPixelY = 180.0 / this.config.width;

        let rotateX = this.rotateX + degreesPerPixelX * (y - this.lastY);
        let rotateY = this.rotateY + degreesPerPixelY * (x - this.lastX);

        if (rotateX < -this.limitX) rotateX = -this.limitX;
        if (rotateX > this.limitX) rotateX = this.limitX;

        this.lastX = x;
        this.lastY = y;

        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.updateUniform();
    }

    private updateUniform(): void {
        this.projectionMatrix = mat4.perspective(
            this.config.fovy,
            this.config.near,
            this.config.far,
            this.config.width / this.config.height
        );

        const z = -Math.pow(0.95, -this.zoom) * this.config.zoomSpeed * this.config.distance;
        const position = vec3.create(0, -3.0, z);

        const rotation = vec3.create(
            scalar.degToRad(this.rotateX),
            scalar.degToRad(this.rotateY),
            0.0
        );

        this.viewMatrix = mat4.mul(mat4.translation(position), mat4.rotation(rotation));

        const data = new Float32Array(2 * 4 * 4);
        data.set(this.projectionMatrix, 0);
        data.set(this.viewMatrix, 4 * 4);

        this.device.queue.writeBuffer(this.buffer, 0, data, 0, data.length);
    }
}
