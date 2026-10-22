# Arquitectura

## Estado de Fase 1

Aplicación estática sin framework UI. Vite sirve y compila el documento; TypeScript estricto comprueba los datos localizados y las funciones de presentación. `vite.config.ts` prerenderiza `/` (ES) y emite `/en/` (EN borrador) desde el mismo renderer puro. Los assets y PDF existentes se sirven durante el desarrollo y se copian al build sin mover el original.

## Capas

- `src/content/`: perfil y textos de interfaz; tipos localizados obligan ES y EN en cada campo. No depende del DOM.
- `src/components/`: `renderPage(locale)` construye HTML a partir del contenido y no lee `window` ni `document`.
- `src/core/i18n/`: resolución pura de locale y lectura de traducciones.
- `src/features/`: destino para interacciones aisladas. La página conserva temporalmente `script.js` legacy hasta su migración planificada en Fase 3.
- `src/styles/`: tokens, temas base y layout responsive; el CSS legacy sigue cargándose como base visual.
- `src/main.ts`: punto de entrada; conecta los estilos y el comportamiento legacy.
- `vite.config.ts`: rutas de desarrollo, prerender por idioma y emisión de recursos estáticos.

## Build e idioma

`npm run dev` sirve español en `/` e inglés en `/en/`. `npm run build` produce `dist/index.html`, `dist/en/index.html`, bundle JS/CSS, `assets/` y los cuatro PDF. Los documentos EN llevan `noindex,nofollow` y un aviso de borrador hasta aprobación editorial. No existe redirección automática por idioma.

El renderer comparte IDs y estructura de secciones entre ambos locales. Los recursos usan rutas desde la raíz para que funcionen también bajo `/en/`. El selector de idioma usa enlaces HTML reales entre `/` y `/en/`; navegación avanzada que conserva tema/ancla queda para Fase 3. SEO completo queda para Fase 4.

## Calidad y ciclo de vida

ESLint, Prettier, `tsc --noEmit`, dependency-cruiser, Vitest y Playwright + axe tienen comandos separados. Playwright prueba tanto Vite dev como el build servido por `vite preview`. El contrato para cada feature nueva es `initialize(root) => cleanup`: retirar listeners, observers, rAF y timelines al limpiar. El script legacy aún no cumple ese contrato y se migrará en Fase 3; no se presenta como ya resuelto.

La prueba E2E recorre ambos idiomas en los ocho viewports definidos para detectar desbordamiento horizontal del header y del contenedor de scroll principal.

## Archivos principales

- Configuración: `package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `.dependency-cruiser.cjs`.
- Contenido: `src/content/profile.ts`, `src/content/ui.ts`.
- Renderizado y locale: `src/components/render-page.ts`, `src/core/i18n/locale.ts`.
- Pruebas: `src/**/*.test.ts`, `tests/e2e/`.
