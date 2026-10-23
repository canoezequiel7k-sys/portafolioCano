# Roadmap — Modernización del portafolio de Ezequiel Cano

Documento operativo. La especificación completa (reglas, criterios de aceptación, riesgos) está en `Plan_modernizacion_portafolio_Ezequiel_v3.md`; si hay diferencias, manda el plan.

**Última actualización:** 22/10/2026

## Cómo usar este documento

- Marcá `[x]` cuando una tarea esté terminada **y verificada**, no solo escrita.
- Cada fase termina en un **gate de aprobación**: nada avanza a la fase siguiente sin la aprobación explícita de Ezequiel.
- No se estiman fechas: el plan no tiene datos para hacerlo honestamente. Cada tarea lleva un tamaño relativo (**S** pequeña, **M** mediana, **L** grande).

### Responsables

| Sigla  | Quién                            | Foco                                                                               |
| ------ | -------------------------------- | ---------------------------------------------------------------------------------- |
| **E**  | Ezequiel                         | Aporta datos, decide y aprueba.                                                    |
| **A1** | Agente Arquitectura + Calidad    | Estructura, build, herramientas, pruebas, accesibilidad, SEO técnico, rendimiento. |
| **A2** | Agente Contenido + Documentación | Perfil, contenido tipado y localizado, traducciones EN aprobadas, docs.            |
| **A3** | Agente UI + Interacciones        | Componentes, estilos, responsive, GSAP, canvas, tema, selector de idioma.          |

## Decisiones ya tomadas

| Decisión            | Resultado                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack               | Vite + TypeScript + GSAP; sin React ni Astro.                                                                                                                               |
| Idiomas             | Español (por defecto, en `/`) e inglés (en `/en/`).                                                                                                                         |
| Cambio de idioma    | Páginas prerenderizadas por idioma; selector como enlace real junto al de tema; View Transitions como mejora progresiva. Delegado por Ezequiel en la recomendación técnica. |
| Hosting objetivo    | Netlify (el hosting actual está sin confirmar).                                                                                                                             |
| Repositorio         | Existe en GitHub; la carpeta local **no** es un clon.                                                                                                                       |
| Producción          | `main` no se toca hasta el release final. Rama de integración: `modernization`.                                                                                             |
| Tag de recuperación | `legacy-v1` (reemplaza a `legacy-2023`).                                                                                                                                    |
| Agentes             | Tres.                                                                                                                                                                       |

## Qué necesita aportar Ezequiel

| #   | Dato                                                                            | Necesario antes de                                                     | Estado |
| --- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| 1   | URL del repositorio en GitHub                                                   | Gate G0                                                                | [ ]    |
| 2   | Proveedor, URL y dominio del sitio publicado; si se despliega solo desde `main` | Gate G0 (idealmente antes de empezar la Fase 0, para medir Lighthouse) | [ ]    |
| 3   | Fuente de verdad si local y remoto difieren                                     | Gate G0                                                                | [ ]    |
| 4   | Nombre exacto del título profesional y fecha                                    | Fase 2                                                                 | [ ]    |
| 5   | Proyectos mobile a destacar y su material (capturas, video, repo, APK)          | Fase 2                                                                 | [ ]    |
| 6   | CV en inglés                                                                    | Fase 2                                                                 | [ ]    |
| 7   | Elegir alternativa táctil para los ojos (3 opciones)                            | Fase 3                                                                 | [ ]    |
| 8   | Confirmar: intro al cambiar idioma y persistencia/redirección desde `/`         | Fase 3                                                                 | [ ]    |
| 9   | Aprobar contenido en español e inglés                                           | Fin de Fase 2                                                          | [ ]    |

## Vista general

```text
 FASE 0            G0            FASE 1         G1       FASE 2           G2      FASE 3          G3
 Auditoría   -->  Aprobación -->  Fundamentos --> ok --> Responsive y --> ok --> Interacciones --> ok
 (solo lectura)   + git/hosting   + spike i18n          presentación            + animaciones
                  + tag legacy-v1
                                                                                         |
      FASE 5  <--  G4  <--  FASE 4                                                       |
      Release       ok      Accesibilidad, SEO, rendimiento  <-----------------------------
```

---

## Fase 0 — Auditoría y línea base

**Rama:** `phase-0-audit` · **Solo lectura sobre el código.** Artefactos únicamente en `docs/audit/`.

### A1 — Arquitectura + calidad

