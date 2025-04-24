import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import path from "path";
import { fileURLToPath } from "url";
import tsConfigPaths from "vite-tsconfig-paths";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    preset: "netlify",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
  tsr: {
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src",
  },
});
