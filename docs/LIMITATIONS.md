# FabricLab — Known Limitations & Boundaries

---

1. **WebGPU Hardware & Browser Dependency**: Requires modern browsers supporting WebGPU (Google Chrome 113+, Microsoft Edge 113+, Brave). WebGL fallback displays a system requirements guide.
2. **Simplified Rigid Colliders**: Rigid body collision is implemented for analytic spheres and ground planes. Complex arbitrary 3D mesh collisions (e.g. mannequins or chairs) are not yet supported.
3. **Self-Collision**: Cloth-on-cloth self-collision compute kernels are not currently implemented.
4. **Parameterized Materials**: Material parameters are calibrated numerical constants for XPBD compliance ($alpha$), rather than experimentally certified laboratory test measurements.
5. **Deformation Visualization**: The stress view computes localized curvature and gravitational deflection as a relative deformation proxy, not an exact tensor stress measurement.
6. **Local-Only Storage**: Experiments and benchmark history are persisted locally in `localStorage` and can be synced across devices via JSON export/import.
