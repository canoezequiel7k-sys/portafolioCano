import { gsap } from "gsap";

/** Revela el contenido de cada sección al entrar en pantalla y cancela sus animaciones al desmontar. */
export function initializeReveal(root: Document): () => void {
  const main = root.querySelector<HTMLElement>("main");
  const sections = [...root.querySelectorAll<HTMLElement>("main > .seccion")];

  if (!main || sections.length === 0) {
    return () => {};
  }

  const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animatedItems = new Map<HTMLElement, HTMLElement[]>();

  if (reducedMotion) {
    return () => {};
  }

  for (const section of sections) {
    const items = [
      ...section.querySelectorAll<HTMLElement>(
        ".proyecto, .fade-text, .fade-in-seq, .about-card, .cv-container, .card-wrapper",
      ),
    ];
    animatedItems.set(section, items);
    gsap.set(items, { autoAlpha: 0, y: 18 });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          continue;
        }
        const section = entry.target;
        observer.unobserve(section);
        section.classList.add("visible");
        const items = animatedItems.get(section) ?? [];
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          overwrite: true,
        });
      }
    },
    { root: main, threshold: 0.05 },
  );

  for (const section of sections) {
    observer.observe(section);
  }

  return () => {
    observer.disconnect();
    for (const items of animatedItems.values()) {
      gsap.killTweensOf(items);
      gsap.set(items, { clearProps: "all" });
    }
  };
}
