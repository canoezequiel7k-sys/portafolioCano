export function initializeSectionScroll(root: Document): () => void {
  const main = root.querySelector<HTMLElement>("main");
  const view = root.defaultView;

  if (!main || !view) {
    return () => {};
  }

  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  let isScrollingToSection = false;
  let unlockTimer: number | null = null;
  const sections = [...main.querySelectorAll<HTMLElement>(":scope > .seccion")];

  const unlock = (): void => {
    isScrollingToSection = false;
    if (unlockTimer !== null) {
      view.clearTimeout(unlockTimer);
      unlockTimer = null;
    }
  };

  const handleWheel = (event: WheelEvent): void => {
    if (reducedMotion.matches || event.ctrlKey || event.deltaY === 0) {
      return;
    }

    if (isScrollingToSection) {
      event.preventDefault();
      return;
    }

    const paddingTop = Number.parseFloat(view.getComputedStyle(main).paddingTop) || 0;
    const viewportTop = main.getBoundingClientRect().top + main.clientTop + paddingTop;
    const viewportBottom = main.getBoundingClientRect().bottom;
    const currentIndex = sections.findIndex((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.bottom > viewportTop + 1 && bounds.top < viewportBottom;
    });
    const currentSection = sections[currentIndex];

    if (!currentSection) {
      return;
    }

    const currentBounds = currentSection.getBoundingClientRect();
    const viewportHeight = viewportBottom - viewportTop;
    if (
      (event.deltaY > 0 &&
        currentBounds.height > viewportHeight &&
        currentBounds.bottom > viewportBottom + 1) ||
      (event.deltaY < 0 &&
        currentBounds.height > viewportHeight &&
        currentBounds.top < viewportTop - 1)
    ) {
      return;
    }

    const nextSection = sections[currentIndex + (event.deltaY > 0 ? 1 : -1)];
    if (!nextSection) {
      return;
    }

    event.preventDefault();
    isScrollingToSection = true;
    nextSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    unlockTimer = view.setTimeout(unlock, 900);
  };

  main.addEventListener("wheel", handleWheel, { passive: false });
  main.addEventListener("scrollend", unlock);

  return () => {
    main.removeEventListener("wheel", handleWheel);
    main.removeEventListener("scrollend", unlock);
    unlock();
  };
}
