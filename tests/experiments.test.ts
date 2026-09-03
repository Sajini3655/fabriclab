import { test, describe } from "node:test";
import assert from "node:assert";
import { ExperimentService } from "../src/services/ExperimentService";
import { MATERIAL_PRESETS } from "../src/simulation/materials/MaterialPresets";

describe("Experiment Store & Persistence", () => {
    test("Default experiments are loaded when localStorage is empty", () => {
        const exps = ExperimentService.getAll();
        assert.ok(Array.isArray(exps));
        assert.ok(exps.length >= 3, "Should provide curated presets");
    });

    test("Experiment serialization produces valid JSON", () => {
        const json = ExperimentService.exportJSON();
        assert.ok(typeof json === "string");
        const parsed = JSON.parse(json);
        assert.ok(Array.isArray(parsed));
    });
});
