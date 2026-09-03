import vertShaderCode from "./shaders/vert.wgsl";
import fragShaderCode from "./shaders/frag.wgsl";

import { Camera } from "./camera";
import { Geometry } from "./geometry";
import { Triangles } from "./triangles";
import { MaterialProperty } from "./types/material";
import { ViewMode } from "./types/simulation";

const cameraLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "camera",
    entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" as const },
    }],
};

const renderParamsLayoutDesc: GPUBindGroupLayoutDescriptor = {
    label: "render-params",
    entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: { type: "uniform" as const },
    }],
};

interface RenderObject {
    id: string;
    geometry: Geometry;
    wireframe: boolean;
}

export class Renderer {
    private readonly device: GPUDevice;
    private readonly context: GPUCanvasContext;
    private depthTextureView: GPUTextureView;
    private readonly objectStates: Record<string, RenderObjectState>;

    private readonly renderParamsBuffer: GPUBuffer;
    private readonly renderParamsBindGroup: GPUBindGroup;

    constructor(device: GPUDevice, canvas: HTMLCanvasElement) {
        this.device = device;
        this.objectStates = {};
        this.context = canvas.getContext("webgpu") as unknown as GPUCanvasContext;
        this.context.configure({
            device: this.device,
            format: "bgra8unorm",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            alphaMode: "opaque"
        });

        this.depthTextureView = this.createDepthTexture(canvas.width, canvas.height);

        // 8 floats * 4 = 32 bytes (materialColor: vec3, roughness: f32, lightDir: vec3, viewMode: f32)
        this.renderParamsBuffer = this.device.createBuffer({
            label: "render-params",
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.renderParamsBindGroup = this.device.createBindGroup({
            label: "render-params",
            layout: this.device.createBindGroupLayout(renderParamsLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: this.renderParamsBuffer } },
            ],
        });

        this.updateRenderParams([0.35, 0.78, 0.85], 0.3, [0.5, 1.0, 0.8], "shaded");
    }

    private createDepthTexture(width: number, height: number): GPUTextureView {
        const depthTextureDesc: GPUTextureDescriptor = {
            label: "depth texture",
            size: [Math.max(1, width), Math.max(1, height), 1],
            dimension: "2d",
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };
        const depthTexture = this.device.createTexture(depthTextureDesc);
        return depthTexture.createView();
    }

    public resize(width: number, height: number): void {
        this.depthTextureView = this.createDepthTexture(width, height);
    }

    public updateRenderParams(
        color: [number, number, number],
        roughness: number,
        lightDir: [number, number, number] = [0.5, 1.0, 0.8],
        viewMode: ViewMode = "shaded"
    ): void {
        let modeVal = 0.0;
        if (viewMode === "normal") modeVal = 1.0;
        if (viewMode === "wireframe") modeVal = 2.0;
        if (viewMode === "stress") modeVal = 3.0;

        const data = new Float32Array([
            color[0], color[1], color[2],
            roughness,
            lightDir[0], lightDir[1], lightDir[2],
            modeVal
        ]);

        this.device.queue.writeBuffer(
            this.renderParamsBuffer, 0,
            data, 0,
            data.length
        );
    }

    public render(encoder: GPUCommandEncoder, object: RenderObject, camera: Camera): void {
        let state = this.objectStates[object.id];
        if (!state || state.wireframe !== object.wireframe) {
            state = new RenderObjectState(this.device, object, camera);
            this.objectStates[object.id] = state;
        }

        const colorTexture = this.context.getCurrentTexture();
        const colorTextureView = colorTexture.createView({
            label: "color texture"
        });

        let colorAttachment: GPURenderPassColorAttachment = {
            view: colorTextureView,
            loadOp: "clear",
            clearValue: { r: 0.04, g: 0.05, b: 0.07, a: 1.0 }, // Premium dark laboratory background
            storeOp: "store",
        };

        const depthAttachment: GPURenderPassDepthStencilAttachment = {
            view: this.depthTextureView,
            depthClearValue: 1,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            stencilClearValue: 0,
            stencilLoadOp: "clear",
            stencilStoreOp: "store",
        };

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: depthAttachment
        };

