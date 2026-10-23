export function initializeSectionScroll(root: Document): () => void {
  const main = root.querySelector<HTMLElement>("main");
  const view = root.defaultView;

  if (!main || !view) {
    return () => {};
  }

  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  let isScrollingToSection = false;
  let unlockTimer: number | null = null;
  const sections = [
    ...main.querySelectorAll<HTMLElement>(":scope > .seccion, :scope > .footer-seccion"),
  ];
  const updateSnapAlignment = (): void => {
    const paddingTop = Number.parseFloat(view.getComputedStyle(main).paddingTop) || 0;
    const availableHeight = main.clientHeight - paddingTop;
    sections.forEach((section) => {
      section.classList.toggle("seccion--larga", section.offsetHeight > availableHeight + 1);
    });
  };

  updateSnapAlignment();
  view.addEventListener("resize", updateSnapAlignment);

  const unlock = (): void => {
    isScrollingToSection = false;
    if (unlockTimer !== null) {
      view.clearTimeout(unlockTimer);
      unlockTimer = null;
    }
  };

  const getCurrentSection = (): {
    section: HTMLElement;
    bounds: DOMRect;
    viewportTop: number;
    viewportBottom: number;
  } | null => {
    const mainBounds = main.getBoundingClientRect();
    const paddingTop = Number.parseFloat(view.getComputedStyle(main).paddingTop) || 0;
    const viewportTop = mainBounds.top + main.clientTop + paddingTop;
    const viewportBottom = mainBounds.bottom;
    const currentIndex = sections.findIndex((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.bottom > viewportTop + 1 && bounds.top <= viewportTop + 32;
    });
    const currentSection = sections[currentIndex];

    if (!currentSection) {
      return null;
    }

    return {
      section: currentSection,
      bounds: currentSection.getBoundingClientRect(),
      viewportTop,
      viewportBottom,
    };
  };

  const canContinueWithinSection = (
    direction: number,
    bounds: DOMRect,
    viewportTop: number,
    viewportBottom: number,
  ): boolean => {
    const viewportHeight = viewportBottom - viewportTop;
    return direction > 0
      ? bounds.height > viewportHeight && bounds.bottom > viewportBottom + 1
      : bounds.height > viewportHeight && bounds.top < viewportTop - 1;
  };

  const navigate = (direction: number, currentSection: HTMLElement): boolean => {
    const currentIndex = sections.indexOf(currentSection);
    const nextSection = sections[currentIndex + direction];
    if (!nextSection) {
      return false;
    }

    isScrollingToSection = true;
    const paddingTop = Number.parseFloat(view.getComputedStyle(main).paddingTop) || 0;
    const viewportTop = main.getBoundingClientRect().top + main.clientTop + paddingTop;
    const nextBounds = nextSection.getBoundingClientRect();
    main.scrollTo({
      top: main.scrollTop + nextBounds.top - viewportTop,
      behavior: "smooth",
    });
    unlockTimer = view.setTimeout(unlock, 900);
    return true;
  };

  const handleWheel = (event: WheelEvent): void => {
    if (reducedMotion.matches || event.ctrlKey || event.deltaY === 0) {
      return;
    }

    const direction = Math.sign(event.deltaY);
    const current = getCurrentSection();

    if (isScrollingToSection) {
      if (
        current &&
        canContinueWithinSection(
          direction,
          current.bounds,
          current.viewportTop,
          current.viewportBottom,
        )
      ) {
        unlock();
        return;
      }
      event.preventDefault();
      return;
    }

    if (!current) {
      return;
    }
    if (
      canContinueWithinSection(
        direction,
        current.bounds,
        current.viewportTop,
        current.viewportBottom,
      )
    ) {
      return;
    }

    if (navigate(direction, current.section)) {
      event.preventDefault();
    }
  };

  main.addEventListener("wheel", handleWheel, { passive: false });
  main.addEventListener("scrollend", unlock);

  return () => {
    main.removeEventListener("wheel", handleWheel);
    main.removeEventListener("scrollend", unlock);
    view.removeEventListener("resize", updateSnapAlignment);
    unlock();
  };
}
