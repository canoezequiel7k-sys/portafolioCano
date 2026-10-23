/** Lee una preferencia persistente; informa si el navegador bloquea localStorage. */
export function readPreference(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Could not read preference "${key}".`, error);
    return null;
  }
}

/** Guarda una preferencia persistente, como tema o idioma. */
export function writePreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save preference "${key}".`, error);
  }
}

/** Consume una marca temporal de sesión y la elimina para que no se reutilice. */
export function readSessionFlag(key: string): boolean {
  try {
    const value = window.sessionStorage.getItem(key) === "true";
    window.sessionStorage.removeItem(key);
    return value;
  } catch (error) {
    console.warn(`Could not read session flag "${key}".`, error);
    return false;
  }
}

/** Guarda una marca temporal de navegación en sessionStorage. */
export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, "true");
  } catch (error) {
    console.warn(`Could not save session flag "${key}".`, error);
  }
}
