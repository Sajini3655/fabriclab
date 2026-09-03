import semiExplicitEulerComputeShaderCode from "./shaders/semi_explicit_euler.compute.wgsl";
import applyConstraintComputeShaderCode from "./shaders/apply_constraint.compute.wgsl";
import updatePositionComputeShaderCode from "./shaders/update_position.compute.wgsl";
import updateNormalComputeShaderCode from "./shaders/update_normal.compute.wgsl";

import * as vec3 from "../math/vector3";
import { Vector3 } from "../math/vector3";
import { Particles } from "./particles";
import { Constraints } from "./constraints";
import { Geometry } from "../geometry";

const semiExplicitEulerLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "semi-explicit-euler",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
    ],
};

const applyConstraintLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "apply-constraint",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
    ],
};

const updatePositionLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "update-position",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
    ],
};

const updateNormalLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "update-normal",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
    ],
};

const currentColorLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "current-color",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform", hasDynamicOffset: true } },
    ],
};

const configLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "config",
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
    ],
};

export interface SolverConfig {
    deltaTime?: number;
    subSteps?: number;
    gravity?: Vector3;
    wind?: Vector3;
    damping?: number;
    friction?: number;
    relaxation?: number;
    sphereCenter?: Vector3;
    sphereRadius?: number;
    groundY?: number;
    enableGround?: boolean;
}

interface PhysicObject {
    id: string;
    geometry: Geometry;
    particles: Particles;
    constraints: Constraints;
}

export class Solver {
    public config: Required<SolverConfig>;

    private readonly device: GPUDevice;
    private readonly objectStates: Record<string, PhysicObjectState>;

    private readonly configBuffer: GPUBuffer;
    private readonly configBindGroup: GPUBindGroup;

    private readonly applyConstraintPipeline: GPUComputePipeline;
    private readonly semiExplicitEulerPipeline: GPUComputePipeline;
    private readonly updatePositionPipeline: GPUComputePipeline;
    private readonly updateNormalPipeline: GPUComputePipeline;

    constructor(device: GPUDevice, config?: SolverConfig) {
        this.device = device;
        this.objectStates = {};
        this.config = {
            deltaTime: 1 / 60,
            subSteps: 10,
            gravity: vec3.create(0, -9.81, 0),
            wind: vec3.create(0, 0, 0),
            damping: 0.02,
            friction: 0.3,
            relaxation: 1,
            sphereCenter: vec3.create(0, -4.0, 0),
            sphereRadius: 0,
            groundY: -8.0,
            enableGround: false,
            ...config,
        };

        this.configBuffer = this.device.createBuffer({
            label: "solver-config",
            size: 64, // 16 floats * 4 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.configBindGroup = this.device.createBindGroup({
            label: "config",
            layout: device.createBindGroupLayout(configLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: this.configBuffer } },
            ],
        });

        this.writeConfigBuffer();

        const applyConstraintShaderModule = device.createShaderModule({ code: applyConstraintComputeShaderCode });
        const semiExplicitEulerShaderModule = device.createShaderModule({ code: semiExplicitEulerComputeShaderCode });
        const updatePositionShaderModule = device.createShaderModule({ code: updatePositionComputeShaderCode });
        const updateNormalShaderModule = device.createShaderModule({ code: updateNormalComputeShaderCode });

        this.semiExplicitEulerPipeline = device.createComputePipeline({
            label: "semi-explicit-euler",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout(semiExplicitEulerLayoutDesc),
                    device.createBindGroupLayout(configLayoutDesc),
                ],
            }),
            compute: {
                module: semiExplicitEulerShaderModule,
                entryPoint: "main",
            },
        });

        this.applyConstraintPipeline = device.createComputePipeline({
            label: "apply-constraint",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout(applyConstraintLayoutDesc),
                    device.createBindGroupLayout(configLayoutDesc),
                    device.createBindGroupLayout(currentColorLayoutDesc),
                ],
            }),
            compute: {
                module: applyConstraintShaderModule,
                entryPoint: "main",
            },
        });

        this.updatePositionPipeline = device.createComputePipeline({
            label: "update-position",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout(updatePositionLayoutDesc),
                    device.createBindGroupLayout(configLayoutDesc),
                ],
            }),
            compute: {
                module: updatePositionShaderModule,
                entryPoint: "main",
            },
        });

        this.updateNormalPipeline = device.createComputePipeline({
            label: "update-normal",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout(updateNormalLayoutDesc),
                ],
            }),
            compute: {
                module: updateNormalShaderModule,
                entryPoint: "main",
            },
        });
    }

    public disposeObject(id: string): void {
        if (this.objectStates[id]) {
            delete this.objectStates[id];
        }
    }

    public updateConfig(newConfig: Partial<SolverConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.writeConfigBuffer();
    }

    private writeConfigBuffer(): void {
        const subDt = this.config.deltaTime / Math.max(1, this.config.subSteps);
        const configData = new Float32Array([
            this.config.gravity.x, this.config.gravity.y, this.config.gravity.z,
            subDt,
            this.config.wind.x, this.config.wind.y, this.config.wind.z,
            this.config.damping,
            this.config.sphereCenter.x, this.config.sphereCenter.y, this.config.sphereCenter.z,
            this.config.sphereRadius,
            this.config.groundY,
            this.config.enableGround ? 1.0 : 0.0,
            0.0, // reserved
            this.config.friction,
        ]);

        this.device.queue.writeBuffer(
            this.configBuffer, 0,
            configData, 0,
            configData.length
        );
    }

    public solve(encoder: GPUCommandEncoder, object: PhysicObject): void {
        let state = this.objectStates[object.id];
        if (!state) {
            state = new PhysicObjectState(this.device, object);
            this.objectStates[object.id] = state;
        }

        encoder.clearBuffer(object.geometry.vertices.normalBuffer);

        const passEncoder = encoder.beginComputePass();
        passEncoder.setBindGroup(1, this.configBindGroup);

        for (let subStep = 0; subStep < this.config.subSteps; subStep++) {
            this.semiExplicitEuler(passEncoder, object, state);
            this.applyConstraints(passEncoder, object, state);
            this.updatePositions(passEncoder, object, state);
        }

        this.updateNormals(passEncoder, object, state);
        passEncoder.end();
    }

    private semiExplicitEuler(encoder: GPUComputePassEncoder, object: PhysicObject, state: PhysicObjectState) {
        encoder.setPipeline(this.semiExplicitEulerPipeline);
        encoder.setBindGroup(0, state.semiExplicitEulerBindGroup);

        const dispatch = Math.sqrt(object.particles.count);
        const dispatchX = Math.ceil(dispatch / 16);
        const dispatchY = Math.ceil(dispatch / 16);

        encoder.dispatchWorkgroups(dispatchX, dispatchY);
    }

    private applyConstraints(encoder: GPUComputePassEncoder, object: PhysicObject, state: PhysicObjectState) {
        encoder.setPipeline(this.applyConstraintPipeline);
        encoder.setBindGroup(0, state.applyConstraintBindGroup);
        encoder.setBindGroup(1, this.configBindGroup);

        for (let i = 0; i < object.constraints.colorCount; i++) {
            encoder.setBindGroup(2, state.currentColorBindGroup, [i * 256]);

            const dispatch = Math.sqrt(object.constraints.colors[i * 64 + 1]);
            const dispatchX = Math.ceil(dispatch / 16);
            const dispatchY = Math.ceil(dispatch / 16);

            encoder.dispatchWorkgroups(dispatchX, dispatchY);
        }
    }

    private updatePositions(encoder: GPUComputePassEncoder, object: PhysicObject, state: PhysicObjectState) {
        encoder.setPipeline(this.updatePositionPipeline);
        encoder.setBindGroup(0, state.updatePositionBindGroup);
        encoder.setBindGroup(1, this.configBindGroup);

        const dispatch = Math.sqrt(object.particles.count);
        const dispatchX = Math.ceil(dispatch / 16);
        const dispatchY = Math.ceil(dispatch / 16);

        encoder.dispatchWorkgroups(dispatchX, dispatchY);
    }

    private updateNormals(encoder: GPUComputePassEncoder, object: PhysicObject, state: PhysicObjectState) {
        encoder.setPipeline(this.updateNormalPipeline);
        encoder.setBindGroup(0, state.updateNormalBindGroup);

        const dispatch = Math.sqrt(object.geometry.triangles.count);
        const dispatchX = Math.ceil(dispatch / 16);
        const dispatchY = Math.ceil(dispatch / 16);

        encoder.dispatchWorkgroups(dispatchX, dispatchY);
    }
}

