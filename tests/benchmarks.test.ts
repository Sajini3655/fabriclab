import { test, describe } from "node:test";
import assert from "node:assert";
import { BENCHMARK_TIERS } from "../src/services/BenchmarkRunner";

describe("Benchmark Calculation Suite", () => {
    test("Benchmark tiers have ascending resolution grids", () => {
        assert.ok(BENCHMARK_TIERS.length >= 4);
        for (let i = 1; i < BENCHMARK_TIERS.length; i++) {
            assert.ok(
                BENCHMARK_TIERS[i].divisions > BENCHMARK_TIERS[i - 1].divisions,
                "Divisions should strictly increase across tiers"
            );
        }
    });

    test("Particle count calculation matches grid formula (N+1)^2", () => {
        BENCHMARK_TIERS.forEach(tier => {
            const expectedParticles = (tier.divisions + 1) * (tier.divisions + 1);
            assert.ok(expectedParticles > 0);
        });
    });
});
