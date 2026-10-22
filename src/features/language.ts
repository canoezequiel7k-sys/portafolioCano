import { writePreference, writeSessionFlag } from "./storage.ts";

export function initializeLanguage(root: Document): () => void {
  const main = root.querySelector<HTMLElement>("main");
  const link = root.querySelector<HTMLAnchorElement>(".language-switch");

  if (!main || !link) {
    return () => {};
  }

  const handleClick = (event: MouseEvent): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const mainBounds = main.getBoundingClientRect();
    const center = mainBounds.top + mainBounds.height / 2;
    const sections = [...main.querySelectorAll<HTMLElement>(".seccion")];
    const hashSection = sections.find((section) => section.id === root.location.hash.slice(1));
    const currentSection =
      hashSection ??
      sections.reduce<HTMLElement | null>((nearest, section) => {
        if (!nearest) {
          return section;
        }
        const distance = Math.abs(
          section.getBoundingClientRect().top + section.offsetHeight / 2 - center,
        );
        const nearestDistance = Math.abs(
          nearest.getBoundingClientRect().top + nearest.offsetHeight / 2 - center,
        );
        return distance < nearestDistance ? section : nearest;
      }, null);

    if (currentSection) {
      const target = new URL(link.href, root.location.href);
      target.hash = currentSection.id;
      link.href = target.href;
    }

    const targetLocale = link.hreflang;
    if (targetLocale === "es" || targetLocale === "en") {
      writePreference("preferred-locale", targetLocale);
    }
    writeSessionFlag("skip-intro");
  };

  link.addEventListener("click", handleClick);
  return () => link.removeEventListener("click", handleClick);
}
