import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const netlifyDrawerFrame = 'iframe[title="Netlify Drawer"][src^="https://app.netlify.com/cdp/"]';

// Excluye únicamente el iframe del panel externo de Netlify durante el análisis axe.
function applicationAccessibility(page: Page): AxeBuilder {
  return new AxeBuilder({ page }).exclude(netlifyDrawerFrame);
}

// Recorre idiomas, recursos, metadatos, navegación y accesibilidad del sitio.
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
      expect(image.source).toMatch(/(?:\.webp|project-placeholder\.svg)$/);
      if (image.source?.includes("project-placeholder.svg")) {
        expect(image.width).toBe("1200");
        expect(image.height).toBe("750");
      }
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
    const accessibility = await applicationAccessibility(page).analyze();
    expect(accessibility.violations).toEqual([]);
    await test.info().attach(`axe-${locale.lang}.json`, {
      body: JSON.stringify(accessibility, null, 2),
      contentType: "application/json",
    });
    await page.locator("#dark-toggle").click();
    const darkAccessibility = await applicationAccessibility(page).analyze();
    expect(darkAccessibility.violations).toEqual([]);
    await page.locator("#dark-toggle").click();
  }

  await expect(page.getByText("English translation draft", { exact: false })).toHaveCount(0);
});

// Verifica que cada enlace interno y recurso apunte a una ruta servida por la aplicación.
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

// Detecta errores JavaScript al cambiar entre las dos páginas de idioma.
test("switches language without browser runtime errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/en\/#inicio$/);
  expect(pageErrors).toEqual([]);
});

// Comprueba las habilidades declaradas y que la marquesina no desborde en móvil.
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

// Garantiza que un gesto corto avance exactamente una sección en ambos formatos.
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

// Comprueba el recorrido por secciones largas en ambas direcciones, sin alterar la URL.
test("scrolls down through long sections to the footer, then back up without URL changes", async ({
  page,
}) => {
  test.setTimeout(60_000);
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
        (color) => Number.parseFloat(color.slice(color.lastIndexOf(",") + 1)) <= 0.4,
      ),
    ).toBe(true);
    await page.mouse.move(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
    const isInViewport = (selector: string): Promise<boolean> =>
      page.locator(selector).evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      });
    for (let index = 0; index < 30; index += 1) {
      if (await isInViewport("#contacto")) {
        break;
      }
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(450);
    }
    await expect(page.locator("#contacto")).toBeInViewport();
    await expect(page).toHaveURL("/");

    for (let index = 0; index < 30; index += 1) {
      if (await isInViewport("#inicio")) {
        break;
      }
      await page.mouse.wheel(0, -600);
      await page.waitForTimeout(450);
    }
    await expect(page.locator("#inicio")).toBeInViewport();
    await expect(page).toHaveURL("/");
  }
});

// Valida el menú con teclado y el estado persistente y accesible del tema.
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

test("keeps the animated menu within mobile, tablet, and desktop viewports", async ({ page }) => {
  const menuToggle = page.locator(".menu-toggle");
  const panel = page.locator("#side-navigation");

  await page.goto("/");
  for (const width of [320, 390, 768, 1366]) {
    await page.setViewportSize({ width, height: 800 });
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveCSS("transition-property", "transform, opacity");

    const bounds = await panel.boundingBox();
    if (!bounds) {
      throw new Error(`El panel del menú no tiene límites visibles a ${width}px.`);
    }
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );

    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  }
});

// Comprueba el color calculado de lentes y pupilas en ambos temas.
test("adapts the glasses and eyes color to the selected theme", async ({ page }) => {
  await page.goto("/");
  const glasses = page.locator(".personaje rect");
  const eyes = page.locator(".personaje circle");
  const mustache = page.locator(".personaje path");

  await expect(glasses).toHaveCount(2);
  await expect(eyes).toHaveCount(2);
  await expect(mustache).toHaveCount(1);
  await expect(mustache).toHaveAttribute("fill", "currentColor");
  await expect.poll(() => mustache.evaluate((element) => element.getBBox().y)).toBeGreaterThan(73);
  await expect.poll(() => mustache.evaluate((element) => element.getBBox().x)).toBeLessThan(100);
  await expect
    .poll(() =>
      mustache.evaluate((element) => {
        const bounds = element.getBBox();
        return bounds.x + bounds.width;
      }),
    )
    .toBeGreaterThan(100);
  for (const [theme, expectedColor] of [
    ["claro", "rgb(17, 17, 17)"],
    ["oscuro", "rgb(245, 245, 245)"],
  ] as const) {
    if (theme === "oscuro") {
      await page.locator("#dark-toggle").click();
    }
    for (const [elements, property] of [
      [glasses, "stroke"],
      [eyes, "fill"],
      [mustache, "fill"],
    ] as const) {
      for (const element of await elements.all()) {
        await expect(element).toHaveCSS(property, expectedColor);
      }
    }
  }
});

