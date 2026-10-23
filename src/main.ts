import "../style.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/interactions.css";
import { initializeInteractions } from "./features/index.ts";

// Conecta los controles y animaciones de la página ya renderizada.
const cleanup = initializeInteractions(document);

// Libera los listeners si Vite reemplaza este módulo durante el desarrollo.
if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}
