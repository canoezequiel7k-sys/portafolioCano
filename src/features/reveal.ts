import { gsap } from "gsap";

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
    gsap.set(section, { autoAlpha: 0, y: 50 });
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
        gsap.to(section, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        });
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
    for (const section of sections) {
      gsap.killTweensOf(section);
      gsap.killTweensOf(animatedItems.get(section) ?? []);
      gsap.set([section, ...(animatedItems.get(section) ?? [])], { clearProps: "all" });
    }
  };
}
