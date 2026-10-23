import { describe, expect, it } from "vitest";
import { localizedText, resolveLocale } from "./locale.ts";

// Comprueba la detección del idioma a partir de la ruta y el texto elegido.
describe("resolveLocale", () => {
  it("uses Spanish by default", () => {
    expect(resolveLocale("/")).toBe("es");
    expect(resolveLocale("/projects")).toBe("es");
  });

  it("resolves the English route and its descendants", () => {
    expect(resolveLocale("/en")).toBe("en");
    expect(resolveLocale("/en/")).toBe("en");
    expect(resolveLocale("/en/projects")).toBe("en");
  });
});

describe("localizedText", () => {
  it("returns the requested translation", () => {
    expect(localizedText({ es: "Hola", en: "Hello" }, "en")).toBe("Hello");
  });
});
