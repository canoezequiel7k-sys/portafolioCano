import type { Locale, Localized } from "../../types/content.ts";

export function resolveLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

export function localizedText(value: Localized, locale: Locale): string {
  return value[locale];
}
