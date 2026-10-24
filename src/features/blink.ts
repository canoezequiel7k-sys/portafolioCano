import { gsap } from "gsap";

// Ajustá estos valores para cambiar la frecuencia y duración total del parpadeo.
const MIN_BLINK_INTERVAL_MS = 5_000;
const MAX_BLINK_INTERVAL_MS = 9_000;
const BLINK_DURATION_MS = 250;

const activeCleanups = new WeakMap<Document, () => void>();

/** Calcula un intervalo uniforme entre el mínimo y el máximo configurados. */
export function getBlinkInterval(randomValue = Math.random()): number {
  return MIN_BLINK_INTERVAL_MS + randomValue * (MAX_BLINK_INTERVAL_MS - MIN_BLINK_INTERVAL_MS);
}

/** Parpadea ambas pupilas sin modificar las coordenadas controladas por la feature de ojos. */
export function initializeBlink(root: Document): () => void {
  activeCleanups.get(root)?.();

  const pupils = [...root.querySelectorAll<SVGCircleElement>("#ojo-izq, #ojo-der")];
  const view = root.defaultView;
  if (!view || pupils.length === 0) {
    return () => {};
  }

  const motionPreference = view.matchMedia("(prefers-reduced-motion: reduce)");
  let timer: number | undefined;
  let timeline: gsap.core.Timeline | undefined;
  let disposed = false;

  // Mantiene el centro de escala sincronizado con cx/cy mientras las pupilas se mueven.
  const applyScale = (scaleY: number): void => {
    for (const pupil of pupils) {
      const cx = pupil.cx.baseVal.value;
      const cy = pupil.cy.baseVal.value;
      pupil.setAttribute(
        "transform",
        `translate(${cx} ${cy}) scale(1 ${scaleY}) translate(${-cx} ${-cy})`,
      );
    }
  };

  const clearTransforms = (): void => {
    pupils.forEach((pupil) => pupil.removeAttribute("transform"));
  };

  const cancelBlink = (): void => {
    if (timer !== undefined) {
      view.clearTimeout(timer);
      timer = undefined;
    }
    timeline?.kill();
    timeline = undefined;
    clearTransforms();
  };

  const scheduleBlink = (): void => {
    if (disposed || motionPreference.matches || root.visibilityState !== "visible") {
      return;
    }
    timer = view.setTimeout(runBlink, getBlinkInterval());
  };

  function runBlink(): void {
    timer = undefined;
    if (disposed || motionPreference.matches || root.visibilityState !== "visible") {
      return;
    }

    const state = { scaleY: 1 };
    timeline = gsap
      .timeline({
        onUpdate: () => applyScale(state.scaleY),
        onComplete: () => {
          timeline = undefined;
          clearTransforms();
          scheduleBlink();
        },
      })
      .to(state, {
        scaleY: 0.05,
        duration: BLINK_DURATION_MS / 2_000,
        ease: "power1.in",
      })
      .to(state, {
        scaleY: 1,
        duration: BLINK_DURATION_MS / 2_000,
        ease: "power1.out",
      });
  }

  const handleMotionChange = (): void => {
    cancelBlink();
    scheduleBlink();
  };
  const handleVisibilityChange = (): void => {
    cancelBlink();
    scheduleBlink();
  };

  motionPreference.addEventListener("change", handleMotionChange);
  root.addEventListener("visibilitychange", handleVisibilityChange);
  scheduleBlink();

  const cleanup = (): void => {
    if (disposed) {
      return;
    }
    disposed = true;
    motionPreference.removeEventListener("change", handleMotionChange);
    root.removeEventListener("visibilitychange", handleVisibilityChange);
    cancelBlink();
    activeCleanups.delete(root);
  };

  activeCleanups.set(root, cleanup);
  return cleanup;
}
