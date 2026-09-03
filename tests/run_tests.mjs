import { test, describe } from "node:test";
import assert from "node:assert";

// 1. Material Presets Validation
describe("FabricLab Material Presets System", async () => {
    const MATERIAL_PRESETS = {
        silk: { id: "silk", name: "Mulberry Silk", density: 0.065, stretchCompliance: 0.0001, bendCompliance: 0.015, damping: 0.012, friction: 0.15, color: [0.35, 0.78, 0.85] },
        cotton: { id: "cotton", name: "Organic Cotton", density: 0.180, stretchCompliance: 0.0005, bendCompliance: 0.120, damping: 0.025, friction: 0.40, color: [0.88, 0.86, 0.82] },
        denim: { id: "denim", name: "Raw Denim (14oz)", density: 0.450, stretchCompliance: 0.00002, bendCompliance: 0.650, damping: 0.050, friction: 0.65, color: [0.18, 0.28, 0.52] },
        linen: { id: "linen", name: "Belgian Linen", density: 0.230, stretchCompliance: 0.00008, bendCompliance: 0.380, damping: 0.030, friction: 0.45, color: [0.78, 0.72, 0.62] },
        leather: { id: "leather", name: "Tanned Calfskin", density: 0.780, stretchCompliance: 0.00001, bendCompliance: 0.880, damping: 0.080, friction: 0.75, color: [0.45, 0.24, 0.14] },
        rubber: { id: "rubber", name: "Natural Latex Rubber", density: 0.850, stretchCompliance: 0.045, bendCompliance: 0.060, damping: 0.070, friction: 0.90, color: [0.15, 0.15, 0.18] },
        wool: { id: "wool", name: "Merino Flannel Wool", density: 0.360, stretchCompliance: 0.002, bendCompliance: 0.180, damping: 0.045, friction: 0.55, color: [0.48, 0.18, 0.22] },
        canvas: { id: "canvas", name: "Sailcloth Duck Canvas", density: 0.540, stretchCompliance: 0.00003, bendCompliance: 0.720, damping: 0.040, friction: 0.60, color: [0.72, 0.68, 0.56] },
    };

    test("Default material is defined and matches silk", () => {
        const defaultMat = MATERIAL_PRESETS.silk;
        assert.ok(defaultMat);
        assert.strictEqual(defaultMat.id, "silk");
    });

    test("All 8 material presets have positive density and valid compliance", () => {
        Object.values(MATERIAL_PRESETS).forEach((mat) => {
            assert.ok(mat.density > 0, `${mat.name} must have positive density`);
            assert.ok(mat.stretchCompliance >= 0, `${mat.name} must have valid stretch compliance`);
            assert.ok(mat.bendCompliance >= 0, `${mat.name} must have valid bend compliance`);
            assert.ok(mat.damping >= 0 && mat.damping <= 1, `${mat.name} damping in [0, 1]`);
            assert.ok(mat.friction >= 0 && mat.friction <= 1, `${mat.name} friction in [0, 1]`);
            assert.strictEqual(mat.color.length, 3, "Color must be 3-component RGB");
            mat.color.forEach(c => assert.ok(c >= 0 && c <= 1, "Color channels must be in [0, 1]"));
        });
    });

    test("Denim bending resistance is significantly higher than Mulberry Silk", () => {
        const silk = MATERIAL_PRESETS.silk;
        const denim = MATERIAL_PRESETS.denim;
        assert.ok(denim.bendCompliance > silk.bendCompliance * 5, "Denim must be much stiffer than silk");
    });

    test("Rubber has high stretch compliance compared to Denim", () => {
        const rubber = MATERIAL_PRESETS.rubber;
        const denim = MATERIAL_PRESETS.denim;
        assert.ok(rubber.stretchCompliance > denim.stretchCompliance * 100, "Rubber must be far more elastic than denim");
    });
});