        const passEncoder = encoder.beginRenderPass(renderPassDesc);
        const { width, height } = this.context.canvas as HTMLCanvasElement;

        passEncoder.setPipeline(state.pipeline);
        passEncoder.setViewport(0, 0, width, height, 0, 1);
        passEncoder.setScissorRect(0, 0, width, height);
        passEncoder.setVertexBuffer(0, object.geometry.vertices.positionBuffer);
        passEncoder.setVertexBuffer(1, object.geometry.vertices.normalBuffer);
        passEncoder.setIndexBuffer(state.indexBuffer, "uint32");
        passEncoder.setBindGroup(0, state.cameraBindGroup);
        passEncoder.setBindGroup(1, this.renderParamsBindGroup);
        passEncoder.drawIndexed(state.indexCount);
        passEncoder.end();
    }
}

class RenderObjectState {
    public pipeline: GPURenderPipeline;
    public cameraBindGroup: GPUBindGroup;
    public indexBuffer: GPUBuffer;
    public indexCount: number;
    public wireframe: boolean;

    constructor(device: GPUDevice, object: RenderObject, camera: Camera) {
        const vertModule = device.createShaderModule({ code: vertShaderCode });
        const fragModule = device.createShaderModule({ code: fragShaderCode });

        this.wireframe = object.wireframe;
        this.indexBuffer = object.geometry.triangles.indexBuffer;
        this.indexCount = object.geometry.triangles.count * 3;

        this.cameraBindGroup = device.createBindGroup({
            layout: device.createBindGroupLayout(cameraLayoutDesc),
            entries: [
                { binding: 0, resource: { buffer: camera.buffer } },
            ],
        });

        let topology: GPUPrimitiveTopology = "triangle-list";

        if (this.wireframe) {
            topology = "line-list";
            const indices = buildWireframeIndices(object.geometry.triangles);
            this.indexCount = indices.length;
            this.indexBuffer = device.createBuffer({
                label: "index",
                size: fourBytesAlignment(indices.byteLength),
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            device.queue.writeBuffer(
                this.indexBuffer, 0,
                indices, 0,
                indices.length
            );
        }

        this.pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    device.createBindGroupLayout(cameraLayoutDesc),
                    device.createBindGroupLayout(renderParamsLayoutDesc),
                ],
            }),
            vertex: {
                module: vertModule,
                entryPoint: "main",
                buffers: [
                    {
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: "float32x3" as const },
                        ],
                        arrayStride: 4 * 4,
                        stepMode: "vertex" as const
                    },
                    {
                        attributes: [
                            { shaderLocation: 1, offset: 0, format: "sint32x3" as const },
                        ],
                        arrayStride: 4 * 4,
                        stepMode: "vertex" as const
                    },
                ],
            },
            fragment: {
                module: fragModule,
                entryPoint: "main",
                targets: [
                    {
                        format: "bgra8unorm",
                        blend: {
                            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
                            alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }
                        }
                    },
                ],
            },
            primitive: {
                cullMode: "none",
                topology: topology,
            },
            depthStencil: {
                format: "depth24plus-stencil8",
                depthWriteEnabled: true,
                depthCompare: "less",
            },
        });
    }
}

function fourBytesAlignment(size: number): number {
    return (size + 3) & ~3;
}

function buildWireframeIndices(triangles: Triangles): Uint32Array {
    const topology = triangles.extractTopology();
    const indices = new Uint32Array(topology.edges.length * 2);

    for (let i = 0; i < topology.edges.length; i++) {
        indices[2 * i] = topology.edges[i][0];
        indices[2 * i + 1] = topology.edges[i][1];
    }

    return indices;
}
