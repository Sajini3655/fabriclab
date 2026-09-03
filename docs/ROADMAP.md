# FabricLab Product Roadmap

## Implemented in Phase 1 & Phase 2 (Completed)

- [x] **WebGPU XPBD Compute Core**: Numerical integration, distance constraints, dihedral bending, and atomic normal accumulation.
- [x] **Parallel Gauss-Seidel Graph Coloring**: CPU-based greedy constraint graph partitioning for conflict-free GPU parallel dispatch.
- [x] **3D Mouse Raycaster & Vertex Grabbing**: Screen-to-world raycasting for direct cloth manipulation.
- [x] **Interactive Anchor / Pinning Editor**: Dynamic in-place particle pinning and unpinning.
- [x] **8 Calibrated Physical Materials**: Silk, Cotton, Denim, Linen, Leather, Rubber, Wool, Canvas.
- [x] **Material Specimen Catalog & Detail Modal**: Comprehensive physical parameter breakdowns.
- [x] **Aerodynamic Wind Shears & Colliders**: Directional wind azimuth, turbulence, rigid sphere and ground plane collision resolution.
- [x] **Stress & Strain Thermal Heat-Map**: Real-time shader-based localized deformation visualization.
- [x] **Multi-Tier Performance Benchmark Suite**: 5K to 100K stress tests with statistical latency percentiles and CSV export.
- [x] **Persistent Experiment Archive**: Versioned schema (`schemaVersion: 1`) with JSON export/import.
- [x] **Dual Material Comparison Lab**: Side-by-side synchronized material behavior inspection.
- [x] **Universal Command Palette (`Ctrl+K` / `Cmd+K`)**: Quick launcher for actions and routes.
- [x] **Interactive First-Run Onboarding Tour & Guide**: Step-by-step introduction.
- [x] **Attribution & Scientific Documentation**: Transparent open-source attribution and research citations.

---

## Future Roadmap (Post-Phase 2)

- [ ] **Complex Arbitrary Mesh Colliders**: Support importing custom GLTF/OBJ rigid body colliders (e.g. mannequin, chairs).
- [ ] **Cloth-on-Cloth Self-Collision**: Spatial hashing or BVH-based continuous self-collision compute kernels.
- [ ] **Tearable / Breakable Constraints**: Dynamic constraint removal under threshold tensile strain.
- [ ] **Cloud Experiment Sharing**: Optional REST API backend (Spring Boot / PostgreSQL) for syncing experiments across devices.
