# Arquitectura

## Estado de Fase 1

Aplicación estática sin framework UI. Vite sirve y compila el documento; TypeScript estricto comprueba los datos localizados y las funciones de presentación. `vite.config.ts` prerenderiza `/` (ES) y emite `/en/` (EN aprobado) desde el mismo renderer puro. Los assets y PDF existentes se sirven durante el desarrollo y se copian al build sin mover el original.

## Capas

- `src/content/`: perfil y textos de interfaz; tipos localizados obligan ES y EN en cada campo. No depende del DOM.
- `src/components/`: `renderPage(locale)` construye HTML a partir del contenido y no lee `window` ni `document`.
- `src/core/i18n/`: resolución pura de locale y lectura de traducciones.
- `src/features/`: interacciones aisladas con contrato `initialize(root) => cleanup`; cada módulo libera listeners, observers, rAF y animaciones.
- `src/styles/`: tokens, layout responsive y estilos propios de las interacciones.
- `src/main.ts`: inicializa las features y registra su limpieza para HMR. El `index.html` de la raíz permanece como entrada legacy; Vite sirve `src/`.
- `vite.config.ts`: rutas de desarrollo, prerender por idioma y emisión de recursos estáticos.

## Build e idioma

`npm run dev` sirve español en `/` e inglés en `/en/`. `npm run build` produce `dist/index.html`, `dist/en/index.html`, bundle JS/CSS, assets optimizados, favicon y los PDF. El contenido inglés fue aprobado y ambas páginas son indexables. No existe redirección automática por idioma.

Los metadatos localizados se generan con el build. `SITE_URL` establece el origen HTTPS canónico; en Netlify se usa `URL` como respaldo. Sin ambas variables, canonical, alternates, `og:url`, `sitemap.xml` y su referencia en `robots.txt` se omiten.

El renderer comparte IDs y estructura de secciones entre ambos locales. Los recursos usan rutas desde la raíz para que funcionen también bajo `/en/`. El selector conserva sección y tema; la preferencia de idioma solo se guarda tras una elección explícita y la redirección de `/` excluye crawlers. La intro no se repite al cambiar de idioma. El contenido inglés fue aprobado y se indexa.

## Calidad y ciclo de vida

ESLint, Prettier, `tsc --noEmit`, dependency-cruiser, Vitest y Playwright + axe tienen comandos separados. Playwright prueba tanto Vite dev como el build servido por `vite preview`. El canvas pausa en segundo plano, escala por `devicePixelRatio` y mantiene sus partículas al redimensionar. Las animaciones respetan `prefers-reduced-motion`; el cambio de tema usa View Transitions con fallback normal y el cambio de idioma usa navegación nativa para evitar errores de transición entre documentos.

Las pruebas E2E comprueban ambos idiomas, metadatos y rutas, imágenes con dimensiones/alt/carga diferida, los ocho viewports, accesibilidad axe en temas claro y oscuro, skip-link, navegación por teclado, persistencia de tema/idioma, cambio de idioma conservando sección, typewriter, marquee, puntero y táctil, reduced motion y dimensiones del canvas.

## Archivos principales

- Configuración: `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `.dependency-cruiser.cjs`.
- Hosting: `netlify.toml` define el build, `dist/` como salida, cabeceras HTTP básicas y la redirección 301 del CV anterior a `/cv-es.pdf`. Los CV actuales se publican en `/cv-es.pdf` y `/cv-en.pdf`.
- Contenido: `src/content/profile.ts`, `src/content/ui.ts`.
- Renderizado y locale: `src/components/render-page.ts`, `src/core/i18n/locale.ts`.
- Pruebas: `src/**/*.test.ts`, `tests/e2e/`.
