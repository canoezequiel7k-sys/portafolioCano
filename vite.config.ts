import { readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, UserConfig } from "vite";
import { escapeHtml, renderPage } from "./src/components/render-page.ts";
import { profile } from "./src/content/profile.ts";
import { ui } from "./src/content/ui.ts";
import { resolveLocale } from "./src/core/i18n/locale.ts";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const sourceRoot = resolve(projectRoot, "src");
const documents = new Set([
  "cv_ezequiel.pdf",
  "cv-es.pdf",
  "cv-en.pdf",
  "ingles_certificado.pdf",
  "freecodecamp.pdf",
  "coderhause.pdf",
]);
const configuredSiteUrl = (process.env.SITE_URL ?? process.env.URL)?.trim();
const siteUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : null;

// Solo acepta el origen HTTPS público; evita generar enlaces canónicos inválidos.
if (
  siteUrl &&
  (siteUrl.protocol !== "https:" || siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash)
) {
  throw new Error("SITE_URL must be the HTTPS origin of the public site, without a path.");
}

// El servidor estático no resuelve el "+" codificado en los nombres de algunos iconos.
const assetAliases = new Map([["assets/icons/cpp.svg", "assets/icons/c++.svg"]]);
const mimeTypes: Readonly<Record<string, string>> = {
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
// Redirige a la preferencia guardada antes del render, excepto a los rastreadores.
const localeBootstrap = `<script>
  (() => {
    try {
      const preferredLocale = localStorage.getItem("preferred-locale");
      const crawler = /bot|crawler|spider|slurp/i.test(navigator.userAgent);
      if (location.pathname === "/" && preferredLocale === "en" && !crawler) {
        location.replace(\`/en/\${location.search}\${location.hash}\`);
      }
    } catch (error) {
      console.warn("Could not read the saved language preference.", error);
    }
  })();
</script>`;
// Aplica el tema guardado antes de mostrar la página para evitar un destello visual.
const themeBootstrap = `<script>
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  } catch (error) {
    console.warn("Could not read the saved theme preference.", error);
  }
</script>`;

/** Genera metadatos sociales y SEO para una página del idioma indicado. */
function seoMetadata(locale: "es" | "en"): string {
  const description = profile.summary[locale];
  const currentPath = locale === "es" ? "/" : "/en/";
  const tags = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="author" content="Ezequiel Cano" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Ezequiel Cano" />`,
    `<meta property="og:title" content="${escapeHtml(ui[locale].pageTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:locale" content="${locale === "es" ? "es_AR" : "en_US"}" />`,
    `<meta property="og:locale:alternate" content="${locale === "es" ? "en_US" : "es_AR"}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ];

  if (siteUrl) {
    const canonical = new URL(currentPath, siteUrl).href;
    tags.push(
      `<link rel="canonical" href="${canonical}" />`,
      `<link rel="alternate" hreflang="es" href="${new URL("/", siteUrl).href}" />`,
      `<link rel="alternate" hreflang="en" href="${new URL("/en/", siteUrl).href}" />`,
      `<link rel="alternate" hreflang="x-default" href="${new URL("/", siteUrl).href}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:image" content="${new URL("/assets/images/foto-perfil.webp", siteUrl).href}" />`,
      `<meta property="og:image:alt" content="${escapeHtml(ui[locale].profilePhotoAlt)}" />`,
    );
  }

  return `<!--seo-meta-start-->\n${tags.join("\n")}\n<!--seo-meta-end-->`;
}

/** Crea el sitemap bilingüe cuando está configurado el origen público del sitio. */
function sitemap(): string {
  if (!siteUrl) {
    return "";
  }

  const spanishUrl = new URL("/", siteUrl).href;
  const englishUrl = new URL("/en/", siteUrl).href;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${spanishUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${spanishUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${spanishUrl}" />
  </url>
  <url>
    <loc>${englishUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${spanishUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${spanishUrl}" />
  </url>
</urlset>`;
}

/** Publica robots.txt y añade la URL del sitemap solo si existe un origen válido. */
function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${new URL("/sitemap.xml", siteUrl).href}\n` : ""}`;
}

/** Enumera recursivamente los recursos que deben copiarse al build. */
async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

