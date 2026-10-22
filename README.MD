# Portafolio de Ezequiel Cano

Sitio estático ES/EN en migración a Vite + TypeScript. El inglés es un borrador no aprobado: `/en/` se genera con `noindex,nofollow` hasta recibir aprobación.

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

Edita `src/content/profile.ts` para el perfil y `src/content/ui.ts` para interfaz/metadata. Cada texto narrativo debe incluir `es` y `en`; TypeScript verifica que no falte idioma. El contenido inglés no está aprobado para publicación.

Consulta [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md) y [docs/DECISIONS.md](./docs/DECISIONS.md).

La migración conserva por ahora `style.css`, `script.js`, `assets/` y los nombres actuales de PDF para no romper rutas existentes. No desplegar desde esta rama: Netlify usa `main` para producción.
