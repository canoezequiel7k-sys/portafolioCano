/** Controla apertura, accesibilidad por teclado y cierre del menú lateral. */
export function initializeNavigation(root: Document): () => void {
  const menu = root.querySelector<HTMLElement>(".menu-item");
  const toggle = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const panel = root.querySelector<HTMLElement>(".submenu-side");
  const main = root.querySelector<HTMLElement>("main");

  if (!menu || !toggle || !panel || !main) {
    return () => {};
  }

  const links = [...panel.querySelectorAll<HTMLAnchorElement>("a")];
  // Sincroniza la visibilidad, el foco y los atributos accesibles del panel.
  const setOpen = (open: boolean, restoreFocus = false): void => {
    menu.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    panel.inert = !open;
    for (const link of links) {
      if (open) {
        link.removeAttribute("tabindex");
      } else {
        link.setAttribute("tabindex", "-1");
      }
    }
    if (restoreFocus) {
      toggle.focus();
    }
  };

  /** Abre el menú y habilita sus enlaces para teclado y tecnologías de asistencia. */
  const openMenu = (): void => {
    setOpen(true);
  };

  // Alterna el estado del menú con su botón principal.
  const handleToggle = (): void => {
    if (toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
    } else {
      openMenu();
    }
  };
  // Cierra el panel cuando el clic ocurre fuera de él.
  const handleDocumentClick = (event: MouseEvent): void => {
    if (
      menu.classList.contains("active") &&
      event.target instanceof Node &&
      !menu.contains(event.target)
    ) {
      setOpen(false);
    }
  };
  // Permite cerrar el menú con Escape y devuelve el foco al botón.
  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && menu.classList.contains("active")) {
      event.preventDefault();
      setOpen(false, true);
    }
  };
  // Cierra el panel tras elegir un ancla y enfoca la sección de destino.
  const handleNavigation = (event: MouseEvent): void => {
    if (event.target instanceof Element) {
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || !panel.contains(anchor)) {
        return;
      }
      setOpen(false);
      const target = root.getElementById(anchor.hash.slice(1));
      target?.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", handleToggle);
  root.addEventListener("click", handleDocumentClick);
  root.addEventListener("keydown", handleKeydown);
  panel.addEventListener("click", handleNavigation);

  return () => {
    toggle.removeEventListener("click", handleToggle);
    root.removeEventListener("click", handleDocumentClick);
    root.removeEventListener("keydown", handleKeydown);
    panel.removeEventListener("click", handleNavigation);
    setOpen(false);
  };
}
