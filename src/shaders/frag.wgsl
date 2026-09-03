struct RenderParams {
    materialColor: vec3<f32>,
    roughness: f32,
    lightDir: vec3<f32>,
    viewMode: f32, // 0 = Shaded, 1 = Normal, 2 = Wireframe, 3 = Stress Heatmap
};

@group(1) @binding(0) var<uniform> params: RenderParams;

fn turboColormap(t: f32) -> vec3<f32> {
    let x = clamp(t, 0.0, 1.0);
    if (x < 0.25) {
        let f = x / 0.25;
        return mix(vec3<f32>(0.05, 0.2, 0.8), vec3<f32>(0.0, 0.8, 0.9), f);
    } else if (x < 0.5) {
        let f = (x - 0.25) / 0.25;
        return mix(vec3<f32>(0.0, 0.8, 0.9), vec3<f32>(0.1, 0.85, 0.3), f);
    } else if (x < 0.75) {
        let f = (x - 0.5) / 0.25;
        return mix(vec3<f32>(0.1, 0.85, 0.3), vec3<f32>(0.95, 0.8, 0.1), f);
    } else {
        let f = (x - 0.75) / 0.25;
        return mix(vec3<f32>(0.95, 0.8, 0.1), vec3<f32>(0.95, 0.15, 0.15), f);
    }
}

@fragment
fn main(@location(0) normal: vec3<f32>, @location(1) worldPos: vec3<f32>, @location(2) stress: f32) -> @location(0) vec4<f32> {
    if (params.viewMode > 2.5) {
        // Mode 3: Relative Deformation / Stress Heatmap
        let heatColor = turboColormap(stress);
        let n = normalize(normal);
        let l = normalize(params.lightDir);
        let diff = max(dot(n, l), 0.0) * 0.45 + 0.65;
        return vec4<f32>(heatColor * diff, 1.0);
    }

    if (params.viewMode > 1.5) {
        // Mode 2: Wireframe Diagnostic
        return vec4<f32>(0.05, 0.85, 0.95, 1.0);
    }

    if (params.viewMode > 0.5) {
        // Mode 1: Normal Vectors
        return vec4<f32>(normal * 0.5 + 0.5, 1.0);
    }

    // Mode 0: Physical Textile Lighting with Fresnel Rim & Dual Specular
    let n = normalize(normal);
    let l1 = normalize(params.lightDir);
    let l2 = normalize(vec3<f32>(-params.lightDir.x, 0.6, -params.lightDir.z));

    // Double-sided lighting
    let diff1 = max(dot(n, l1), 0.0) + max(dot(-n, l1), 0.0) * 0.4;
    let diff2 = max(dot(n, l2), 0.0) * 0.35 + max(dot(-n, l2), 0.0) * 0.2;

    let v = normalize(vec3<f32>(0.0, 5.0, 15.0) - worldPos);
    let h1 = normalize(l1 + v);
    
    // Fresnel Rim Highlight
    let fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.25;
    
    // Specular Highlight
    let specPower = mix(64.0, 8.0, clamp(params.roughness, 0.0, 1.0));
    let specIntensity = mix(0.45, 0.08, clamp(params.roughness, 0.0, 1.0));
    let spec = pow(max(dot(n, h1), 0.0), specPower) * specIntensity;

    let ambient = 0.24;
    let diffuse = (diff1 + diff2 + ambient);
    let finalColor = params.materialColor * diffuse + vec3<f32>(spec + fresnel);

    return vec4<f32>(finalColor, 1.0);
}
