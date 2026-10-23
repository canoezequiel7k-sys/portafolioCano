import type { Locale, Localized } from "../../types/content.ts";

/** Resuelve la ruta inglesa; cualquier otra ruta usa español por defecto. */
export function resolveLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

/** Obtiene el texto localizado para el idioma solicitado. */
export function localizedText(value: Localized, locale: Locale): string {
  return value[locale];
}
