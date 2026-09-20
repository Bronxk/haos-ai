// Vite 8 no longer types the Vitest `test` block, so the Vitest re-export of
// defineConfig is the one that knows about it.
import { defineConfig } from "vitest/config";

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

