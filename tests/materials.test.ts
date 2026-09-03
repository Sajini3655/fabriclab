import { test, describe } from "node:test";
import assert from "node:assert";
import { MATERIAL_PRESETS, DEFAULT_MATERIAL } from "../src/simulation/materials/MaterialPresets";

describe("Material Presets System", () => {
    test("Default material is defined and valid", () => {
        assert.ok(DEFAULT_MATERIAL);
        assert.strictEqual(DEFAULT_MATERIAL.id, "silk");
    });

    test("All required material presets exist with physical bounds", () => {
        const expectedIds = ["silk", "cotton", "denim", "linen", "leather", "rubber", "wool", "canvas"];
        expectedIds.forEach(id => {
            const mat = MATERIAL_PRESETS[id];
            assert.ok(mat, `Material preset ${id} should exist`);
            assert.ok(mat.density > 0, "Density must be positive");
            assert.ok(mat.stretchCompliance >= 0, "Stretch compliance must be non-negative");
            assert.ok(mat.bendCompliance >= 0, "Bend compliance must be non-negative");
            assert.ok(mat.damping >= 0 && mat.damping <= 1, "Damping must be between 0 and 1");
            assert.ok(mat.friction >= 0 && mat.friction <= 1, "Friction must be between 0 and 1");
            assert.strictEqual(mat.color.length, 3, "Color must be 3-component RGB");
            mat.color.forEach(c => assert.ok(c >= 0 && c <= 1, "Color channels must be in [0, 1]"));
        });
    });

    test("Rigid materials have higher bend compliance than fluid materials", () => {
        const silk = MATERIAL_PRESETS.silk;
        const leather = MATERIAL_PRESETS.leather;
        assert.ok(leather.bendCompliance > silk.bendCompliance, "Leather should have higher bending resistance than silk");
    });
});
