import { gsap } from "gsap";

export function initializeTilt(root: Document): () => void {
  const view = root.defaultView;
  const cards = [
    { element: root.querySelector<HTMLElement>(".about-card"), intensity: 8 },
    { element: root.querySelector<HTMLElement>(".certificaciones-container"), intensity: 12 },
  ].filter((card): card is { element: HTMLElement; intensity: number } => card.element !== null);

  if (
    !view ||
    view.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !view.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    return () => {};
  }

  const cleanups = cards.map(({ element, intensity }) => {
    const rotateX = gsap.quickTo(element, "rotationX", { duration: 0.25, ease: "power2.out" });
    const rotateY = gsap.quickTo(element, "rotationY", { duration: 0.25, ease: "power2.out" });
    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) {
        return;
      }
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      rotateX((y - 0.5) * 2 * intensity);
      rotateY((0.5 - x) * 2 * intensity);
    };
    const reset = (): void => {
      rotateX(0);
      rotateY(0);
    };
    element.addEventListener("pointermove", handlePointerMove, { passive: true });
    element.addEventListener("pointerleave", reset);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", reset);
      gsap.killTweensOf(element);
      gsap.set(element, { clearProps: "transform" });
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
