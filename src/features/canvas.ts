interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

const PARTICLE_COUNT = 180;
const POINTER_RADIUS = 100;

export function initializeCanvas(root: Document): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>("#background-canvas");
  const context = canvas?.getContext("2d");
  const view = root.defaultView;

  if (!canvas || !context || !view) {
    return () => {};
  }

  let width = 0;
  let height = 0;
  let devicePixelRatio = 1;
  let frame = 0;
  let pointer: { x: number; y: number } | null = null;
  let particles: Particle[] = [];
  let color = "";
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");

  const readColor = (): boolean => {
    const nextColor = view.getComputedStyle(root.body).getPropertyValue("--particle-color").trim();
    if (!nextColor) {
      console.error("Canvas particle color is missing the --particle-color style token.");
      return false;
    }
    color = nextColor;
    return true;
  };

  const draw = (animate: boolean): void => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = color;

    for (const particle of particles) {
      if (animate) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < 0 || particle.x > width) {
          particle.speedX *= -1;
          particle.x = Math.min(width, Math.max(0, particle.x));
        }
        if (particle.y < 0 || particle.y > height) {
          particle.speedY *= -1;
          particle.y = Math.min(height, Math.max(0, particle.y));
        }

        if (pointer) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < POINTER_RADIUS) {
            particle.x += dx / distance;
            particle.y += dy / distance;
          }
        }
      }

      if (
        ![particle.x, particle.y, particle.size, particle.speedX, particle.speedY].every(
          Number.isFinite,
        )
      ) {
        particle.x = width / 2;
        particle.y = height / 2;
        particle.size = 1;
        particle.speedX = 0;
        particle.speedY = 0;
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
  };

  const stop = (): void => {
    if (frame !== 0) {
      view.cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const animate = (): void => {
    if (view.document.visibilityState !== "visible" || reducedMotion.matches) {
      frame = 0;
      return;
    }
    draw(true);
    frame = view.requestAnimationFrame(animate);
  };
  const start = (): void => {
    if (frame === 0 && view.document.visibilityState === "visible" && !reducedMotion.matches) {
      frame = view.requestAnimationFrame(animate);
    }
  };
  const resize = (): void => {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, bounds.width);
    const nextHeight = Math.max(1, bounds.height);
    const scaleX = width > 0 ? nextWidth / width : 1;
    const scaleY = height > 0 ? nextHeight / height : 1;
    width = nextWidth;
    height = nextHeight;
    devicePixelRatio = Math.max(1, view.devicePixelRatio || 1);
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    if (particles.length === 0) {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
      }));
    } else {
      for (const particle of particles) {
        particle.x *= scaleX;
        particle.y *= scaleY;
      }
    }

    if (readColor()) {
      draw(false);
    }
    start();
  };
  const handlePointerMove = (event: PointerEvent): void => {
    pointer = { x: event.clientX, y: event.clientY };
  };
  const clearPointer = (): void => {
    pointer = null;
  };
  const handleVisibilityChange = (): void => {
    if (view.document.visibilityState === "visible") {
      start();
    } else {
      stop();
    }
  };
  const handleMotionChange = (): void => {
    if (reducedMotion.matches) {
      stop();
      draw(false);
    } else {
      start();
    }
  };
  const themeObserver = new MutationObserver(() => {
    if (readColor()) {
      draw(false);
    }
  });

  themeObserver.observe(root.body, { attributes: true, attributeFilter: ["class"] });
  view.addEventListener("resize", resize);
  view.addEventListener("pointermove", handlePointerMove, { passive: true });
  view.addEventListener("pointerleave", clearPointer);
  root.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotion.addEventListener("change", handleMotionChange);
  resize();

  return () => {
    stop();
    themeObserver.disconnect();
    view.removeEventListener("resize", resize);
    view.removeEventListener("pointermove", handlePointerMove);
    view.removeEventListener("pointerleave", clearPointer);
    root.removeEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.removeEventListener("change", handleMotionChange);
  };
}
