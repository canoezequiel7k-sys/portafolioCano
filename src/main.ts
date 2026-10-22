import "../style.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/interactions.css";
import { initializeInteractions } from "./features/index.ts";

const cleanup = initializeInteractions(document);

if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}
