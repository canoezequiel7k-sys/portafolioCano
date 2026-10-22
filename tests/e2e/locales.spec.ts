import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("serves equivalent Spanish and English draft pages", async ({ page }) => {
  const expectedSectionIds = ["inicio", "trabajos", "acerca", "proyectos"];

  for (const locale of [
    { path: "/", lang: "es" },
    { path: "/en/", lang: "en" },
  ]) {
    await page.goto(locale.path);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    for (const id of expectedSectionIds) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    );
    for (const documentPath of [
      "/cv_ezequiel.pdf",
      "/ingles_certificado.pdf",
      "/freecodecamp.pdf",
      "/coderhause.pdf",
    ]) {
      const response = await page.request.get(documentPath);
      expect(response.ok(), `${documentPath} should be served`).toBeTruthy();
    }
    const accessibility = await new AxeBuilder({ page }).analyze();
    await test.info().attach(`axe-${locale.lang}.json`, {
      body: JSON.stringify(accessibility, null, 2),
      contentType: "application/json",
    });
  }

  await expect(page.getByText("English translation draft", { exact: false })).toBeVisible();
});

test("preserves the menu and persistent theme interaction", async ({ page }) => {
  await page.goto("/");
  const menuItem = page.locator(".menu-item");
  await page.locator(".menu-item > a").click();
  await expect(menuItem).toHaveClass(/active/);
  await page.locator("h1").click();
  await expect(menuItem).not.toHaveClass(/active/);

  await page.locator("#dark-toggle").click();
  await expect(page.locator("body")).toHaveClass(/dark-mode/);
  await page.reload();
  await expect(page.locator("body")).toHaveClass(/dark-mode/);
});

test("switches between locale routes and stays within the requested viewports", async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 740 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 844, height: 390 },
  ];

  for (const locale of [
    { path: "/", target: "/en/", text: "English", targetLang: "en" },
    { path: "/en/", target: "/", text: "Español", targetLang: "es" },
  ]) {
    await page.goto(locale.path);
    const languageLink = page.locator(".language-switch");
    await expect(languageLink).toHaveText(locale.text);
    await expect(languageLink).toHaveAttribute("hreflang", locale.targetLang);
    await expect(languageLink).toHaveAttribute("lang", locale.targetLang);
    await expect(languageLink).toHaveAttribute("href", locale.target);
    await languageLink.click();
    await expect(page).toHaveURL(new RegExp(`${locale.target.replaceAll("/", "\\/")}$`));

    await page.goto(locale.path);
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const overflow = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        main: document.querySelector("main")?.scrollWidth,
        header: document.querySelector("header")?.scrollWidth,
        mainClient: document.querySelector("main")?.clientWidth,
        headerClient: document.querySelector("header")?.clientWidth,
        headerBounds: {
          bottom: document.querySelector("header")?.getBoundingClientRect().bottom ?? 0,
          nav: document.querySelector("header nav")?.getBoundingClientRect().toJSON(),
          actions: document.querySelector(".acciones-header")?.getBoundingClientRect().toJSON(),
          title: document.querySelector("header h1")?.getBoundingClientRect().toJSON(),
        },
        sectionHeights: [...document.querySelectorAll("main > .seccion")].map((section) => ({
          id: section.id,
          client: section.clientHeight,
          scroll: section.scrollHeight,
        })),
      }));
      expect(
        overflow.main,
        `${locale.path} at ${viewport.width}px main overflow`,
      ).toBeLessThanOrEqual(overflow.mainClient ?? 0);
      expect(
        overflow.header,
        `${locale.path} at ${viewport.width}px header overflow`,
      ).toBeLessThanOrEqual(overflow.headerClient ?? 0);
      expect(overflow.viewport).toBe(viewport.width);
      for (const section of overflow.sectionHeights) {
        expect(
          section.scroll,
          `${locale.path} at ${viewport.width}px section #${section.id} content should not be clipped`,
        ).toBeLessThanOrEqual(section.client);
      }
      if (viewport.width <= 767) {
        expect(overflow.headerBounds.nav?.right).toBeLessThanOrEqual(
          overflow.headerBounds.actions?.left ?? 0,
        );
        expect(overflow.headerBounds.title?.top).toBeGreaterThanOrEqual(
          Math.max(
            overflow.headerBounds.nav?.bottom ?? 0,
            overflow.headerBounds.actions?.bottom ?? 0,
          ) - 1,
        );
        expect(overflow.headerBounds.title?.bottom).toBeLessThanOrEqual(
          overflow.headerBounds.bottom + 1,
        );
      }
    }
  }
});
