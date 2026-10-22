import { gsap } from "gsap";

export function initializeEyes(root: Document): () => void {
  const pupils = [...root.querySelectorAll<SVGCircleElement>("#ojo-izq, #ojo-der")];
  if (pupils.length === 0) {
    return () => {};
  }

  const view = root.defaultView;
  const reducedMotion = view?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!view || reducedMotion) {
    return () => {};
  }

  const coarsePointer = view.matchMedia("(pointer: coarse)").matches;
  const origins = pupils.map((pupil) => ({
    x: pupil.cx.baseVal.value,
    y: pupil.cy.baseVal.value,
  }));
  if (coarsePointer) {
    const offsets = pupils.map(() => ({ y: 0 }));
    const idle = pupils.map((pupil, index) =>
      gsap.to(offsets[index], {
        y: 1.5,
        duration: 2.4,
        delay: index * 0.25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: () => pupil.setAttribute("cy", String(origins[index].y + offsets[index].y)),
      }),
    );
    return () => {
      idle.forEach((animation) => animation.kill());
      pupils.forEach((pupil, index) => {
        pupil.setAttribute("cx", String(origins[index].x));
        pupil.setAttribute("cy", String(origins[index].y));
      });
    };
  }

  const offsets = pupils.map(() => ({ x: 0, y: 0 }));
  const moveX = pupils.map((pupil, index) =>
    gsap.quickTo(offsets[index], "x", {
      duration: 0.18,
      ease: "power2.out",
      onUpdate: () => pupil.setAttribute("cx", String(origins[index].x + offsets[index].x)),
    }),
  );
  const moveY = pupils.map((pupil, index) =>
    gsap.quickTo(offsets[index], "y", {
      duration: 0.18,
      ease: "power2.out",
      onUpdate: () => pupil.setAttribute("cy", String(origins[index].y + offsets[index].y)),
    }),
  );
  const handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      return;
    }
    pupils.forEach((pupil, index) => {
      const bounds = pupil.ownerSVGElement?.getBoundingClientRect();
      if (!bounds || bounds.width === 0 || bounds.height === 0) {
        return;
      }
      const viewBox = pupil.ownerSVGElement?.viewBox.baseVal;
      if (!viewBox || viewBox.width === 0 || viewBox.height === 0) {
        return;
      }
      const centerX = bounds.left + ((origins[index].x - viewBox.x) / viewBox.width) * bounds.width;
      const centerY =
        bounds.top + ((origins[index].y - viewBox.y) / viewBox.height) * bounds.height;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const ratio = distance > 6 ? 6 / distance : 1;
      moveX[index]?.(dx * ratio);
      moveY[index]?.(dy * ratio);
    });
  };
  const reset = (): void => {
    moveX.forEach((move) => move(0));
    moveY.forEach((move) => move(0));
  };

  view.addEventListener("pointermove", handlePointerMove, { passive: true });
  view.addEventListener("pointerleave", reset);

  return () => {
    view.removeEventListener("pointermove", handlePointerMove);
    view.removeEventListener("pointerleave", reset);
    gsap.killTweensOf(offsets);
    pupils.forEach((pupil, index) => {
      pupil.setAttribute("cx", String(origins[index].x));
      pupil.setAttribute("cy", String(origins[index].y));
    });
  };
}
