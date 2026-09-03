import { MaterialProperty } from "./material";
import { SimulationConfig } from "./simulation";
import { EnvironmentConfig } from "./environment";

export interface Experiment {
    id: string;
    name: string;
    description: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    material: MaterialProperty;
    simulation: SimulationConfig;
    environment: EnvironmentConfig;
    isPreset?: boolean;
}
