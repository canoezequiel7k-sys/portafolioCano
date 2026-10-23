import { initializeCanvas } from "./canvas.ts";
import { initializeEyes } from "./eyes.ts";
import { initializeLanguage } from "./language.ts";
import { initializeNavigation } from "./navigation.ts";
import { initializeReveal } from "./reveal.ts";
import { initializeSectionScroll } from "./section-scroll.ts";
import { initializeTheme } from "./theme.ts";
import { initializeTilt } from "./tilt.ts";
import { initializeTypewriter } from "./typewriter.ts";

/** Inicializa todas las interacciones y devuelve una única función de limpieza. */
export function initializeInteractions(root: Document): () => void {
  const cleanups = [
    initializeNavigation(root),
    initializeTheme(root),
    initializeLanguage(root),
    initializeReveal(root),
    initializeSectionScroll(root),
    initializeCanvas(root),
    initializeEyes(root),
    initializeTilt(root),
    initializeTypewriter(root),
  ];

  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
