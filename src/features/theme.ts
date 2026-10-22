import { writePreference } from "./storage.ts";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    readonly finished: Promise<void>;
    readonly ready: Promise<void>;
    readonly updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
};

export function initializeTheme(root: Document): () => void {
  const button = root.querySelector<HTMLButtonElement>("#dark-toggle");
  const body = root.body;

  if (!button) {
    return () => {};
  }

  const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)");
  const transitionDocument = root as ViewTransitionDocument;
  const view = root.defaultView;
  let iconAnimationTimer: number | null = null;
  let activeTransition: ReturnType<
    NonNullable<ViewTransitionDocument["startViewTransition"]>
  > | null = null;
  let isLeaving = false;
  const updateButton = (): void => {
    const isDark = body.classList.contains("dark-mode");
    button.textContent = isDark ? "☀️" : "🌙";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? (button.dataset.labelDark ?? "") : (button.dataset.labelLight ?? ""),
    );
  };
  const applyTheme = (): void => {
    const isDark = body.classList.toggle("dark-mode");
    writePreference("theme", isDark ? "dark" : "light");
    updateButton();
  };
  const animateButton = (): void => {
    if (reducedMotion?.matches || !view) {
      return;
    }

    button.classList.remove("animate");
    if (iconAnimationTimer !== null) {
      view.clearTimeout(iconAnimationTimer);
    }
    button.getBoundingClientRect();
    button.classList.add("animate");
    iconAnimationTimer = view.setTimeout(() => {
      button.classList.remove("animate");
      iconAnimationTimer = null;
    }, 600);
  };
  const handleClick = (): void => {
    animateButton();

    if (!reducedMotion?.matches && transitionDocument.startViewTransition) {
      let applied = false;
      const applyOnce = (): void => {
        if (!applied) {
          applied = true;
          applyTheme();
        }
      };
      let warned = false;
      const handleTransitionError = (error: unknown): void => {
        if (!warned && !isLeaving) {
          warned = true;
          console.warn("View Transition was unavailable; using the regular theme change.", error);
        }
        applyOnce();
      };
      try {
        const transition = transitionDocument.startViewTransition(applyOnce);
        activeTransition = transition;
        void transition.finished.then(() => {
          if (activeTransition === transition) {
            activeTransition = null;
          }
        }, handleTransitionError);
        void transition.ready.catch(handleTransitionError);
        void transition.updateCallbackDone.catch(handleTransitionError);
      } catch (error) {
        handleTransitionError(error);
      }
    } else {
      applyTheme();
    }
  };
  const handlePageHide = (): void => {
    isLeaving = true;
    activeTransition?.skipTransition();
    activeTransition = null;
  };

  updateButton();
  button.addEventListener("click", handleClick);
  root.defaultView?.addEventListener("pagehide", handlePageHide);

  return () => {
    button.removeEventListener("click", handleClick);
    root.defaultView?.removeEventListener("pagehide", handlePageHide);
    if (iconAnimationTimer !== null) {
      view?.clearTimeout(iconAnimationTimer);
      iconAnimationTimer = null;
    }
    button.classList.remove("animate");
    handlePageHide();
  };
}
