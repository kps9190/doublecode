/// <reference types="vite/client" />
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import Screen from "./Screen";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Screen />
        <Analytics />
        <SpeedInsights />
    </StrictMode>
);