/** Prerenderiza ambos idiomas y sirve los metadatos dinámicos durante el desarrollo. */
function localizedPages(): Plugin {
  return {
    name: "localized-prerender",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://vite.local").pathname;
        if (pathname === "/robots.txt") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end(robotsTxt());
          return;
        }
        if (pathname === "/sitemap.xml") {
          if (!siteUrl) {
            response.statusCode = 404;
            response.end("Set SITE_URL to generate sitemap.xml.");
            return;
          }
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/xml; charset=utf-8");
          response.end(sitemap());
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        const locale = resolveLocale(context.path);
        const page = html
          .replace('<html lang="es">', `<html lang="${locale}">`)
          .replace("<!--seo-meta-->", seoMetadata(locale))
          .replace("<!--locale-bootstrap-->", localeBootstrap)
          .replace("<!--theme-bootstrap-->", themeBootstrap)
          .replace("__PAGE_TITLE__", escapeHtml(ui[locale].pageTitle))
          .replace("<!--portfolio-body-->", renderPage(locale));
        return page;
      },
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const entry = Object.values(bundle).find(
          (output) => output.type === "asset" && output.fileName.endsWith(".html"),
        );
        if (!entry || entry.type !== "asset") {
          throw new Error("Vite did not emit the expected Spanish HTML entry.");
        }
        const spanishHtml =
          typeof entry.source === "string"
            ? entry.source
            : Buffer.from(entry.source).toString("utf8");
        const moduleScript = spanishHtml.match(/<script type="module"[^>]*><\/script>/)?.[0];
        if (!moduleScript) {
          throw new Error("The generated Spanish page has no bundled module script.");
        }
        const englishHtml = spanishHtml
          .replace('<html lang="es">', '<html lang="en">')
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(ui.en.pageTitle)}</title>`)
          .replace(/<!--seo-meta-start-->[\s\S]*?<!--seo-meta-end-->/, seoMetadata("en"))
          .replace(
            /<body>[\s\S]*?<\/body>/,
            `<body>\n${themeBootstrap}\n${renderPage("en")}\n${moduleScript}\n</body>`,
          );
        this.emitFile({
          type: "asset",
          fileName: "en/index.html",
          source: englishHtml,
        });
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: robotsTxt(),
        });
        if (siteUrl) {
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: sitemap(),
          });
        }
      },
    },
  };
}

/** Expone los recursos existentes en dev y los copia al directorio final del build. */
function existingAssets(): Plugin {
  return {
    name: "copy-existing-public-assets",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent(
          new URL(request.url ?? "/", "http://vite.local").pathname,
        );
        const assetPath = pathname.startsWith("/assets/")
          ? pathname.slice(1)
          : documents.has(pathname.slice(1))
            ? pathname.slice(1)
            : null;
        if (!assetPath) {
          next();
          return;
        }
        const filePath = resolve(projectRoot, assetAliases.get(assetPath) ?? assetPath);
        const relativePath = relative(projectRoot, filePath);
        if (relativePath.startsWith(`..${sep}`) || relativePath === "..") {
          response.statusCode = 400;
          response.end("Invalid asset path.");
          return;
        }
        readFile(filePath).then((content) => {
          response.statusCode = 200;
          response.setHeader(
            "Content-Type",
            mimeTypes[extname(filePath)] ?? "application/octet-stream",
          );
          response.end(content);
        }, next);
      });
    },
    async generateBundle() {
      const assetFiles = await listFiles(resolve(projectRoot, "assets"));
      const documentFiles = [...documents].map((name) => resolve(projectRoot, name));
      for (const filePath of [...assetFiles, ...documentFiles]) {
        this.emitFile({
          type: "asset",
          fileName: relative(projectRoot, filePath).split(sep).join("/"),
          source: await readFile(filePath),
        });
      }
      for (const [fileName, sourcePath] of assetAliases) {
        this.emitFile({
          type: "asset",
          fileName,
          source: await readFile(resolve(projectRoot, sourcePath)),
        });
      }
    },
  };
}

const config: UserConfig = {
  root: sourceRoot,
  publicDir: false,
  plugins: [localizedPages(), existingAssets()],
  server: {
    fs: {
      allow: [projectRoot],
    },
  },
  build: {
    outDir: resolve(projectRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(sourceRoot, "index.html"),
    },
  },
};

export default config;
