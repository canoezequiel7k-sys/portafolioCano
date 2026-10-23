# Auditoría y línea base — Fase 0

## Alcance

Auditoría de solo lectura de los archivos locales en la raíz del proyecto y `assets/`, según el plan v3 y la sección Fase 0 del roadmap. No se modificó ningún archivo preexistente, no se instalaron herramientas y no se ejecutaron operaciones de Git. Los únicos archivos nuevos de este trabajo están en `docs/audit/`.

## Método y límites

- Se leyeron completos el plan v3 y el roadmap; se contrastaron sus diagnósticos con `index.html`, `style.css`, `script.js` y `README.MD`.
- El inventario de pesos se obtuvo del sistema de archivos. Las referencias relativas del HTML se comprobaron: **29/29 existen**.
- La revisión responsive se ejecutó abriendo el sitio local (`file:///`) en Chromium 150.0.7871.250, integrado en Code 1.143.0 sobre Windows. Se midieron los ocho viewports de la especificación y el desbordamiento/solapamiento con el texto español existente.
- La navegación del menú y su cierre al hacer clic fuera se probaron en navegador. Las restantes interacciones se describen a partir del código, no como pruebas funcionales ejecutadas.
- No se recibió URL del repositorio ni URL/proveedor del sitio publicado. Lighthouse, comparación remoto/publicado y estado de despliegue quedan **NO VERIFICADOS**.
- Se muestrearon callbacks `requestAnimationFrame` localmente; no se midió CPU ni se pudo poner esta pestaña en segundo plano. No son una medición de campo ni reemplazan el perfil de producción.
- No se guardaron capturas: el navegador integrado permite inspección y captura visual, pero no ofrece una ruta de exportación de imágenes al directorio solicitado.

## Resumen ejecutivo

- Proyecto local estático (HTML/CSS/JS), sin dependencias ni repositorio Git local.
- 34 archivos en total, incluidos documentos de planificación; los archivos de aplicación suman 2.957.463 bytes. Los PDF suman 2.133.380 bytes.
- El documento tiene cuatro elementos `<section>` y un `<footer class="seccion">`; el menú enlaza las cuatro secciones, no el pie.
- Confirmados: fuentes Poppins no cargadas, tema con dos listeners y sin `prefers-color-scheme`, limitaciones de canvas, duplicación de scroll, contenido/animación sin soporte de idioma y problemas de accesibilidad y responsive. Detalles y estados en [findings.md](./findings.md).
- En los viewports ensayados no hubo overflow horizontal del documento; el encabezado sí se solapó a 320, 360 y 390 px. En 844×390 se desborda verticalmente el contenido de tres áreas.
- ES/EN con páginas prerenderizadas es técnicamente viable; el mecanismo de build y las rutas relativas requieren un spike en Fase 1.
- No comenzar la Fase 1 hasta la aprobación explícita de Ezequiel y la resolución de los bloqueos G0.

## Entregables

- [Inventario](./inventory.md)
- [Inventario de textos e internacionalización](./i18n-inventory.md)
- [Hallazgos](./findings.md)
- [Matriz de regresión](./regression-matrix.md)
- [Brechas de contenido](./content-gaps.md)
- [Línea base de rendimiento](./performance-baseline.md)
- [Git y hosting](./git-hosting.md)
- [Opciones táctiles para los ojos](./eyes-touch-options.md)

## Estado

La Fase 0 queda documentada con las limitaciones indicadas. No se inicia la Fase 1: queda pendiente revisión/aprobación de Ezequiel y los datos de G0.
