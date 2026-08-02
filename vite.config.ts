import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "frontend/haos-ai-panel.ts",
      formats: ["es"],
      fileName: () => "haos-ai-panel.js",
    },
    outDir: "custom_components/haos_ai/frontend",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
  },
  test: {
    environment: "jsdom",
    include: ["frontend/**/*.test.ts"],
  },
});