- [ ] **(M)** Confirmar, descartar o ampliar cada hallazgo del diagnóstico contra el código real → `findings.md`
- [ ] **(M)** Matriz de regresión: comportamiento actual, esperado y pasos de verificación → `regression-matrix.md`
- [ ] **(M)** Verificar el sitio actual en los 8 viewports (320, 360, 390, 768, 1024, 1366×768, 1920, 844×390) con evidencia
- [ ] **(M)** Lighthouse del sitio publicado (si hay URL) → `performance-baseline.md`
- [ ] **(M)** Perfil del canvas: FPS/CPU en reposo, con puntero, en resize y en segundo plano
- [ ] **(S)** Evaluar viabilidad del prerender bilingüe y la estrategia de ramas → informe
- [ ] **(S)** Solo lectura de git y hosting: diferencias local/remoto/publicado → `git-hosting.md`

### A2 — Contenido + documentación

- [ ] **(M)** Inventario de archivos, recursos, enlaces internos y externos, y secciones → `inventory.md`
- [ ] **(M)** Inventario de **todos** los textos visibles y accesibles (HTML, JS, `aria-label`, `alt`, `title`, typewriter) → `i18n-inventory.md`
- [ ] **(S)** Lista de URLs de documentos que pueden estar enlazadas desde fuera (para las redirecciones 301)
- [ ] **(M)** Brechas de contenido profesional, por idioma → `content-gaps.md`
- [ ] **(S)** `docs/audit/README.md` con alcance y resumen

### A3 — UI + interacciones

- [ ] **(S)** Propuesta de las 3 alternativas táctiles para los ojos, con pros y contras
- [ ] **(S)** Revisar cómo se comportarían los layouts actuales con los textos del español como caso de estrés

### Gate G0 — Aprobación de la auditoría

- [ ] **E** revisa el informe y resuelve bloqueos (tabla "Qué necesita aportar Ezequiel", filas 1 a 3)
- [ ] **E + A1:** clonar el repo remoto en una **carpeta aparte** y comparar con la carpeta local
- [ ] **E** decide la fuente de verdad
- [ ] **E + A1:** crear el tag `legacy-v1` sobre el commit que representa el sitio publicado
- [ ] Crear la rama `modernization` e incorporar los artefactos de `docs/audit/` mediante `phase-0-audit`
- [ ] Verificar si el hosting despliega `main` automáticamente y proteger producción (previews solo en ramas de trabajo)
- [ ] **E** aprueba pasar a la Fase 1

---

## Fase 1 — Fundamentos y arquitectura

**Rama:** `phase-1-foundations` desde `modernization`.

### A1 — Arquitectura + calidad (ruta crítica)

- [ ] **(M)** Inicializar Vite + TypeScript estricto + GSAP; `package.json` y scripts
- [ ] **(M)** ESLint, Prettier, `tsc --noEmit`
- [ ] **(M)** dependency-cruiser con las reglas de capas del plan (sección 6)
- [ ] **(M)** Vitest y Playwright + axe configurados con un test de humo en ambos idiomas
- [ ] **(L)** **Spike de prerender bilingüe**: `dist/index.html` (ES) y `dist/en/index.html` (EN) desde el mismo contenido; el servidor de desarrollo sirve ambas rutas
- [ ] **(S)** Definir el contrato de ciclo de vida de features (inicializar → devolver limpieza)
- [ ] **(S)** `netlify.toml` preliminar (solo si el hosting confirmado es Netlify)

### A2 — Contenido + documentación

- [ ] **(M)** Tipos `Locale` y `Localized`; el compilador falla si falta un idioma
- [x] **(M)** `content/` migrado a datos tipados en ES/EN; Ezequiel aprobó el contenido inglés el 2026-10-23
- [ ] **(S)** `content/ui.ts` con los textos de interfaz
- [ ] **(M)** `README.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT_GUIDE.md`, `docs/DECISIONS.md` (borrador inicial)

### A3 — UI + interacciones

- [ ] **(M)** `styles/tokens.css` (colores, tipografía, espaciado, movimiento) y temas claro/oscuro con variables
- [ ] **(S)** `reset.css`, `base.css` y carga real de Poppins (autoalojada)
- [ ] **(S)** Tabla de propiedad de animaciones (borrador) en `docs/DECISIONS.md`

### Gate G1

- [ ] Instalación reproducible desde cero
- [ ] Type-check, lint, formato y build sin errores
- [ ] Sin dependencias circulares ni violaciones de capas
- [ ] Ambos HTML generados en `dist/` y el test de humo pasa en ES y EN
- [ ] **E** aprueba el merge de `phase-1-foundations` a `modernization`

---

## Fase 2 — Responsive y presentación

**Rama:** `phase-2-ui` desde `modernization`.

**Dependencias de Ezequiel (filas 4 a 6 de la tabla):** título, proyectos mobile y CV en inglés. Sin ellas, A3 puede construir los componentes con contenido provisional marcado.

### A2 — Contenido + documentación

- [ ] **(M)** Contenido profesional actualizado (perfil, experiencia, formación, certificaciones) en ES y EN
- [ ] **(M)** Proyectos mobile destacados con su material
- [ ] **(S)** Renombrado y ubicación de documentos: `cv-es.pdf`, `cv-en.pdf`, certificados
- [ ] **(S)** Lista final de redirecciones 301

