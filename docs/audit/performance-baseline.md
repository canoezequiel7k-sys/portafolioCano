# Rendimiento: medición disponible

## Alcance

Medición del build local, no del sitio publicado. Recuperé la línea base de Fase 0 del commit `f6ff408`:

- Lighthouse publicado: **NO VERIFICADO**, porque no había URL pública.
- Canvas: ~180 callbacks/s de `requestAnimationFrame` en Chromium 150.0.7871.250; CPU **NO VERIFICADO**.

La medición actual usa Chromium 156 y CDP; el método y el equipo no son equivalentes, por lo que no presento una comparación numérica de FPS/CPU como mejora o regresión.

## Lighthouse local

- Fecha: 2026-10-22.
- Entorno: Chromium 156.0.8078.4, build de producción servido en `127.0.0.1:4200`.
- Lighthouse: 13.5.0. URL canónica de prueba: `https://portfolio.example`; no corresponde a un sitio real.
- Móvil: rendimiento 98, accesibilidad 100, prácticas recomendadas 100, SEO 100; FCP 1.1 s, LCP 1.9 s, Speed Index 1.6 s, TBT 140 ms, CLS 0.001.
- Escritorio: rendimiento 100, accesibilidad 100, prácticas recomendadas 100, SEO 100; FCP 0.3 s, LCP 0.4 s, Speed Index 0.4 s, TBT 0 ms, CLS 0.001.
- El informe móvil estima 27 KiB de ahorro adicional en entrega de imágenes. Estos resultados locales no sustituyen una medición en el hosting.
- Después se bajó a `0.58` la opacidad de los paneles claros para hacer más visibles las partículas; la regresión de fondos pasó en desarrollo y preview. Lighthouse no se repitió tras este ajuste visual.

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

## Pendiente de comparación

La comparación Lighthouse de producción sigue **NO VERIFICADA**: falta una URL pública. No se extrapolan estos números locales a producción. El canvas en pestaña oculta tampoco pudo medirse de forma válida en Chromium headless.
