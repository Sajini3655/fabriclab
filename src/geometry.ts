import { Vertices } from "./vertices";
import { Triangles } from "./triangles";

export class Geometry {
    public vertices: Vertices;
    public triangles: Triangles;

    constructor(vertices: Vertices, triangles: Triangles) {
        this.vertices = vertices;
        this.triangles = triangles;
    }

    public destroy(): void {
        try {
            this.vertices?.destroy();
            this.triangles?.destroy();
        } catch (e) {}
    }
}

export function buildPlaneGeometry(
    device: GPUDevice,
    width: number,
    height: number,
    widthDivisions: number,
    heightDivisions: number
): Geometry {
    const verticesCount = (widthDivisions + 1) * (heightDivisions + 1);
    const trianglesCount = widthDivisions * heightDivisions * 2;

    const vertices = new Vertices(device, verticesCount);
    const triangles = new Triangles(device, trianglesCount);

    const stepX = width / widthDivisions;
    const stepZ = height / heightDivisions;

    const startX = -width / 2;
    const startZ = -height / 2;

    for (let z = 0; z <= heightDivisions; z++) {
        for (let x = 0; x <= widthDivisions; x++) {
            vertices.add({
                position: {
                    x: startX + x * stepX,
                    y: 0,
                    z: startZ + z * stepZ,
                },
                normal: { x: 0, y: 1, z: 0 },
            });
        }
    }

    const rowVertices = widthDivisions + 1;
    for (let z = 0; z < heightDivisions; z++) {
        for (let x = 0; x < widthDivisions; x++) {
            const i0 = z * rowVertices + x;
            const i1 = i0 + 1;
            const i2 = (z + 1) * rowVertices + x;
            const i3 = i2 + 1;

            triangles.add(i0, i2, i1);
            triangles.add(i1, i2, i3);
        }
    }

    return new Geometry(vertices, triangles);
}