### A3 — UI + interacciones (ruta crítica)

- [ ] **(L)** Header adaptable con tres controles (Contrátame, tema, idioma) sin solapamientos a 320 px
- [ ] **(L)** Componentes como funciones puras: hero, experiencia, about, proyectos, certificaciones, footer, marquee
- [ ] **(M)** Layout fluido: `clamp()`, Grid/Flexbox, `dvh`, alturas flexibles; sin `!important` ni `scale()` como solución de layout
- [ ] **(M)** Scroll-snap solo en escritorio y solo cuando no impide acceder al contenido
- [ ] **(S)** Footer como un pie normal, no una pantalla entera
- [ ] **(S)** Selector de idioma como enlace real (hreflang, `lang`), con estilo coherente con el de tema

### A1 — Arquitectura + calidad

- [ ] **(M)** Pruebas visuales y de desbordes en los 8 viewports, en ES y EN (el español como caso de estrés)
- [ ] **(S)** Revisar que los componentes no tocan `window`/`document` al importarse

### Gate G2

- [ ] Sin recortes, solapamientos ni scroll horizontal en los 8 viewports, en ambos idiomas
- [ ] Los títulos no quedan bajo el header
- [ ] **E** aprueba el contenido en español y en inglés
- [ ] **E** aprueba el merge a `modernization`

---

## Fase 3 — Interacciones y animaciones

**Rama:** `phase-3-interactions` desde `modernization`.

**Dependencias de Ezequiel (filas 7 y 8):** alternativa táctil de los ojos y decisiones sobre la intro y la persistencia de idioma.

### A3 — UI + interacciones (ruta crítica)

- [ ] **(M)** Navegación accesible: botón con `aria-expanded`, cierre con Escape, gestión de foco, enlaces fuera de foco cuando está cerrada, sin doble salto, con `scroll-margin-top`
- [ ] **(M)** Reveal con `IntersectionObserver` y stagger de 150 ms (conserva el comportamiento original)
- [ ] **(L)** Canvas optimizado: 180 partículas, color por tema leído una sola vez, `devicePixelRatio`, pausa en pestaña oculta, sin `NaN`, resize sin reiniciar todo
- [ ] **(M)** Ojos (6 unidades SVG) con la alternativa táctil elegida
- [ ] **(M)** Tilt (intensidad 8 y 12) con alternativa para táctiles
- [ ] **(S)** Typewriter a 120 ms por carácter, en ambos idiomas
- [ ] **(M)** Marquee infinito de 25 s en CSS, sin saltos ni espacios vacíos, con duplicados ocultos a lectores de pantalla
- [ ] **(M)** Transición de tema y de idioma con View Transitions (con alternativa sin animación); se conserva sección y tema; sin parpadeo
- [ ] **(S)** Fades secuenciales y entrada del bloque About, disparados al llegar a la sección
- [ ] **(S)** `prefers-reduced-motion` en todas las animaciones

### A1 — Arquitectura + calidad

- [ ] **(M)** Verificar que cada feature limpia listeners, observers, `requestAnimationFrame` y timelines al reinicializar
- [ ] **(M)** Playwright: regresión de la lista de comportamientos de la sección 8 del plan, en ES y EN

### A2 — Contenido + documentación

- [ ] **(S)** Completar la tabla de propiedad de animaciones en `docs/DECISIONS.md`

### Gate G3

- [ ] Cada comportamiento de la sección 8 del plan probado
- [ ] Sin animaciones duplicadas ni recursos abandonados tras reinicializar
- [ ] **E** prueba en móvil real y aprueba el merge a `modernization`

---

## Fase 4 — Accesibilidad, SEO y rendimiento

**Rama:** `phase-4-quality` desde `modernization`. Se puede solapar parcialmente con la Fase 3 en lo que no dependa de las animaciones.

### A1 — Arquitectura + calidad (ruta crítica)

- [x] **(M)** Semántica y jerarquía de encabezados (un `<h1>` real con el nombre), skip-link y foco visible
- [x] **(M)** Auditoría de contraste y axe en ambos idiomas y temas claro/oscuro; sin violaciones
- [x] **(M)** SEO por idioma: `<html lang>`, title, description, Open Graph (`og:locale` y alternate), `hreflang` recíproco, canonical (requiere `SITE_URL` o `URL` en build)
- [x] **(S)** `sitemap.xml` con alternates y `robots.txt` (requiere `SITE_URL` o `URL` en build)
- [x] **(S)** Favicon y metadatos
- [x] **(M)** Imágenes WebP con dimensiones, alt descriptivo y carga diferida; originales conservados
- [x] **(M)** PDFs optimizados, conservando nombres y enlaces
- [ ] **(M)** Comparar Lighthouse y perfil del canvas con Fase 0 (línea base recuperada; falta URL pública para Lighthouse de producción)

