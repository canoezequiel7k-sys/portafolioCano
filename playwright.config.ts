import { defineConfig } from "@playwright/test";

// Permite usar un puerto alternativo en pruebas locales o automatizadas.
const port = Number(process.env.PLAYWRIGHT_PORT ?? 5173);

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    // Mantiene las pruebas de interfaz reproducibles con el navegador instalado.
    browserName: "chromium",
  },
  webServer: {
    // Arranca Vite en modo desarrollo y falla si el puerto ya está ocupado.
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
