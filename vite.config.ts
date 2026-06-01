import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mockCommentsApi } from "./dev/mockCommentsApi";

export default defineConfig({
  plugins: [mockCommentsApi(), react(), tailwindcss()],
});
