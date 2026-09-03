struct SolverConfig {
    gravity: vec3<f32>,
    deltaTime: f32,
    wind: vec3<f32>,
    damping: f32,
    sphereCenter: vec3<f32>,
    sphereRadius: f32,
    groundY: f32,
    enableGround: f32,
    pinMode: f32,
    friction: f32,
};

@group(0) @binding(0) var<storage, read> positions: array<vec3<f32>>;
@group(0) @binding(1) var<storage, read_write> estimatedPositions: array<vec3<f32>>;
@group(0) @binding(2) var<storage, read_write> velocities: array<vec3<f32>>;
@group(0) @binding(3) var<storage, read> inverseMasses: array<f32>;

@group(1) @binding(0) var<uniform> solverConfig: SolverConfig;

@compute @workgroup_size(16, 16)
fn main(@builtin(num_workgroups) workgroup_size: vec3<u32>, @builtin(global_invocation_id) global_id: vec3<u32>) {
    let w = workgroup_size.x * 16u;
    let h = workgroup_size.y * 16u;

    let id = global_id.x
        + (global_id.y * w)
        + (global_id.z * w * h);

    if (id >= arrayLength(&positions)) {
        return;
    }

    if (inverseMasses[id] > 0.0) {
        // Damping
        velocities[id] = velocities[id] * (1.0 - clamp(solverConfig.damping, 0.0, 0.99));

        // Gravity
        velocities[id] += solverConfig.gravity * solverConfig.deltaTime;

        // Aerodynamic Wind force with dynamic turbulent flutter
        if (length(solverConfig.wind) > 0.001) {
            let relativeWind = solverConfig.wind - velocities[id];
            let phase = f32(id % 43u) * 0.35 + positions[id].x * 1.5 + positions[id].y * 1.2;
            let flutter = sin(phase) * 0.45;
            let drag = 4.2 + flutter;
            let windForce = relativeWind * drag;
            velocities[id] += windForce * solverConfig.deltaTime;
        }

        var nextPos = positions[id] + velocities[id] * solverConfig.deltaTime;

        // Sphere collider
        if (solverConfig.sphereRadius > 0.0) {
            let dVec = nextPos - solverConfig.sphereCenter;
            let d = length(dVec);
            let minDist = solverConfig.sphereRadius + 0.08;
            if (d < minDist && d > 0.0001) {
                let norm = dVec / d;
                nextPos = solverConfig.sphereCenter + norm * minDist;
                velocities[id] = velocities[id] * (1.0 - clamp(solverConfig.friction, 0.0, 1.0));
            }
        }

        // Ground plane
        if (solverConfig.enableGround > 0.5) {
            if (nextPos.y < solverConfig.groundY) {
                nextPos.y = solverConfig.groundY;
                velocities[id].y = 0.0;
                velocities[id].x *= (1.0 - clamp(solverConfig.friction, 0.0, 1.0));
                velocities[id].z *= (1.0 - clamp(solverConfig.friction, 0.0, 1.0));
            }
        }

        estimatedPositions[id] = nextPos;
    } else {
        estimatedPositions[id] = positions[id];
        velocities[id] = vec3<f32>(0.0, 0.0, 0.0);
    }
}
