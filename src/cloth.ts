import { v4 as uuid } from "uuid";
import * as vec3 from "./math/vector3";
import { VertexRef } from "./vertices";
import { Particles, ParticleRef } from "./physic/particles";
import { Pair, TriangleRef } from "./triangles";
import { Constraints } from "./physic/constraints";
import { Geometry } from "./geometry";
import { MaterialProperty } from "./types/material";

export interface ClothConfig {
    unit?: number;
    density: number;
    stretchCompliance: number;
    bendCompliance: number;
    pinTopEdge?: boolean;
    pinCornersOnly?: boolean;
}

export class Cloth {
    public id: string;
    public geometry: Geometry;
    public particles: Particles;
    public constraints: Constraints;
    public defaultInverseMasses: Float32Array;
    public wireframe: boolean;

    private readonly config: ClothConfig;
    private readonly device: GPUDevice;

    constructor(device: GPUDevice, geometry: Geometry, config: ClothConfig) {
        this.id = uuid();
        this.config = {
            unit: 0.01,
            pinTopEdge: true,
            pinCornersOnly: false,
            ...config
        };
        this.device = device;
        this.geometry = geometry;
        this.wireframe = false;

        this.initParticles();
        this.cacheDefaultMasses();
        this.initConstraints();
    }

    public get uploadNeeded(): boolean {
        return this.geometry.vertices.uploadNeeded
            || this.geometry.triangles.uploadNeeded
            || this.particles.uploadNeeded
            || this.constraints.uploadNeeded;
    }

    public destroy(): void {
        try {
            this.geometry?.destroy();
            this.particles?.destroy();
            this.constraints?.destroy();
        } catch (e) {}
    }

    public getDefaultInverseMass(i: number): number {
        return (this.defaultInverseMasses && this.defaultInverseMasses[i] !== undefined)
            ? this.defaultInverseMasses[i]
            : (1.0 / (0.01 * 0.2));
    }

    private cacheDefaultMasses(): void {
        this.defaultInverseMasses = new Float32Array(this.particles.count);
        for (let i = 0; i < this.particles.count; i++) {
            this.defaultInverseMasses[i] = this.particles.get(i).inverseMass;
        }
    }

    public upload(): void {
        if (this.geometry.vertices.uploadNeeded) this.geometry.vertices.upload();
        if (this.geometry.triangles.uploadNeeded) this.geometry.triangles.upload();
        if (this.particles.uploadNeeded) this.particles.upload();
        if (this.constraints.uploadNeeded) this.constraints.upload();
    }

    private initParticles(): void {
        this.particles = new Particles(this.device, this.geometry.vertices.count);

        this.geometry.vertices.forEach((vertex: VertexRef) => this.particles.add({
            position: vertex.position,
            velocity: vec3.zero(),
            estimatedPosition: vec3.zero(),
            inverseMass: 0.0,
        }));

        const unit = this.config.unit || 0.01;

        // Compute particles mass from triangle area
        this.geometry.triangles.forEach((triangle: TriangleRef) => {
            const pa = this.particles.get(triangle.a);
            const pb = this.particles.get(triangle.b);
            const pc = this.particles.get(triangle.c);

            const papb = vec3.sub(pb.position, pa.position);
            const papc = vec3.sub(pc.position, pa.position);

            const area = 0.5 * vec3.length(vec3.crossMut(papb, papc));
            const edgeInverseMass = 1 / (unit * area * this.config.density) / 3;

            pa.inverseMass += edgeInverseMass;
            pb.inverseMass += edgeInverseMass;
            pc.inverseMass += edgeInverseMass;
        });

        // Find bounds for corner pinning
        let minX = Infinity, maxX = -Infinity, minZ = Infinity;
        this.particles.forEach((p: ParticleRef) => {
            if (p.position.x < minX) minX = p.position.x;
            if (p.position.x > maxX) maxX = p.position.x;
            if (p.position.z < minZ) minZ = p.position.z;
        });

        this.particles.forEach((particle: ParticleRef): void => {
            const isTop = Math.abs(particle.position.z - minZ) < 0.001;
            const isLeft = Math.abs(particle.position.x - minX) < 0.001;
            const isRight = Math.abs(particle.position.x - maxX) < 0.001;

            if (this.config.pinCornersOnly) {
                if (isTop && (isLeft || isRight)) {
                    particle.inverseMass = 0.0;
                }
            } else if (this.config.pinTopEdge !== false) {
                if (isTop) {
                    particle.inverseMass = 0.0;
                }
            }
        });
    }

    private initConstraints(): void {
        const topology = this.geometry.triangles.extractTopology();
        const constraintsCount = topology.edges.length + topology.adjacentTriangles.length;
        this.constraints = new Constraints(this.device, constraintsCount);

        topology.edges.forEach(([start, end]: Pair<number>) => {
            this.constraints.add(
                this.particles.get(start),
                this.particles.get(end),
                this.config.stretchCompliance
            );
        });

        topology.adjacentTriangles.forEach(([a, b]: Pair<number>) => {
            const ta = this.geometry.triangles.get(a).toArray();
            const tb = this.geometry.triangles.get(b).toArray();

            const [start] = ta.filter(vertex => !tb.includes(vertex));
            const [end] = tb.filter(vertex => !ta.includes(vertex));

            if (start !== undefined && end !== undefined) {
                this.constraints.add(
                    this.particles.get(start),
                    this.particles.get(end),
                    this.config.bendCompliance
                );
            }
        });
    }
}