### A2 — Contenido + documentación

- [x] **(S)** `alt` descriptivos y textos accesibles en ambos idiomas
- [x] **(S)** Revisión de `CONTENT_GUIDE.md` y de la sección de traducciones

### Gate G4

- [x] Sin errores críticos de accesibilidad conocidos (objetivo WCAG 2.2 AA; axe en ambos idiomas y temas)
- [ ] Métricas comparadas con la línea base y objetivos acordados con Ezequiel (no se fijan antes de medir)
- [ ] **E** aprueba el merge a `modernization`

---

## Fase 5 — Integración, regresión y release

**Rama:** `phase-5-release` desde `modernization`.

### A1 — Arquitectura + calidad

- [x] **(M)** Regresión completa y comprobación de enlaces internos, en ES y EN (Playwright; enlaces externos validados por esquema, no por disponibilidad)
- [x] **(M)** `netlify.toml`: build, publicación de `dist` y cabeceras HTTP básicas
- [x] **(S)** Redirección 301 verificada en Netlify: `/cv_ezequiel.pdf` → `/cv-es.pdf`; certificados mantienen sus rutas.
- [x] **(M)** Deploy preview verificado: `/`, `/en/`, CVs, certificados, robots, sitemap y metadatos. Preview observada: `deploy-preview-6--portafolio-cano.netlify.app`.
- [ ] **(S)** Verificar selector de idioma y tema sin errores en preview del último commit (E2E local pasa; Netlify aún sirve assets anteriores)

### A2 — Contenido + documentación

- [x] **(M)** Documentación final alineada con el código real
- [x] **(S)** `CHANGELOG.md` inicializado; la versión se mantiene como `Unreleased`

### Gate G5 — Release

**Estado:** deploy preview y sitio estable verificados en lectura; no se publicó desde esta sesión. El contenido inglés fue aprobado. El arreglo de navegación está en el último commit y pasa E2E local, pero Netlify no generó un deploy nuevo (la preview y el sitio estable aún sirven el bundle anterior; branch deploy de esta rama devuelve 404). Falta crear/actualizar el deploy preview y repetir la prueba. No hacer merge ni tag sin autorización explícita de Ezequiel.

- [ ] Todos los criterios globales del plan (sección 18) cumplidos
- [ ] **E** autoriza explícitamente el release
- [ ] Merge de `modernization` a `main` y verificación del sitio en producción
- [ ] Tag de la versión nueva (por ejemplo `v2.0.0`)
- [ ] `legacy-v1` sigue disponible como punto de recuperación

---

## Qué se puede hacer en paralelo

| Carril                                                 | Puede avanzar mientras…                                           |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| Auditoría de contenido (A2) y auditoría visual (A1/A3) | …se prepara la matriz de pruebas (Fase 0).                        |
| Tokens y estilos base (A3)                             | …A1 configura herramientas y el spike de prerender (Fase 1).      |
| Componentes (A3) y features (A3/A1)                    | …los contratos ya están definidos (desde G1).                     |
| Traducciones al inglés (A2)                            | …A3 construye los componentes con contenido provisional (Fase 2). |
| Parte de la Fase 4 (SEO, imágenes, PDFs)               | …la Fase 3 sigue en curso.                                        |

## Ruta crítica y dependencias

1. **Datos de Ezequiel** (repo, hosting, título, proyectos mobile, CV en inglés) → bloquean G0 y la Fase 2.
2. **Spike de prerender bilingüe** (Fase 1) → bloquea toda la presentación bilingüe. Si falla, se activa el Plan B del plan (sección 7.2) con aprobación.
3. **Contratos de ciclo de vida y propiedad de animaciones** (Fase 1) → bloquean el trabajo en paralelo de las features.
4. **Aprobación de contenido ES/EN** (G2) → bloquea el release.

## Plantilla de cierre de cada fase

Copiar al cerrar cada fase:

```text
Fase: __
Rama: __
Commits: __
Archivos creados/modificados: __
Decisiones y motivos: __
Pruebas ejecutadas y resultados: __
Riesgos, pendientes y dependencias: __
Documentación actualizada: __
Aprobación de Ezequiel (fecha): __
```

## Primeros pasos inmediatos

- [ ] **E:** pasar la URL del repo, el hosting y la URL publicada (tabla "Qué necesita aportar Ezequiel", filas 1 y 2)
- [ ] **E:** pasar el nombre exacto del título y la lista de proyectos mobile con su material
- [ ] **E:** pasar la v3 del plan al agente lead y autorizar **únicamente la Fase 0**
- [ ] **Lead:** devolver el informe de auditoría para revisarlo con Ezequiel