test("blinks both pupils around their moving centers", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Fuerza el intervalo mínimo solo en esta prueba; no cambia el comportamiento en producción.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenTransformChanges = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const svg = document.querySelector(".personaje svg");
        let changes = 0;
        const observer = new MutationObserver((mutations) => {
          changes += mutations.length;
        });
        observer.observe(svg!, {
          attributes: true,
          attributeFilter: ["transform"],
          subtree: true,
        });
        window.setTimeout(() => {
          observer.disconnect();
          resolve(changes);
        }, 5_200);
      }),
  );
  expect(hiddenTransformChanges).toBe(0);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const blinkState = page.evaluate(
    () =>
      new Promise<{ detected: boolean; centered: boolean }>((resolve) => {
        const pupils = [...document.querySelectorAll<SVGCircleElement>("#ojo-izq, #ojo-der")];
        const centers = pupils.map((pupil) => ({
          cx: pupil.cx.baseVal.value,
          cy: pupil.cy.baseVal.value,
        }));
        let offset = -2;
        const coordinateTimer = window.setInterval(() => {
          offset = offset === -2 ? 2 : -2;
          pupils.forEach((pupil, index) => {
            pupil.setAttribute("cx", String(centers[index].cx + offset));
            pupil.setAttribute("cy", String(centers[index].cy - offset));
          });
        }, 25);
        const observer = new MutationObserver(() => {
          const narrow = pupils.every((pupil) => {
            const transform = pupil.getAttribute("transform") ?? "";
            const scale = transform.match(/scale\(1 ([\d.e+-]+)\)/);
            return scale !== null && Number(scale[1]) < 0.2;
          });
          if (narrow) {
            const centered = pupils.every((pupil) => {
              const transform = pupil.getAttribute("transform") ?? "";
              const scale = transform.match(/scale\(1 ([\d.e+-]+)\)/);
              if (!scale) {
                return false;
              }
              const cx = pupil.cx.baseVal.value;
              const cy = pupil.cy.baseVal.value;
              return transform.startsWith(`translate(${cx} ${cy}) scale(1 ${scale[1]})`);
            });
            window.clearInterval(coordinateTimer);
            window.clearTimeout(timeout);
            observer.disconnect();
            resolve({ detected: true, centered });
          }
        });
        const timeout = window.setTimeout(() => {
          window.clearInterval(coordinateTimer);
          observer.disconnect();
          resolve({ detected: false, centered: false });
        }, 11_000);
        observer.observe(pupils[0].ownerSVGElement!, {
          attributes: true,
          attributeFilter: ["transform"],
          subtree: true,
        });
      }),
  );
  const observedBlink = await blinkState;
  expect(observedBlink.detected).toBe(true);
  expect(observedBlink.centered).toBe(true);
  expect(pageErrors).toEqual([]);
  await expect(page.locator("#ojo-izq")).not.toHaveAttribute("transform", /scale/);
  await expect(page.locator("#ojo-der")).not.toHaveAttribute("transform", /scale/);
});

test("does not blink when reduced motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const transformChanges = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const pupils = document.querySelector(".personaje svg");
        let changes = 0;
        const observer = new MutationObserver((mutations) => {
          changes += mutations.filter((mutation) => mutation.attributeName === "transform").length;
        });
        observer.observe(pupils!, {
          attributes: true,
          attributeFilter: ["transform"],
          subtree: true,
        });
        window.setTimeout(() => {
          observer.disconnect();
          resolve(changes);
        }, 9_500);
      }),
  );
  expect(transformChanges).toBe(0);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  const blinkAfterPreferenceChange = await page.evaluate(
    () =>
      new Promise<boolean>((resolve) => {
        const svg = document.querySelector(".personaje svg");
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((mutation) => mutation.attributeName === "transform")) {
            window.clearTimeout(timeout);
            observer.disconnect();
            resolve(true);
          }
        });
        const timeout = window.setTimeout(() => {
          observer.disconnect();
          resolve(false);
        }, 10_500);
        observer.observe(svg!, {
          attributes: true,
          attributeFilter: ["transform"],
          subtree: true,
        });
      }),
  );
  expect(blinkAfterPreferenceChange).toBe(true);
});

test("preserves tilt on desktop and keeps touch cards neutral", async ({ browser, page }) => {
  await page.goto("/");
  const card = page.locator(".about-card");
  await card.scrollIntoViewIfNeeded();
  const bounds = await card.boundingBox();
  if (!bounds) {
    throw new Error("La tarjeta de perfil no tiene límites visibles.");
  }
  await page.mouse.move(bounds.x + 1, bounds.y + 1);
  await expect
    .poll(() => card.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe("none");
  await page.mouse.move(0, 0);
  await expect
    .poll(() =>
      card.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return Math.abs(matrix.m11 - 1) + Math.abs(matrix.m22 - 1) + Math.abs(matrix.m33 - 1);
      }),
    )
    .toBeLessThan(0.01);

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(new URL("/", page.url()).toString());
  const touchCard = touchPage.locator(".about-card");
  await touchCard.scrollIntoViewIfNeeded();
  await touchPage.evaluate(() => {
    document.querySelector(".about-card")?.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerType: "touch",
        clientX: 10,
        clientY: 10,
      }),
    );
  });
  await expect
    .poll(() =>
      touchCard.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return Math.abs(matrix.m11 - 1) + Math.abs(matrix.m22 - 1) + Math.abs(matrix.m33 - 1);
      }),
    )
    .toBeLessThan(0.01);
  await touchContext.close();
});

// Conserva sección y tema al navegar entre idiomas y evita repetir la introducción.
test("preserves section and theme across language changes without replaying the intro", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await page.locator("#dark-toggle").click();
  await page.waitForTimeout(300);
  expect(pageErrors).toEqual([]);
  await page.locator(".menu-toggle").click();
  await page.locator('#side-navigation a[href="#acerca"]').click();
  await expect(page).toHaveURL(/#acerca$/);
  expect(pageErrors).toEqual([]);

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
  expect(pageErrors).toEqual([]);
});

// Respeta la preferencia de movimiento reducido en animaciones y desplazamiento.
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

// Comprueba la resolución del canvas en pantallas de alta densidad y al redimensionar.
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

// Verifica el seguimiento limitado del puntero y el movimiento idle táctil de los ojos.
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

// Recorre rutas e idiomas en viewports conocidos y comprueba que no haya desbordes.
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
