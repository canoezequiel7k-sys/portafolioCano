import { defineConfig } from "@playwright/test";

// Puerto configurable para probar el sitio ya compilado sin interferir con Vite dev.
const port = Number(process.env.PLAYWRIGHT_PREVIEW_PORT ?? 4173);

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    // Usa el mismo navegador que la suite local para comparar los resultados.
    browserName: "chromium",
  },
  webServer: {
    // Sirve el contenido de dist y valida el comportamiento del build final.
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