class PhysicObjectState {
    public semiExplicitEulerBindGroup: GPUBindGroup;
    public applyConstraintBindGroup: GPUBindGroup;
    public currentColorBindGroup: GPUBindGroup;
    public updatePositionBindGroup: GPUBindGroup;
    public updateNormalBindGroup: GPUBindGroup;

    constructor(device: GPUDevice, object: PhysicObject) {
        this.semiExplicitEulerBindGroup = device.createBindGroup({
            label: "semi-explicit-euler",
            layout: device.createBindGroupLayout(semiExplicitEulerLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: object.geometry.vertices.positionBuffer } },
                { binding: 1, resource: { buffer: object.particles.estimatedPositionBuffer } },
                { binding: 2, resource: { buffer: object.particles.velocityBuffer } },
                { binding: 3, resource: { buffer: object.particles.inverseMassBuffer } },
            ],
        });

        this.applyConstraintBindGroup = device.createBindGroup({
            label: "apply-constraint",
            layout: device.createBindGroupLayout(applyConstraintLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: object.particles.estimatedPositionBuffer } },
                { binding: 1, resource: { buffer: object.particles.inverseMassBuffer } },
                { binding: 2, resource: { buffer: object.constraints.restValueBuffer } },
                { binding: 3, resource: { buffer: object.constraints.complianceBuffer } },
                { binding: 4, resource: { buffer: object.constraints.affectedParticleBuffer } },
            ],
        });

        this.currentColorBindGroup = device.createBindGroup({
            label: "current-color",
            layout: device.createBindGroupLayout(currentColorLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: object.constraints.colorBuffer, size: 256 } },
            ],
        });

        this.updatePositionBindGroup = device.createBindGroup({
            label: "update-position",
            layout: device.createBindGroupLayout(updatePositionLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: object.geometry.vertices.positionBuffer } },
                { binding: 1, resource: { buffer: object.particles.estimatedPositionBuffer } },
                { binding: 2, resource: { buffer: object.particles.velocityBuffer } },
            ],
        });

        this.updateNormalBindGroup = device.createBindGroup({
            label: "update-normal",
            layout: device.createBindGroupLayout(updateNormalLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: object.geometry.vertices.positionBuffer } },
                { binding: 1, resource: { buffer: object.geometry.triangles.indexBuffer } },
                { binding: 2, resource: { buffer: object.geometry.vertices.normalBuffer } },
            ],
        });
    }
}