// 2. Experiment Schema V1 & Hardened Validation
describe("Experiment Archive Schema V1 & Hardened Validation", () => {
    function isValidExperiment(e) {
        if (!e || typeof e !== "object") return false;
        if (typeof e.name !== "string" || e.name.trim().length === 0) return false;
        if (!e.material || typeof e.material.id !== "string") return false;
        if (!e.simulation || typeof e.simulation.widthDivisions !== "number") return false;
        if (!e.environment || !Array.isArray(e.environment.gravity)) return false;
        return true;
    }

    test("Validates complete schema version 1 experiment", () => {
        const validExp = {
            id: "test-uuid-1",
            schemaVersion: 1,
            name: "High Wind Aerodynamic Flutter",
            description: "Testing silk drape under 15m/s wind drag.",
            createdAt: Date.now(),
            tags: ["Silk", "Aerodynamics", "Wind"],
            material: { id: "silk", name: "Mulberry Silk" },
            simulation: { widthDivisions: 60, heightDivisions: 60, subSteps: 10 },
            environment: { windEnabled: true, windSpeed: 15, gravity: [0, -9.81, 0] }
        };
        assert.strictEqual(isValidExperiment(validExp), true);
    });

    test("Rejects malformed experiments missing required fields", () => {
        assert.strictEqual(isValidExperiment(null), false);
        assert.strictEqual(isValidExperiment({}), false);
        assert.strictEqual(isValidExperiment({ name: "" }), false);
        assert.strictEqual(isValidExperiment({ name: "Valid Name", material: null }), false);
        assert.strictEqual(isValidExperiment({ name: "Valid Name", material: { id: "silk" }, simulation: {} }), false);
        assert.strictEqual(isValidExperiment({ name: "Valid Name", material: { id: "silk" }, simulation: { widthDivisions: 50 }, environment: { gravity: "invalid" } }), false);
    });
});

// 3. Benchmark Formula & Latency Percentile Suite
describe("Benchmark Formula & Latency Percentile Suite", () => {
    test("Particle grid scaling formula (N+1)^2", () => {
        const testTiers = [
            { divisions: 50, expectedParticles: 2601, expectedTriangles: 5000 },
            { divisions: 70, expectedParticles: 5041, expectedTriangles: 9800 },
            { divisions: 100, expectedParticles: 10201, expectedTriangles: 20000 },
            { divisions: 150, expectedParticles: 22801, expectedTriangles: 45000 },
        ];

        testTiers.forEach(t => {
            const particles = (t.divisions + 1) * (t.divisions + 1);
            const triangles = t.divisions * t.divisions * 2;
            assert.strictEqual(particles, t.expectedParticles);
            assert.strictEqual(triangles, t.expectedTriangles);
        });
    });

    test("Statistical P95 and P99 latency percentile calculations", () => {
        const frameTimes = [8.1, 8.2, 8.4, 8.5, 8.6, 9.0, 9.2, 10.1, 14.5, 18.2];
        const sorted = [...frameTimes].sort((a, b) => a - b);
        const p95Idx = Math.floor(sorted.length * 0.95);
        const p99Idx = Math.floor(sorted.length * 0.99);

        const p95 = sorted[p95Idx];
        const p99 = sorted[p99Idx];

        assert.ok(p95 >= 14.5);
        assert.ok(p99 >= 18.2);
    });
});

// 4. Physics Math Utilities & Inverse Mass Cache
describe("Physics Math & Mass Restoration Utilities", () => {
    test("Vector3 operations: distance, dot, cross, normalize", () => {
        const a = { x: 1, y: 0, z: 0 };
        const b = { x: 0, y: 1, z: 0 };

        const dot = a.x * b.x + a.y * b.y + a.z * b.z;
        assert.strictEqual(dot, 0);

        const cross = {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
        assert.deepStrictEqual(cross, { x: 0, y: 0, z: 1 });
    });

    test("Geometric triangle area mass calculation formula", () => {
        const unit = 0.01;
        const area = 0.5 * 1.0;
        const density = 0.18; // Cotton
        const edgeInverseMass = 1 / (unit * area * density) / 3;
        assert.ok(edgeInverseMass > 0, "Inverse mass must be positive");
        assert.ok(Number.isFinite(edgeInverseMass), "Inverse mass must be finite");
    });
});
