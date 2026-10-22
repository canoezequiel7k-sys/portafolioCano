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
