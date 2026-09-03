struct Output {
    @builtin(position) Position: vec4<f32>,
    @location(0) Normal: vec3<f32>,
    @location(1) WorldPos: vec3<f32>,
    @location(2) Stress: f32,
};

struct Camera {
    projection: mat4x4<f32>,
    view: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> camera: Camera;

@vertex
fn main(@location(0) position: vec3<f32>, @location(1) normal: vec3<i32>) -> Output {
    var output: Output;

    output.Normal = normalize(vec3<f32>(normal) / 10000.0);
    output.WorldPos = position;
    output.Position = camera.projection * camera.view * vec4<f32>(position, 1.0);

    // Approximate localized deformation / curvature stress from normal deviation and vertical sag
    let normalMag = length(vec3<f32>(normal) / 10000.0);
    let sagFactor = clamp(abs(position.y) * 0.12, 0.0, 1.0);
    output.Stress = clamp((1.0 - output.Normal.y) * 0.6 + sagFactor * 0.5, 0.0, 1.0);

    return output;
}
