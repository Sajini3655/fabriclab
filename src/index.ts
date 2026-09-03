import "./styles/main.css";

import { store, PageId } from "./state/Store";
import { SimulationEngine } from "./simulation/engine/SimulationEngine";
import { TopBar } from "./components/layout/TopBar";
import { BottomControlBar } from "./components/layout/BottomControlBar";
import { WebGPUFallback } from "./components/layout/WebGPUFallback";
import { SaveExperimentModal } from "./components/layout/SaveExperimentModal";

import { CommandPalette } from "./components/modals/CommandPalette";
import { MaterialDetailModal } from "./components/modals/MaterialDetailModal";
import { HelpModal } from "./components/modals/HelpModal";
import { OnboardingTour } from "./components/modals/OnboardingTour";
import { SettingsModal } from "./components/modals/SettingsModal";

import { LandingPage } from "./pages/Landing/LandingPage";
import { LaboratoryPage } from "./pages/Laboratory/LaboratoryPage";
import { MaterialsPage } from "./pages/Materials/MaterialsPage";
import { BenchmarksPage } from "./pages/Benchmarks/BenchmarksPage";
import { ExperimentsPage } from "./pages/Experiments/ExperimentsPage";
import { ComparisonPage } from "./pages/Comparison/ComparisonPage";
import { AboutPage } from "./pages/About/AboutPage";

async function main() {
    const root = document.getElementById("app-root");
    if (!root) return;

    const gpu: GPU = navigator.gpu;
    if (!gpu) {
        root.innerHTML = "";
        const fallback = new WebGPUFallback();
        root.appendChild(fallback.getElement());
        return;
    }

    try {
        const adapter = await gpu.requestAdapter();

        if (!adapter) {
            throw new Error("No compatible GPU adapter found.");
        }

        const device = await adapter.requestDevice();

        device.lost.then((info) => {
            console.error("WebGPU Device Lost:", info);
            root.innerHTML = "";
            const fallback = new WebGPUFallback();
            root.appendChild(fallback.getElement());
        });

        const canvas = document.createElement("canvas");
        canvas.id = "simulation-canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 52;

        const engine = new SimulationEngine(canvas, device);

        const topBar = new TopBar();
        const bottomBar = new BottomControlBar(engine);
        const saveModal = new SaveExperimentModal();
        const cmdPalette = new CommandPalette(engine);
        const matModal = new MaterialDetailModal(engine);
        const helpModal = new HelpModal();
        const onboarding = new OnboardingTour();
        const settingsModal = new SettingsModal();

        const landingPage = new LandingPage(engine);
        const labPage = new LaboratoryPage(engine);
        const materialsPage = new MaterialsPage(engine);
        const benchmarksPage = new BenchmarksPage(engine);
        const experimentsPage = new ExperimentsPage(engine);
        const comparisonPage = new ComparisonPage(engine);
        const aboutPage = new AboutPage();

        const contentContainer = document.createElement("div");
        contentContainer.className = "app-content-container";

        root.appendChild(topBar.getElement());
        root.appendChild(contentContainer);
        root.appendChild(bottomBar.getElement());
        root.appendChild(saveModal.getElement());
        root.appendChild(cmdPalette.getElement());
        root.appendChild(matModal.getElement());
        root.appendChild(helpModal.getElement());
        root.appendChild(settingsModal.getElement());
        root.appendChild(onboarding.getElement());

        const renderActivePage = () => {
            contentContainer.innerHTML = "";
            const page = store.activePage;

            if (page === "laboratory") {
                document.body.classList.add("in-laboratory");
                document.documentElement.classList.add("in-laboratory");
            } else {
                document.body.classList.remove("in-laboratory");
                document.documentElement.classList.remove("in-laboratory");
            }

            window.scrollTo({ top: 0, behavior: "instant" as any });

            if (page === "landing") {
                contentContainer.appendChild(landingPage.getElement());
                bottomBar.getElement().style.display = "none";
            } else if (page === "laboratory") {
                contentContainer.appendChild(labPage.getElement());
                bottomBar.getElement().style.display = "flex";
            } else {
                bottomBar.getElement().style.display = "none";
                if (page === "materials") contentContainer.appendChild(materialsPage.getElement());
                else if (page === "benchmarks") contentContainer.appendChild(benchmarksPage.getElement());
                else if (page === "experiments") contentContainer.appendChild(experimentsPage.getElement());
                else if (page === "comparison" || (page as string) === "compare") contentContainer.appendChild(comparisonPage.getElement());
                else if (page === "about") contentContainer.appendChild(aboutPage.getElement());
            }
        };

        store.subscribe<PageId>("page", renderActivePage);
        renderActivePage();

        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight - 52;
            engine.resize(w, h);
        });

        engine.run();

    } catch (err: any) {
        console.error("FabricLab Initialization Error:", err);
        root.innerHTML = "";
        const fallback = new WebGPUFallback();
        root.appendChild(fallback.getElement());
    }
}

main();
