export function readPreference(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Could not read preference "${key}".`, error);
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save preference "${key}".`, error);
  }
}

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

export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, "true");
  } catch (error) {
    console.warn(`Could not save session flag "${key}".`, error);
  }
}
