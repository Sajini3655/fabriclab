export interface MaterialProperty {
    id: string;
    name: string;
    category: "Natural" | "Synthetic" | "Heavy" | "Technical";
    description: string;
    density: number; // kg/m^2 or area mass
    stretchCompliance: number; // m/N
    bendCompliance: number; // Dihedral bend compliance
    damping: number; // Velocity damping factor [0, 1]
    friction: number; // Surface friction coefficient
    thicknessMm: number;
    color: [number, number, number]; // RGB normalized [0, 1]
    roughness: number;
    stiffnessRating: "Very Low" | "Low" | "Medium" | "High" | "Rigid";
    stretchRating: "Very Low" | "Low" | "Medium" | "High" | "Elastic";
    weightRating: "Ultra Light" | "Light" | "Medium" | "Heavy";
}
