import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("serves equivalent Spanish and English pages", async ({ page }) => {
  const expectedSectionIds = ["inicio", "trabajos", "acerca", "proyectos"];

  for (const locale of [
    { path: "/", lang: "es", cv: "/cv-es.pdf" },
    { path: "/en/", lang: "en", cv: "/cv-en.pdf" },
  ]) {
    await page.goto(locale.path);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page).toHaveTitle(/Ezequiel Cano/);
    await expect(page.locator("header h1")).toHaveText("Ezequiel Cano");
    await expect(page.locator(".btn-cv")).toHaveAttribute("href", locale.cv);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /favicon.*\.svg$/);
    const canonical = page.locator('link[rel="canonical"]');
    if (process.env.SITE_URL) {
      await expect(canonical).toHaveAttribute(
        "href",
        `${process.env.SITE_URL.replace(/\/+$/, "")}${locale.path}`,
      );
      await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
      await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
      if (locale.lang === "es") {
        const robots = await page.request.get("/robots.txt");
        expect(robots.ok()).toBeTruthy();
        expect(await robots.text()).toContain(`${process.env.SITE_URL}/sitemap.xml`);
        const sitemap = await page.request.get("/sitemap.xml");
        expect(sitemap.ok()).toBeTruthy();
        expect(await sitemap.text()).toContain('hreflang="x-default"');
        expect(await sitemap.text()).toContain(`${process.env.SITE_URL}/en/`);
      }
    } else {
      await expect(canonical).toHaveCount(0);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    for (const id of expectedSectionIds) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    );
    await expect(page.locator(".marquee-content")).toHaveCSS("animation-duration", "25s");
    await expect(page.locator(".marquee-group").first()).toHaveCSS("display", "flex");
    await expect(page.locator(".marquee-group").first()).toHaveCSS("flex-shrink", "0");
    await expect(page.locator(".marquee-group[aria-hidden=true]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const images = await page.locator("main img").evaluateAll((elements) =>
      elements.map((image) => ({
        source: image.getAttribute("src"),
        alt: image.getAttribute("alt"),
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
        loading: image.getAttribute("loading"),
      })),
    );
    for (const image of images.filter(({ source }) => source?.includes("/images/"))) {
      expect(image.source).toMatch(/\.webp$/);
      expect(image.alt).toBeTruthy();
      expect(image.width).toBeTruthy();
      expect(image.height).toBeTruthy();
      expect(image.loading).toBe("lazy");
    }
    for (const documentPath of [
      "/cv_ezequiel.pdf",
      "/cv-es.pdf",
      "/cv-en.pdf",
      "/ingles_certificado.pdf",
      "/freecodecamp.pdf",
      "/coderhause.pdf",
    ]) {
      const response = await page.request.get(documentPath);
      expect(response.ok(), `${documentPath} should be served`).toBeTruthy();
    }
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await test.info().attach(`axe-${locale.lang}.json`, {
      body: JSON.stringify(accessibility, null, 2),
      contentType: "application/json",
    });
    await page.locator("#dark-toggle").click();
    const darkAccessibility = await new AxeBuilder({ page }).analyze();
    expect(darkAccessibility.violations).toEqual([]);
    await page.locator("#dark-toggle").click();
  }

  await expect(page.getByText("English translation draft", { exact: false })).toHaveCount(0);
});

test("keeps internal links valid in Spanish and English", async ({ page }) => {
  for (const path of ["/", "/en/"]) {
    await page.goto(path);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));

    for (const href of links) {
      const url = new URL(href);
      if (url.origin === new URL(page.url()).origin) {
        if (url.hash) {
          const targetId = decodeURIComponent(url.hash.slice(1));
          expect(
            await page.evaluate((id) => document.getElementById(id) !== null, targetId),
            `${path} contains a link to missing target ${url.hash}`,
          ).toBeTruthy();
        } else {
          const response = await page.request.get(`${url.pathname}${url.search}`);
          expect(response.ok(), `${path} contains a broken internal link: ${href}`).toBeTruthy();
        }
      } else {
        expect(["https:", "mailto:"], `${path} contains an unsupported link: ${href}`).toContain(
          url.protocol,
        );
      }
    }
  }
});

