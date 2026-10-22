import { readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, UserConfig } from "vite";
import { escapeHtml, renderPage } from "./src/components/render-page.ts";
import { ui } from "./src/content/ui.ts";
import { resolveLocale } from "./src/core/i18n/locale.ts";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const sourceRoot = resolve(projectRoot, "src");
const documents = new Set([
  "cv_ezequiel.pdf",
  "ingles_certificado.pdf",
  "freecodecamp.pdf",
  "coderhause.pdf",
]);
// Browsers percent-encode "+" in URLs, which the static preview server does not resolve.
const assetAliases = new Map([["assets/icons/cpp.svg", "assets/icons/c++.svg"]]);
const mimeTypes: Readonly<Record<string, string>> = {
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

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

function localizedPages(): Plugin {
  return {
    name: "localized-prerender",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        const locale = resolveLocale(context.path);
        const page = html
          .replace('<html lang="es">', `<html lang="${locale}">`)
          .replace("__PAGE_TITLE__", escapeHtml(ui[locale].pageTitle))
          .replace("<!--portfolio-body-->", renderPage(locale));
        return locale === "en"
          ? page.replace("</head>", '<meta name="robots" content="noindex, nofollow" /></head>')
          : page;
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
          .replace(
            /<body>[\s\S]*?<\/body>/,
            `<body>\n${renderPage("en")}\n${moduleScript}\n</body>`,
          )
          .replace("</head>", '<meta name="robots" content="noindex, nofollow" /></head>');
        this.emitFile({
          type: "asset",
          fileName: "en/index.html",
          source: englishHtml,
        });
      },
    },
  };
}

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
