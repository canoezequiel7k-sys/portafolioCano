# Línea base de rendimiento

## Lighthouse del sitio publicado

**NO VERIFICADO:** falta URL pública y proveedor. El único sitio disponible para esta auditoría es `file:///C:/Users/SystemAncestral/Documents/portfolio/index.html`; no equivale a una medición Lighthouse desplegada y no se asignan puntuaciones.

Cuando Ezequiel comparta URL, registrar URL exacta, fecha, versión de Lighthouse/Chrome, móvil o escritorio, configuración de throttling, puntuaciones y diagnósticos. Comparar el resultado con el mismo método al final de Fase 4.

## Canvas local

Se abrió la copia local en Chromium 150.0.7871.250 / Code 1.143.0 en Windows. Una muestra de `requestAnimationFrame` durante 1,1 s contó 199 callbacks (~180 callbacks/s) en tres condiciones: pestaña visible en reposo, puntero moviéndose y después de resize. Es una muestra de callbacks del navegador, no perfil de CPU ni garantía de FPS en producción.

| Condición | Resultado verificable | Límite |
|---|---|---|
| Reposo, página visible | ~180 callbacks/s de rAF | No se midió CPU ni se aisló la carga del canvas |
| Con puntero | ~180 callbacks/s de rAF | Movimiento sintético/local; no perfila CPU |
| Después de resize | ~180 callbacks/s de rAF | La implementación reinicializa partículas en `resize` |
| Pestaña en segundo plano | **NO VERIFICADO** | No se pudo cambiar de forma controlada la visibilidad de la pestaña dentro de esta medición |
| CPU | **NO VERIFICADO** | Este entorno no expone perfil porcentual de CPU |
| Lighthouse de canvas | **NO VERIFICADO** | Sin URL de publicación; no se reporta métrica de laboratorio como si fuera campo |

Código fuente confirmado: 180 partículas; se llama a `getComputedStyle(document.body)` desde `draw()` para cada partícula; la animación no consulta `document.visibilityState`; el backing canvas recibe `innerWidth/innerHeight` sin multiplicar por `devicePixelRatio`; el resize vacía/recrea el array. Puede intentarse medir el coste en DevTools Performance con grabación de CPU, FPS y cambio de pestaña en la versión publicada y en un equipo/dispositivo acordado.

## Cómo completar las mediciones

1. Ezequiel proporciona URL, proveedor, dominio y confirma si se permite medir la web pública (sin publicar cambios).
2. Ejecutar Lighthouse móvil y escritorio sobre la URL desplegada, guardando configuración y resultados para repetición posterior.
3. En DevTools Performance, grabar canvas visible en reposo, durante movimiento de puntero y durante resize; registrar FPS/frames dropped y CPU con las mismas condiciones.
4. Cambiar a otra pestaña durante la grabación, verificar pausa/reducción de trabajo y medir reanudación. Registrar equipo, resolución, DPR, navegador y versión.
5. Repetir en dispositivo móvil real cuando la Fase 3 implemente alternativa táctil.

No hay capturas persistidas en `docs/audit/screenshots/`: el navegador integrado permitió ejecutar tamaños y consultar DOM, pero no exportar archivos de imagen a una ruta del workspace.
