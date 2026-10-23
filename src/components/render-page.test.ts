import { describe, expect, it } from "vitest";
import { escapeHtml, renderPage } from "./render-page.ts";

describe("renderPage", () => {
  it("renders the same section IDs for both locales", () => {
    const sectionIds = (html: string) =>
      [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
    expect(sectionIds(renderPage("es"))).toEqual(sectionIds(renderPage("en")));
  });

  it("renders the approved English copy without a draft notice", () => {
    expect(renderPage("en")).not.toContain("translation draft");
  });
});

describe("escapeHtml", () => {
  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml(`<script title="x">&'`)).toBe("&lt;script title=&quot;x&quot;&gt;&amp;&#39;");
  });
});
