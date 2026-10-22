# Matriz de regresión

Los comportamientos esperados derivan de la sección 8 del plan v3. “Actual” se basa en el código, salvo donde se indica prueba de navegador. No se da por ejecutada una prueba solo por estar descrita.

| # | Comportamiento a preservar | Actual en esta copia | Esperado | Pasos de verificación |
|---:|---|---|---|---|
| 1 | Menú: abrir/cerrar, cerrar fuera, navegar | Click en `Menu ☰` alterna `.active`; cierra fuera y al elegir ancla. Apertura/cierre fuera se ejecutaron en Chromium y funcionaron. | Además teclado/foco completos, cierre Escape, enlaces no enfocables ocultos y destino sin doble salto. | Tab hasta menú; Enter/Espacio; comprobar estado accesible; tabular dentro; Escape; click fuera; elegir cada sección; comprobar URL, scroll y título visible. |
| 2 | Reveal de secciones y tarjetas; stagger 150 ms | Listener de `main` marca sección al cruzar centro y agenda `i*150` ms para `.proyecto`; hace reevaluación al iniciar y por scroll. | Reveal al entrar, stagger 150 ms, sin temporizadores repetidos, con movimiento reducido. | Registrar entrada/salida de cada sección; verificar cada tarjeta y tiempos; hacer scroll rápido/repetido y volver; probar `prefers-reduced-motion`. |
| 3 | Canvas: 180 partículas, rebote, repulsión y color por tema | 180; invierte velocidad en bordes; repulsión a <100 px; color de CSS consultado por partícula y frame; resize recrea partículas; no pausa en pestaña oculta ni ajusta DPR. | Mantener cantidad, rebote, repulsión y color; medir y optimizar color/DPR/resize; pausar al ocultar; sin NaN. | Contar partículas en debug; mover puntero, tema y bordes; medir perfil; resize repetido; verificar DPR; ocultar/volver a la pestaña; revisar consola/estado. |
| 4 | Pupilas siguen mouse, máximo 6 unidades SVG | `mousemove` global, máximo 6; no alternativa táctil deliberada. | Mantener máximo 6 en desktop y aplicar una de las opciones táctiles aprobadas. | Mover puntero a extremos y centro; medir centros SVG; probar toque en móvil real tras decidir alternativa; mover/reducir movimiento. |
| 5 | Tilt: intensidad 8 en About y 12 en Certificaciones | Llamadas `addTiltEffect(aboutCard, 8)` y `(..., 12)`; listeners mousemove/leave. | Mismas intensidades; sin conflicto de `transform`, alternativa táctil aprobada y limpieza de listeners. | Mover puntero por el centro/esquinas de ambas tarjetas; salir; verificar grados, reset y layout; probar táctil y reinicialización. |
| 6 | Tema oscuro persistente, transición e icono | Toggle cambia clase y guarda `theme`; dos listeners; lectura no protegida; iconos definidos por JS con comentarios contradictorios; sin preferencia del sistema. | Preferencia persistente, icono/etiqueta que comuniquen claramente acción/estado, transición sin flash y manejo de storage fallido. | Cambiar y recargar; abrir en nueva página; revisar `localStorage`, fondo/texto/icono; probar preferencia OS y storage bloqueado. |
| 7 | Typewriter a 120 ms por carácter | Cadena `Hola! soy Ezequiel...`, `setTimeout(..., 120)`; ejecución inicia al finalizar DOMContentLoaded. | Mantener cadencia/contenido aprobado; versión por idioma; respeta movimiento reducido y accesibilidad. | Recargar con cronómetro; comprobar caracteres y final/cursor; ES y EN; reduced motion; lector de pantalla. |
| 8 | Marquee infinito, ciclo visual 25 s | CSS `scroll-left 25s linear infinite`; 17 iconos repetidos con gap 40 px; posibles discontinuidad/hueco; duplicados tienen alt repetido. | Ciclo fluido, sin saltos/huecos, ritmo de 25 s, duplicados decorativos para AT. | Grabar al menos dos ciclos a 320, 1366 y 1920 px; comparar punto de unión; activar reduced motion y lector de pantalla. |
| 9 | Fade secuencial de skills y entrada About | `fade-text`/`fade-in-seq` animan desde carga; delay4/5 no están definidos. | Entrada al llegar a la zona; conservar secuencias previstas, sin ocultar contenido ante movimiento reducido. | Recargar arriba y observar sin desplazamiento; desplazar hasta Trabajos/About; verificar delays y reduced motion. |
| 10 | Scroll-snap en escritorio solo si no bloquea contenido | `main` tiene snap obligatorio; CSS lo quita solo a ancho ≤768 px. En 844×390 se midió overflow vertical en tres áreas. | Snap solo donde contenido completo siga accesible; desactivar/adaptar en ventanas bajas. | Recorrer con rueda, PageDown, teclado y enlaces a 1366×768 y 844×390; comprobar todo texto/footer accesible y anclas correctas. |
| 11 | Selector de idioma ES/EN | No existe. | Enlace real a página prerenderizada equivalente; nombres de idioma, `lang`, URL, ancla conservada y sin JS obligatorio. | Abrir `/` y `/en/` directamente y recargar; cambiar idioma en cada sección; probar sin JS, teclado, metadata/hreflang y recursos. |
| 12 | Conservar tema al cambiar idioma sin flash | No aplicable: no hay selector ni página EN; tema solo lee storage al cargar. | Preferencia coherente en ambas páginas y primer pintado sin flash. | Seleccionar cada tema, navegar entre ES/EN en misma sección, recargar y comprobar color desde primer frame. |

## Ejecución responsive de Fase 0

Ejecutado en Chromium 150.0.7871.250 integrado en Code 1.143.0, Windows, página local `file:///`, con los textos españoles actuales. Medidas CSS exactas:

| Viewport | Overflow horizontal del documento | Nota comprobada |
|---|---|---|
| 320×800 | No | Header: título se cruza con menú y acciones |
| 360×800 | No | Header: título se cruza con menú y acciones |
| 390×844 | No | Header: título se cruza con menú y acciones |
| 768×1024 | No | Sin cruce de header |
| 1024×768 | No | Sin cruce de header |
| 1366×768 | No | Sin cruce de header |
| 1920×1080 | No | Sin cruce de header |
| 844×390 apaisado | No | `trabajos` +99 px, `acerca` +156 px, `proyectos` +51 px verticales; sin cruce de header |

La sección `trabajos` tuvo 4–5 px de ancho desplazable interno adicional según viewport, aunque el documento no desbordó. `overflow-x: hidden` en `body` puede ocultarlo. No se guardaron capturas locales: véase [README de auditoría](./README.md). No se ensayaron traducciones ni contenido profesional nuevo; el texto español medido es el que ya está en el HTML.
