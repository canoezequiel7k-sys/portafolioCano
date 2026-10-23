import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Las pruebas unitarias verifican módulos sin requerir un navegador.
    environment: "node",
    // Convención para descubrir pruebas junto al código fuente.
    include: ["src/**/*.test.ts"],
  },
});