test("shows the supplied skills and keeps the marquee in one row on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const skill of [
    "Kotlin",
    "Java",
    "Dart",
    "Flutter",
    "Jetpack Compose",
    "Android SDK",
    "MVVM",
    "Clean Architecture",
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "Python",
    "FastAPI",
    "Node.js",
    "APIs REST",
    "PostgreSQL",
    "MySQL",
    "Room",
    "Git / GitHub",
    "Docker",
    "Linux / Ubuntu",
    "Gradle",
    "Android Studio",
    "Visual Studio Code",
  ]) {
    await expect(page.locator(".skills-text")).toContainText(skill);
  }

  const row = await page
    .locator(".marquee-group")
    .first()
    .evaluate((group) => {
      const icons = [...group.querySelectorAll("img")].map((icon) => icon.getBoundingClientRect());
      return {
        tops: icons.map((icon) => icon.top),
        maxHeight: Math.max(...icons.map((icon) => icon.height)),
        height: group.getBoundingClientRect().height,
        scrollWidth: group.scrollWidth,
        clientWidth: group.clientWidth,
      };
    });
  expect(Math.max(...row.tops) - Math.min(...row.tops)).toBeLessThanOrEqual(1);
  expect(row.height).toBeLessThanOrEqual(row.maxHeight + 1);
  expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
  await page.goto("/en/");
  await expect(page.locator(".skills-text")).toContainText("Mobile development:");
  await expect(page.locator(".skills-text")).toContainText("REST APIs");
});

test("advances one section per small wheel scroll on desktop and mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("main")).toHaveCSS("scroll-snap-type", "y");
    await page.mouse.move(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
    await page.mouse.wheel(0, 120);
    await expect
      .poll(() => page.locator("main").evaluate((main) => main.scrollTop))
      .toBeGreaterThan(0);
    await expect(page.locator("#trabajos")).toBeInViewport();
    await expect
      .poll(async () => {
        const [sectionTop, headerBottom] = await Promise.all([
          page.locator("#trabajos").evaluate((section) => section.getBoundingClientRect().top),
          page.locator("header").evaluate((header) => header.getBoundingClientRect().bottom),
        ]);
        return Math.abs(sectionTop - headerBottom);
      })
      .toBeLessThan(2);
    const [sectionTop, headerBottom, nextSectionTop] = await Promise.all([
      page.locator("#trabajos").evaluate((section) => section.getBoundingClientRect().top),
      page.locator("header").evaluate((header) => header.getBoundingClientRect().bottom),
      page.locator("#acerca").evaluate((section) => section.getBoundingClientRect().top),
    ]);
    expect(Math.abs(sectionTop - headerBottom)).toBeLessThan(2);
    expect(nextSectionTop).toBeGreaterThanOrEqual(viewport.height - 1);
    if (viewport.width < 768) {
      await expect(page.locator("#trabajos")).toHaveCSS("scroll-snap-align", "none");
    }
  }
});

test("scrolls down through long sections to the footer, then back up without URL changes", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const sectionColors = await page
      .locator("main > .seccion")
      .evaluateAll((sections) =>
        sections.map((section) => getComputedStyle(section).backgroundColor),
      );
    await expect(page.locator("#background-canvas")).toHaveCSS("z-index", "0");
    await expect(page.locator("main")).toHaveCSS("z-index", "1");
    expect(sectionColors[0]).not.toBe("rgba(0, 0, 0, 0)");
    expect(sectionColors[0]).not.toBe(sectionColors[1]);
    expect(sectionColors.every((color) => color.startsWith("rgba("))).toBe(true);
    expect(
      sectionColors.every(
        (color) => Number.parseFloat(color.slice(color.lastIndexOf(",") + 1)) <= 0.6,
      ),
    ).toBe(true);
    await page.mouse.move(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
    for (let index = 0; index < 12; index += 1) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(450);
    }
    await expect(page.locator("#contacto")).toBeInViewport();
    await expect(page).toHaveURL("/");

    for (let index = 0; index < 12; index += 1) {
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(450);
    }
    await expect(page.locator("#inicio")).toBeInViewport();
    await expect(page).toHaveURL("/");
  }
});

test("supports keyboard navigation and a persistent accessible theme toggle", async ({ page }) => {
  await page.goto("/");
  const menuItem = page.locator(".menu-item");
  const menuToggle = page.locator(".menu-toggle");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(menuToggle).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#side-navigation a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(menuToggle).toBeFocused();
  await expect(menuItem).not.toHaveClass(/active/);
  await expect(page.locator("#side-navigation a").first()).toHaveAttribute("tabindex", "-1");

  await menuToggle.click();
  await page.locator("h1").click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");

  const themeToggle = page.locator("#dark-toggle");
  await expect(themeToggle).toHaveAttribute("aria-label", "Activar modo oscuro");
  await expect(themeToggle).toHaveText("🌙");
  await themeToggle.click();
  await expect(themeToggle).toHaveClass(/animate/);
  await expect(themeToggle).toHaveCSS("animation-name", "rotateIcon");
  await expect(page.locator("body")).toHaveClass(/dark-mode/);
  await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
  await expect(themeToggle).toHaveAttribute("aria-label", "Activar modo claro");
  await expect(themeToggle).toHaveText("☀️");
  await page.reload();
  await expect(page.locator("body")).toHaveClass(/dark-mode/);
});

