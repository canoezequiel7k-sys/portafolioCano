# Portafolio de Ezequiel Cano

Sitio estático ES/EN construido con Vite + TypeScript. La versión inglesa fue aprobada y ambas páginas son indexables.

## Requisitos

- Node.js 22.12+ (Vite 8) y npm.
- Para pruebas de navegador: `npx playwright install chromium`.

## Comandos

| Comando                      | Uso                                                                        |
| ---------------------------- | -------------------------------------------------------------------------- |
| `npm install`                | Instalar dependencias.                                                     |
| `npm run dev`                | Servidor local; español en `/`, inglés en `/en/`.                          |
| `npm run build`              | Generar páginas prerenderizadas y recursos en `dist/`.                     |
| `npm run preview`            | Probar el build localmente.                                                |
| `npm run typecheck`          | Comprobar TypeScript estricto.                                             |
| `npm run lint`               | Ejecutar ESLint.                                                           |
| `npm run format:check`       | Comprobar formato Prettier de los archivos mantenidos.                     |
| `npm run dependencies:check` | Verificar límites de capas.                                                |
| `npm test`                   | Ejecutar Vitest.                                                           |
| `npm run test:e2e`           | Humo bilingüe con Playwright y axe en Vite dev.                            |
| `npm run test:e2e:preview`   | Repetir humo contra el build servido por `vite preview`.                   |
| `npm run check`              | Ejecutar formato, tipos, lint, capas, unit tests, build y E2E dev/preview. |

## Contenido y documentación

Edita `src/content/profile.ts` para el perfil y `src/content/ui.ts` para interfaz/metadata. Cada texto narrativo debe incluir `es` y `en`; TypeScript verifica que no falte idioma. El contenido inglés fue aprobado el 2026-10-23.

Consulta [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md) y [docs/DECISIONS.md](./docs/DECISIONS.md).

La migración conserva por ahora `style.css`, `script.js`, `assets/` y los nombres actuales de PDF para no romper rutas existentes. No desplegar desde esta rama: Netlify usa `main` para producción.

La aplicación servida por Vite inicializa las interacciones desde `src/features/`; el `index.html` y `script.js` de la raíz se conservan juntos como entrada legacy independiente.

Netlify compila con `npm run build`, publica `dist/` y aplica cabeceras HTTP básicas desde `netlify.toml`. Los CV se sirven como `/cv-es.pdf` y `/cv-en.pdf`; `/cv_ezequiel.pdf` redirige al CV español para conservar enlaces antiguos.
