# Rendimiento: medición disponible

## Alcance

La medición local del 2026-10-22 no corresponde al sitio publicado. Al inicio de Fase 0, Lighthouse publicado quedó **NO VERIFICADO** porque no se había proporcionado una URL pública:

- La línea base de Fase 0 se recuperó del commit `f6ff408`.
- Canvas: ~180 callbacks/s de `requestAnimationFrame` en Chromium 150.0.7871.250; CPU **NO VERIFICADO**.

La medición local del 2026-10-22 no es comparable directamente con la observación inicial de Fase 0. La comparación controlada con `legacy-v1`, usando el mismo navegador y método para ambas versiones, está documentada más abajo.

## Lighthouse local

- Fecha: 2026-10-22.
- Entorno: Chromium 156.0.8078.4, build de producción servido en `127.0.0.1:4200`.
- Lighthouse: 13.5.0. URL canónica de prueba: `https://portfolio.example`; no corresponde a un sitio real.
- Móvil: rendimiento 98, accesibilidad 100, prácticas recomendadas 100, SEO 100; FCP 1.1 s, LCP 1.9 s, Speed Index 1.6 s, TBT 140 ms, CLS 0.001.
- Escritorio: rendimiento 100, accesibilidad 100, prácticas recomendadas 100, SEO 100; FCP 0.3 s, LCP 0.4 s, Speed Index 0.4 s, TBT 0 ms, CLS 0.001.
- El informe móvil estima 27 KiB de ahorro adicional en entrega de imágenes. Estos resultados locales no sustituyen una medición en el hosting.
- Después se bajó a `0.58` la opacidad de los paneles claros para hacer más visibles las partículas; la regresión de fondos pasó en desarrollo y preview. La medición de producción posterior a ese ajuste está en la sección correspondiente.

## Canvas

Pruebas de 2.75–3 segundos por escenario, misma instancia de Chromium. Escritorio: 1280 × 800; móvil táctil simulado: 390 × 844. FPS proviene de `requestAnimationFrame`; CPU es una estimación del tiempo de tareas/JavaScript del renderer vía CDP, no el uso total del equipo.

| Escenario                                 |               FPS | Renderer: tareas | JavaScript |
| ----------------------------------------- | ----------------: | ---------------: | ---------: |
| Reposo                                    |                60 |             9.3% |       0.6% |
| Puntero en movimiento                     |              60.3 |            12.3% |       1.2% |
| Resize repetido                           |                60 |            12.6% |       1.5% |
| Reposo móvil simulado (390 × 844, táctil) |                60 |             8.5% |       1.0% |
| Resize móvil simulado                     |                60 |            10.9% |       1.2% |
| Segundo plano                             | **NO VERIFICADO** |                — |          — |

El navegador headless mantuvo `document.visibilityState === "visible"` al cambiar de pestaña, así que esa prueba no representa una pestaña realmente oculta.

## Recursos PDF

Se mantuvieron las rutas y nombres originales. MuPDF recomprimió imágenes a calidad 90; el texto extraído y el número de páginas se conservaron, con diferencia media de píxeles inferior a 0.7/255 en la validación renderizada.

| Archivo                  |       Antes |   Después | Reducción |
| ------------------------ | ----------: | --------: | --------: |
| `coderhause.pdf`         | 1,603,412 B | 130,768 B |     91.8% |
| `cv_ezequiel.pdf`        |   101,243 B |  89,382 B |     11.7% |
| `freecodecamp.pdf`       |   368,201 B | 246,951 B |     32.9% |
| `ingles_certificado.pdf` |    60,524 B |  36,175 B |     40.2% |

## Comparación reproducible con `legacy-v1`

- Fecha: 2026-10-23. Referencia: tag remoto `legacy-v1` (commit `b5c55fc`); comparativo: build actual de `phase-3-interactions` (`da0ec13`).
- Ambos sitios se sirvieron en localhost y se midieron con Lighthouse 13.5.0 y Chromium 156.0.8078.4, con throttling simulado. Una corrida por perfil; no son umbrales de aceptación.
- El build actual se generó temporalmente con `SITE_URL=https://portafolio-cano.netlify.app`; los artefactos temporales quedaron fuera del repositorio.

| Perfil | Versión | Rendimiento | Accesibilidad | Prácticas | SEO | FCP | LCP | Speed Index | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Móvil | `legacy-v1` | 100 | 100 | 96 | 91 | 0.9 s | 1.4 s | 1.2 s | 0 ms | 0 |
| Móvil | Actual | 96 | 100 | 100 | 100 | 1.4 s | 2.7 s | 3.1 s | 60 ms | 0.001 |
| Escritorio | `legacy-v1` | 100 | 95 | 96 | 91 | 0.3 s | 0.4 s | 0.4 s | 0 ms | 0.001 |
| Escritorio | Actual | 100 | 100 | 100 | 100 | 0.3 s | 0.6 s | 0.7 s | 30 ms | 0.001 |

La puntuación de rendimiento móvil del build actual fue menor que la del snapshot legado en esta corrida; en escritorio se mantuvo en 100. No se declara aprobado/reprobado: el plan exige acordar objetivos después de medirlos. La línea base local anterior del 2026-10-22 no equivale a una medición histórica en producción.

Ezequiel indicó el 2026-10-23 que no fijará umbrales todavía; G4 permanece abierto hasta acordar criterios basados en estas mediciones.

## Producción medida

- URL: `https://portafolio-cano.netlify.app/`; lectura HTTP satisfactoria el 2026-10-23. El HTML publicado referencia los mismos nombres de bundles JS/CSS que el build local.
- Lighthouse 13.5.0, Chromium 156.0.8078.4, throttling simulado; un informe móvil y uno de escritorio. No se modificó el hosting.

| Perfil | Rendimiento | Accesibilidad | Prácticas | SEO | FCP | LCP | Speed Index | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Móvil | 97 | 100 | 100 | 100 | 1.3 s | 1.5 s | 4.4 s | 60 ms | 0.001 |
| Escritorio | 100 | 100 | 100 | 100 | 0.4 s | 0.4 s | 0.6 s | 0 ms | 0.001 |

Las métricas de producción y localhost se mantienen separadas por sus condiciones de red y hosting. No se extrapola una puntuación a otra.

## Comparación de canvas con `legacy-v1`

Medición local en Chromium 156.0.8078.4, viewport 1280 × 800, muestras de 2.5 s. FPS se contó con `requestAnimationFrame`; CPU del renderer y JavaScript son estimaciones por diferencias de `TaskDuration` y `ScriptDuration` vía CDP.

| Escenario | FPS legado | FPS actual | Renderer legado | Renderer actual | JS legado | JS actual |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Reposo | 60.4 | 60.2 | 13.5% | 14.2% | 1.5% | 0.9% |
| Puntero | 60.2 | 60.3 | 15.3% | 19.8% | 1.9% | 1.8% |
| Resize | 60.2 | 60.2 | 16.7% | 20.6% | 3.3% | 2.7% |

Son mediciones puntuales, no promedios ni objetivos acordados. El escenario en segundo plano sigue **NO VERIFICADO**: Chromium headless mantuvo `document.visibilityState === "visible"`.