test("preserves section and theme across language changes without replaying the intro", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#dark-toggle").click();
  await page.locator(".menu-toggle").click();
  await page.locator('#side-navigation a[href="#acerca"]').click();
  await expect(page).toHaveURL(/#acerca$/);

  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/en\/#acerca$/);
  await expect(page.locator("body")).toHaveClass(/dark-mode/);
  await expect(page.locator("#typewriter-text")).toHaveText("Hi! I'm Ezequiel...");
  await expect(page.locator("#acerca")).toBeInViewport();

  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/(?:#inicio)?$/);
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/#inicio$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("respects reduced motion for the typewriter, marquee, and section scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#typewriter-text")).toHaveText("Hola! soy Ezequiel...");
  await expect(page.locator(".marquee-content")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".marquee-group[aria-hidden=true]")).toBeHidden();
  await expect(page.locator("main")).toHaveCSS("scroll-snap-type", "none");
  const themeToggle = page.locator("#dark-toggle");
  await themeToggle.click();
  await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
  await expect(themeToggle).not.toHaveClass(/animate/);
  await expect(themeToggle).toHaveCSS("animation-name", "none");
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 120);
  await expect
    .poll(() => page.locator("main").evaluate((main) => main.scrollTop))
    .toBeGreaterThan(0);
});

test("scales the canvas to device pixels and adapts on resize", async ({
  browser,
  page: basePage,
}) => {
  await basePage.goto("/");
  const context = await browser.newContext({
    baseURL: new URL(basePage.url()).origin,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto("/");

  const canvasSize = () =>
    page.locator("#background-canvas").evaluate((canvas: HTMLCanvasElement) => ({
      cssWidth: canvas.getBoundingClientRect().width,
      cssHeight: canvas.getBoundingClientRect().height,
      pixelWidth: canvas.width,
      pixelHeight: canvas.height,
      ratio: devicePixelRatio,
    }));

  let dimensions = await canvasSize();
  expect(dimensions.pixelWidth).toBe(Math.round(dimensions.cssWidth * dimensions.ratio));
  expect(dimensions.pixelHeight).toBe(Math.round(dimensions.cssHeight * dimensions.ratio));
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect
    .poll(async () => (await canvasSize()).pixelWidth)
    .toBe(Math.round(1024 * dimensions.ratio));
  dimensions = await canvasSize();
  expect(dimensions.pixelHeight).toBe(Math.round(dimensions.cssHeight * dimensions.ratio));
  await context.close();
});

test("uses bounded pointer tracking on desktop and idle motion on touch", async ({
  browser,
  page: basePage,
}) => {
  await basePage.goto("/");
  const baseURL = new URL(basePage.url()).origin;
  const desktopContext = await browser.newContext({
    baseURL,
    viewport: { width: 1280, height: 800 },
  });
  const desktop = await desktopContext.newPage();
  await desktop.goto("/");
  const pupil = desktop.locator("#ojo-izq");
  const desktopStart = await pupil.evaluate((element: SVGCircleElement) => ({
    x: Number(element.getAttribute("cx")),
    y: Number(element.getAttribute("cy")),
  }));
  await desktop.evaluate(() =>
    window.dispatchEvent(
      new PointerEvent("pointermove", { pointerType: "mouse", clientX: 0, clientY: 0 }),
    ),
  );
  await desktop.waitForTimeout(300);
  const desktopEnd = await pupil.evaluate((element: SVGCircleElement) => ({
    x: Number(element.getAttribute("cx")),
    y: Number(element.getAttribute("cy")),
  }));
  const desktopMovement = Math.hypot(desktopEnd.x - desktopStart.x, desktopEnd.y - desktopStart.y);
  expect(desktopMovement).toBeGreaterThan(0);
  expect(desktopMovement).toBeLessThanOrEqual(6.001);
  await desktopContext.close();

  const touchContext = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto("/");
  await expect
    .poll(() => touchPage.evaluate(() => matchMedia("(pointer: coarse)").matches))
    .toBeTruthy();
  const touchPupil = touchPage.locator("#ojo-izq");
  await touchPage.waitForTimeout(300);
  const touchStart = await touchPupil.evaluate((element: SVGCircleElement) => ({
    x: Number(element.getAttribute("cx")),
    y: Number(element.getAttribute("cy")),
  }));
  await touchPage.evaluate(() =>
    window.dispatchEvent(
      new PointerEvent("pointermove", { pointerType: "touch", clientX: 0, clientY: 0 }),
    ),
  );
  await touchPage.waitForTimeout(300);
  const touchEnd = await touchPupil.evaluate((element: SVGCircleElement) => ({
    x: Number(element.getAttribute("cx")),
    y: Number(element.getAttribute("cy")),
  }));
  const touchMovement = Math.hypot(touchEnd.x - touchStart.x, touchEnd.y - touchStart.y);
  expect(touchMovement).toBeLessThan(2);
  await touchContext.close();
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
    await expect(page).toHaveURL(new RegExp(`${locale.target.replaceAll("/", "\\/")}#inicio$`));

    await page.evaluate(() => localStorage.removeItem("preferred-locale"));
    await page.goto(locale.path);
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(languageLink).toBeVisible();
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
