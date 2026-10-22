import { readSessionFlag } from "./storage.ts";

const CHARACTER_DELAY_MS = 120;

export function initializeTypewriter(root: Document): () => void {
  const heading = root.querySelector<HTMLElement>("#typewriter-text");
  if (!heading) {
    return () => {};
  }

  const text = heading.dataset.text ?? "";
  const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const skipIntro = readSessionFlag("skip-intro");
  let timer = 0;
  let characterIndex = 0;

  if (reducedMotion || skipIntro) {
    heading.textContent = text;
    heading.classList.add("is-complete");
    return () => {};
  }

  const typeNextCharacter = (): void => {
    if (characterIndex >= text.length) {
      heading.classList.add("is-complete");
      return;
    }
    characterIndex += 1;
    heading.textContent = text.slice(0, characterIndex);
    timer = root.defaultView?.setTimeout(typeNextCharacter, CHARACTER_DELAY_MS) ?? 0;
  };

  typeNextCharacter();
  return () => {
    root.defaultView?.clearTimeout(timer);
  };
}
