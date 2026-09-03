import * as vec3 from "../../math/vector3";
import { Vector3 } from "../../math/vector3";
import * as mat4 from "../../math/matrix4";
import { Cloth } from "../../cloth";
import { Camera } from "../../camera";

export interface Ray {
    origin: Vector3;
    direction: Vector3;
}

export class Raycaster {
    private grabbedParticleId: number | null = null;
    private hoveredParticleId: number | null = null;
    private originalInverseMass: number = 0;
    private grabDepth: number = 0;
    private device: GPUDevice;

    constructor(device: GPUDevice) {
        this.device = device;
    }

    public get isGrabbing(): boolean {
        return this.grabbedParticleId !== null;
    }

    public get activeGrabbedId(): number | null {
        return this.grabbedParticleId;
    }

    public get hoveredId(): number | null {
        return this.hoveredParticleId;
    }

    public createRayFromScreen(
        screenX: number,
        screenY: number,
        canvasWidth: number,
        canvasHeight: number,
        camera: Camera
    ): Ray {
        const ndcX = (screenX / canvasWidth) * 2 - 1;
        const ndcY = 1 - (screenY / canvasHeight) * 2;

        const viewMatrix = camera.getViewMatrix();
        const projMatrix = camera.getProjectionMatrix();

        const viewProj = mat4.mul(projMatrix, viewMatrix);
        const invViewProj = mat4.inverse(viewProj);

        const nearVec = mat4.transformVec4(invViewProj, [ndcX, ndcY, 0.0, 1.0]);
        const near = vec3.create(
            nearVec[0] / nearVec[3],
            nearVec[1] / nearVec[3],
            nearVec[2] / nearVec[3]
        );

        const farVec = mat4.transformVec4(invViewProj, [ndcX, ndcY, 1.0, 1.0]);
        const far = vec3.create(
            farVec[0] / farVec[3],
            farVec[1] / farVec[3],
            farVec[2] / farVec[3]
        );

        const dir = vec3.normalize(vec3.sub(far, near));
        return { origin: near, direction: dir };
    }

    public findNearestParticle(ray: Ray, cloth: Cloth, maxDist: number = 2.5): number | null {
        let bestId: number | null = null;
        let bestDist = maxDist;

        for (let i = 0; i < cloth.particles.count; i++) {
            const p = cloth.particles.get(i);
            const pos = p.position;

            const v = vec3.sub(pos, ray.origin);
            const t = vec3.dot(v, ray.direction);
            if (t <= 0) continue;

            const projPoint = vec3.add(ray.origin, vec3.multiplyByScalar(ray.direction, t));
            const dist = vec3.distance(pos, projPoint);

            if (dist < bestDist) {
                bestDist = dist;
                bestId = i;
            }
        }
        this.hoveredParticleId = bestId;
        return bestId;
    }

    public startGrab(ray: Ray, cloth: Cloth, maxDistance: number = 2.5): boolean {
        let bestId: number | null = null;
        let bestDist = maxDistance;
        let bestDepth = 0;

        for (let i = 0; i < cloth.particles.count; i++) {
            const p = cloth.particles.get(i);
            const pos = p.position;

            const v = vec3.sub(pos, ray.origin);
            const t = vec3.dot(v, ray.direction);

            if (t <= 0) continue;

            const projPoint = vec3.add(ray.origin, vec3.multiplyByScalar(ray.direction, t));
            const dist = vec3.distance(pos, projPoint);

            if (dist < bestDist) {
                bestDist = dist;
                bestId = i;
                bestDepth = t;
            }
        }

        if (bestId !== null) {
            this.grabbedParticleId = bestId;
            const p = cloth.particles.get(bestId);
            this.originalInverseMass = p.inverseMass;
            this.grabDepth = bestDepth;
            p.inverseMass = 0.0;
            return true;
        }

        return false;
    }

    public updateGrab(ray: Ray, cloth: Cloth): void {
        if (this.grabbedParticleId === null) return;

        const targetPos = vec3.add(ray.origin, vec3.multiplyByScalar(ray.direction, this.grabDepth));
        const p = cloth.particles.get(this.grabbedParticleId);
        p.position = targetPos;
        p.estimatedPosition = targetPos;
        p.velocity = vec3.zero();

        const posData = new Float32Array([targetPos.x, targetPos.y, targetPos.z, 0]);
        this.device.queue.writeBuffer(
            cloth.geometry.vertices.positionBuffer,
            this.grabbedParticleId * 4 * 4,
            posData,
            0,
            4
        );
        this.device.queue.writeBuffer(
            cloth.particles.estimatedPositionBuffer,
            this.grabbedParticleId * 4 * 4,
            posData,
            0,
            4
        );
    }

    public endGrab(cloth: Cloth): void {
        if (this.grabbedParticleId !== null) {
            const p = cloth.particles.get(this.grabbedParticleId);
            p.inverseMass = this.originalInverseMass;
            const invMassData = new Float32Array([this.originalInverseMass]);
            this.device.queue.writeBuffer(
                cloth.particles.inverseMassBuffer,
                this.grabbedParticleId * 4,
                invMassData,
                0,
                1
            );
            this.grabbedParticleId = null;
        }
    }

    public togglePin(ray: Ray, cloth: Cloth): boolean {
        const id = this.findNearestParticle(ray, cloth);
        if (id === null) return false;

        const p = cloth.particles.get(id);
        if (p.inverseMass === 0.0) {
            p.inverseMass = cloth.getDefaultInverseMass(id);
        } else {
            p.inverseMass = 0.0;
        }

        const invMassData = new Float32Array([p.inverseMass]);
        this.device.queue.writeBuffer(
            cloth.particles.inverseMassBuffer,
            id * 4,
            invMassData,
            0,
            1
        );
        return true;
    }

    public clearAllPins(cloth: Cloth): void {
        for (let i = 0; i < cloth.particles.count; i++) {
            const p = cloth.particles.get(i);
            if (p.inverseMass === 0.0) {
                p.inverseMass = cloth.getDefaultInverseMass(i);
            }
        }
        cloth.particles.upload();
    }

    public getPinnedCount(cloth: Cloth): number {
        let count = 0;
        for (let i = 0; i < cloth.particles.count; i++) {
            if (cloth.particles.get(i).inverseMass === 0.0) count++;
        }
        return count;
    }
}
