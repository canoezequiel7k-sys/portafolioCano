# Plan de modernización del portafolio — Ezequiel Cano (v3)

> **Versión 3.** Consolida la v1 y la v2 en un solo documento (ya no hay secciones que "reemplazan" a otras) e incorpora: sitio bilingüe español/inglés, repositorio existente en GitHub y hosting por confirmar. Si algo contradice a una versión anterior, **esta versión manda**. El cronograma operativo está en `ROADMAP_portafolio_Ezequiel.md`.

## Registro de cambios del plan

| Versión | Cambios |
|---|---|
| v1 | Plan inicial: stack, arquitectura, fases, delegación. |
| v2 | Ajustes tras revisión: git, viewports, herramientas de calidad, contrato de ciclo de vida, propiedad de animaciones, documentación simplificada, tres agentes. |
| v3 | Sitio bilingüe ES/EN (sección 7); estrategia de ramas que protege producción; repo en GitHub confirmado pero local sin `.git`; tag renombrado a `legacy-v1`; redirecciones de URLs antiguas; documento consolidado. |

## 1. Rol del agente

Actuá como agente lead de modernización del portafolio personal de Ezequiel Cano. Tu responsabilidad inicial es revisar y coordinar el plan, auditar el proyecto existente y preparar una refactorización por fases, sin perder funcionalidades.

**Importante:** en la primera etapa no escribas código de implementación. Empezá por revisar el estado real del proyecto, validar el plan y detectar información faltante. No inventes datos profesionales ni des por ejecutadas tareas que todavía no se realizaron.

## 2. Contexto del proyecto

- Ruta local en Windows: `C:\Users\SystemAncestral\Documents\portfolio`
- Portafolio web personal creado en 2023 y modificado levemente en 2024.
- Stack actual: HTML, CSS y JavaScript vanilla, sin build ni dependencias.
- Archivos actuales en la raíz (verificado): `index.html`, `style.css`, `script.js`, `README.MD` (solo dice "IR MODIFICANDO:::"), `cv_ezequiel.pdf`, `ingles_certificado.pdf`, `freecodecamp.pdf`, `coderhause.pdf` y la carpeta `assets/` (`icons/` con 21 archivos, `images/` con 3).
- **No hay** `.git`, `.gitignore`, `netlify.toml`, `_redirects` ni `CNAME` en la carpeta local (verificado).
- **Repositorio:** Ezequiel confirmó que existe un repositorio en GitHub. La URL está pendiente. Como la carpeta local no es un clon, **puede diferir del remoto**; esa diferencia hay que reconciliarla antes de etiquetar nada (sección 9).
- **Hosting:** Ezequiel indicó "Netlify u otro hosting". El proveedor, la URL y el dominio están **sin confirmar**.
- **Idiomas:** el sitio será bilingüe, español (por defecto) e inglés, con un selector de idioma análogo al de tema oscuro/claro (sección 7).
- Perfil profesional actual: Ezequiel tiene más experiencia que cuando creó el portafolio, obtuvo un título y hoy está más enfocado en desarrollo mobile, aunque también tiene conocimientos de desarrollo web y full stack.
- El contenido profesional actualizado aún debe recopilarse y ser aprobado por Ezequiel, en ambos idiomas.

## 3. Decisiones técnicas confirmadas

- **Vite + TypeScript** como herramienta de desarrollo y compilación.
- **GSAP** para secuencias y animaciones complejas; CSS y APIs nativas para comportamientos simples.
- **Netlify** como plataforma de despliegue objetivo (sujeto a confirmar el hosting actual; ver sección 9).
- Arquitectura modular inspirada en Clean Architecture, adaptada a un sitio estático.
- Sin React ni Astro por ahora; no agregar frameworks ni dependencias innecesarias.
- TypeScript estricto, salvo excepciones justificadas y documentadas.
- **Bilingüe ES/EN con páginas prerenderizadas por idioma y selector en el header** (sección 7). Ezequiel delegó esta decisión en la recomendación del lead técnico; el agente puede señalar riesgos en la Fase 0, pero no cambiar el enfoque sin aprobación.
- No escribir código de implementación durante la planificación.

## 4. Objetivos

1. Separar contenido, presentación, funcionalidades, servicios compartidos y estilos.
2. Conservar las interacciones existentes y corregir errores.
3. Mejorar responsive, accesibilidad, SEO, rendimiento y experiencia visual.
4. Actualizar el perfil para reflejar la experiencia laboral, el título y el enfoque mobile actual de Ezequiel.
5. Ofrecer el sitio completo en español e inglés, con cambio de idioma accesible y SEO correcto por idioma.
6. Documentar arquitectura, decisiones, módulos y mantenimiento para que Ezequiel pueda retomar el proyecto meses después.
7. Dejar el trabajo dividido en entregas verificables que puedan delegarse a otros agentes.

## 5. Diagnóstico conocido

Este diagnóstico es información de partida, no reemplaza la inspección de los archivos actuales. Confirmá cada hallazgo antes de modificarlo.

### Bugs y problemas funcionales

- Poppins está declarada pero no se carga.
- Las tarjetas `.about-card` tienen dimensiones fijas en escritorio (620×320) porque la primera regla nunca se resetea, y pueden recortar contenido.
- `fade-text` y `fade-in-seq` empiezan al cargar, no al llegar a la sección; `delay4` y `delay5` no están definidos.
- El icono del tema oscuro contradice sus comentarios y hay dos listeners para el mismo botón.
- Hay flash de tema claro al iniciar; no se respeta `prefers-color-scheme`.
- Las secciones usan `100vh` y `scroll-snap mandatory`; parte del contenido puede quedar inaccesible en pantallas pequeñas o bajas.
- El footer es una sección de pantalla completa casi vacía (su `min-height` se ignora).
- Los enlaces de navegación provocan doble desplazamiento (`scrollIntoView` + salto nativo) y el header puede tapar los títulos.
- Hay declaraciones `transition: transform` duplicadas en `.proyecto`.
- En móvil, `scale()` entra en conflicto con animaciones y tilt.
- El título del header puede solaparse con controles en pantallas estrechas.
- El marquee puede tener errores de anchura (el `-50%` se calcula sobre el contenedor flex), de separación (salto de media separación por el `gap`), de repetición (monitores anchos) y de desbordamiento horizontal (hack de `100vw`); debe verificarse en navegador.
- Hay etiquetas `</b>` sueltas, `<footer>` dentro de `<main>`, `<br>` usados como espaciado y jerarquía de encabezados incorrecta (el `<h1>` es genérico y el nombre está en un `<h2>` que se llena por JS).
- El canvas consulta estilos computados por partícula y por frame, no pausa cuando la pestaña queda oculta, no gestiona `devicePixelRatio`, reinicia partículas en cada resize, inicializa el mouse en `null` y puede producir `NaN` si la distancia es cero.
- El handler de scroll recorre secciones y crea timeouts continuamente; debe evaluarse `IntersectionObserver`.
- Todo el JavaScript está dentro de un único `DOMContentLoaded` y no comprueba si faltan elementos.
- Ojos y tilt dependen del mouse y no tienen alternativa adecuada para dispositivos táctiles.
- `localStorage` no contempla errores.
- Todo el texto visible y accesible (HTML, typewriter en JS, `aria-label`, `alt`, `<title>`) está en español y embebido en el código, sin soporte de idioma.
- El CV y los certificados se enlazan por nombres de archivo (`cv_ezequiel.pdf`, etc.) que pueden estar enlazados desde sitios externos (LinkedIn, GitHub, CV); cambiarlos sin redirección rompería esos enlaces.

### Accesibilidad y SEO

- Menú implementado como `<a href="#">` sin estado accesible completo, sin cierre con Escape ni gestión correcta del foco; sus enlaces siguen enfocables aunque el panel esté oculto.
- No hay `:focus-visible`, skip-link ni tratamiento de `prefers-reduced-motion`.
- El marquee puede anunciar los iconos duplicados a lectores de pantalla.
- Hay textos alternativos poco descriptivos, imágenes sin dimensiones y sin estrategia adecuada de carga.
- Faltan meta description, Open Graph y favicon; el título es genérico y el año del copyright está fijo (2025).
- Hay colores cuyo contraste debe revisarse (`#607d8b` con texto blanco ronda 4,3:1).
- El tema oscuro no cubre todos los elementos visuales (fondos alternos de sección, marquee, botones).

### Arquitectura y rendimiento

- Hay duplicación de reglas CSS (`.about-card` ×3, `.certificaciones-container` ×3, `.cert-link` ×3), múltiples `@media` y CSS aparentemente muerto (`.proyecto.cuadrada`, `#acerca .proyecto`, `.perfil`, `.info-personal`, `footer`) que debe confirmarse antes de eliminarlo.
- El tema oscuro utiliza muchos colores hardcodeados en lugar de tokens.
- Trabajos, habilidades, certificaciones y proyectos están escritos directamente en HTML; algunos datos aparecen duplicados (Hotelera JH en Trabajos y en Proyectos).
- Solo hay un breakpoint y se recurre a `!important` y `scale()` para adaptar el layout.
- El peso total ronda 2 MB, principalmente por los PDFs (`coderhause.pdf` pesa 1,5 MB); las imágenes JPG (100–243 KB) también pueden optimizarse.
- El canvas es un área prioritaria de medición y optimización.

## 6. Arquitectura objetivo

La estructura es una referencia para planificar, no una instrucción de crear todos los archivos vacíos al inicio:

```text
portfolio/
├── index.html                    # plantilla base del documento
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── netlify.toml                  # si el hosting confirmado es Netlify
├── .gitignore
├── .editorconfig
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTENT_GUIDE.md
│   ├── DECISIONS.md              # decisiones + tabla de propiedad de animaciones
│   ├── CHANGELOG.md
│   └── audit/                    # artefactos de la Fase 0
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── documents/
│       ├── cv-es.pdf
│       ├── cv-en.pdf
│       └── certificates/
├── scripts/
│   └── prerender/                # genera las páginas ES y EN en el build (mecanismo a validar en Fase 1)
├── src/
│   ├── main.ts
│   ├── app/
│   │   ├── initialize-app.ts
│   │   └── app-lifecycle.ts
│   ├── content/
│   │   ├── ui.ts                 # textos de interfaz, aria-labels y metadatos por idioma
│   │   ├── profile.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── certifications.ts
│   │   └── social-links.ts
│   ├── components/               # funciones puras: (contenido, idioma) => HTML
│   │   ├── header/               # incluye selector de tema y de idioma
│   │   ├── hero/
│   │   ├── experience/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── marquee/
│   │   └── footer/
│   ├── features/                 # comportamientos que se enganchan al DOM existente
│   │   ├── navigation/
│   │   ├── reveal/
│   │   ├── particles/
│   │   ├── character-eyes/
│   │   ├── card-tilt/
│   │   ├── typewriter/
│   │   ├── skills-marquee/
│   │   ├── theme-transition/
│   │   └── language-switch/
│   ├── core/
│   │   ├── theme/
│   │   ├── i18n/                 # tipos, utilidades de idioma y formato (sin DOM)
│   │   ├── storage/
│   │   ├── motion/
│   │   ├── dom/
│   │   └── utils/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── utilities.css
│   │   ├── themes/
│   │   └── components/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── types/
│       ├── content.ts
│       ├── i18n.ts
│       └── animation.ts
└── tests/
    ├── unit/
    └── e2e/
```

### Reglas de dependencias

- `content/` contiene datos tipados y no importa componentes, DOM ni animaciones.
- `components/` construye la presentación como funciones puras que devuelven HTML a partir del contenido y el idioma. **No tocan `window`, `document` ni el DOM al importarse**, para poder ejecutarse en el build (prerender).
- `features/` implementa comportamientos autocontenidos que se enganchan al DOM ya renderizado (mejora progresiva), con interfaces claras de inicialización y limpieza.
- `core/` contiene servicios compartidos reutilizables; no debe convertirse en un cajón de sastre. `core/i18n` no depende del DOM.
- `styles/` contiene tokens, temas y reglas visuales; no depende de la lógica de las features.
- `app/` coordina la inicialización y composición general.
- Evitar dependencias circulares y abstracciones sin necesidad real.
- No crear capas de dominio o repositorios ficticios para un sitio estático sin lógica de negocio.
- Estas reglas deben poder verificarse con herramienta (dependency-cruiser), no solo por convención.

## 7. Internacionalización (español / inglés)

### 7.1 Decisión

**Páginas estáticas prerenderizadas por idioma, con URL propia, y un selector de idioma en el header que es un enlace real.** Es lo más cercano a "como el botón de tema" que no sacrifica SEO ni robustez.

| URL | Idioma | Notas |
|---|---|---|
| `/` | Español (por defecto) | Conserva la URL actual y los enlaces ya compartidos. |
| `/en/` | Inglés | Página completa equivalente. |

No hay redirección automática por idioma del navegador en esta versión (evita redirecciones, parpadeos y problemas con buscadores). Se puede evaluar como mejora opcional en la Fase 1.

### 7.2 Comportamiento del selector

- Ubicado en el header junto al selector de tema, con la misma coherencia visual y de animación de icono.
- Es un `<a href hreflang lang>` real: funciona sin JavaScript y es accesible por teclado. Muestra el idioma destino por su nombre propio ("English" / "Español") con `lang` correcto para los lectores de pantalla.
- **Mejora progresiva:** donde el navegador lo soporte, usar View Transitions entre documentos para que el cambio se sienta fluido. Sin soporte, navegación normal.
- Al cambiar de idioma se conserva la sección actual (se abre la otra página en el mismo ancla) y el tema elegido, sin parpadeo.
- La intro (typewriter y fades del hero) **no se repite completa** al cambiar de idioma. *Propuesta; Ezequiel debe confirmarla.*
- **Plan B** si la navegación entre páginas no se siente suficientemente fluida: intercambiar el contenido en el lugar (re-render + History API) manteniendo las páginas prerenderizadas. No adoptar sin aprobación.
- Persistencia de la preferencia de idioma y redirección desde `/`: opcional. Si se implementa, debe ejecutarse antes del primer pintado, solo para visitantes que eligieron un idioma de forma explícita, y sin afectar a los crawlers.

### 7.3 Alternativa descartada: cambio instantáneo solo en cliente

Un único HTML con el texto inyectado por JavaScript se parece más al selector de tema, pero: los buscadores y las previsualizaciones sociales ven un solo idioma, no hay URL compartible por idioma, no hay `hreflang`, hay riesgo de parpadeo de idioma y obliga a mantener lógica de render duplicada.

### 7.4 Modelo de contenido

- `type Locale = 'es' | 'en'`.
- Los textos narrativos se guardan localizados y lado a lado (`{ es: '...', en: '...' }`) para que Ezequiel pueda mantener ambos idiomas sincronizados.
- Los datos neutros (URLs, fechas ISO, nombres de tecnologías) no se duplican.
- **El compilador debe fallar si falta un idioma en cualquier campo localizado.**
- Los textos de interfaz (navegación, botones, `aria-label`, `alt`, `title`, metadatos) viven en `content/ui.ts`.
- Fechas y números se formatean con `Intl` según el idioma.
- Ningún texto visible o accesible puede estar escrito a mano en componentes o features (incluye typewriter, tooltips y mensajes de estado).
- Las traducciones pueden prepararse como borrador, pero **no se publica texto en inglés sin aprobación de Ezequiel**.

### 7.5 SEO e idioma

- `<html lang>` correcto en cada página; `<title>`, meta description y Open Graph propios por idioma (`og:locale` y `og:locale:alternate`).
- `<link rel="alternate" hreflang="es|en|x-default">` recíprocos y `canonical` propio por página.
- `sitemap.xml` con alternates y `robots.txt`.
- No inventar datos para JSON-LD; si se usa, solo con datos aprobados.

### 7.6 Documentos y URLs antiguas

- Un CV por idioma: `cv-es.pdf` y `cv-en.pdf`. Cada página enlaza el de su idioma. **Ezequiel debe aportar el CV en inglés.**
- Los certificados se mantienen en su idioma original; el enlace indica el idioma del PDF.
- Redirecciones 301 desde los nombres antiguos (por ejemplo `/cv_ezequiel.pdf` → `/documents/cv-es.pdf`) para no romper enlaces externos. La lista completa sale del inventario de la Fase 0.

### 7.7 Diseño y layout

- El español suele ser más largo que el inglés: tomarlo como caso de estrés para tamaños, saltos de línea y truncados.
- El header pasa a tener tres controles (Contrátame, tema, idioma): el diseño móvil debe resolverlo sin solapamientos a 320 px.
- El typewriter funciona en ambos idiomas y respeta `prefers-reduced-motion`.

### 7.8 Build y hosting

- Ambas páginas se generan en el build desde el mismo contenido tipado.
- Sin frameworks ni dependencias nuevas para esto, salvo justificación. El mecanismo concreto (plugin de Vite, script posterior al build u otro) se valida en un spike de la Fase 1 con estos criterios: ambos HTML correctos en `dist/`, el servidor de desarrollo sirve ambas rutas y no hay diferencias estructurales entre idiomas.
- Si el hosting confirmado es Netlify: `netlify.toml` con comando de build, directorio de publicación, cabeceras y redirecciones (las 301 de la sección 7.6).

### 7.9 Pruebas de idioma

- Playwright ejecuta la matriz de humo en ambos idiomas.
- Comprobaciones automáticas: `lang` correcto, `hreflang` recíproco, mismos ids de sección en ambos HTML, enlaces a documentos válidos, y que el selector conserva tema y sección.
- La calidad de las traducciones se revisa manualmente con Ezequiel.

## 8. Comportamientos que deben preservarse

1. Menú lateral: abrir/cerrar, cerrar al hacer clic fuera y navegar a secciones.
2. Reveal de secciones y tarjetas, con stagger de 150 ms.
3. Canvas con 180 partículas, rebote, repulsión del puntero y color según el tema.
4. Pupilas del personaje siguen el mouse con máximo de 6 unidades SVG.
5. Tilt 3D: intensidad 8 en About y 12 en Certificaciones.
6. Tema oscuro persistente en `localStorage`, transición suave e icono correcto.
7. Typewriter a 120 ms por carácter.
8. Marquee infinito de skills con ciclo visual de 25 segundos.
9. Fade secuencial del texto de skills y entrada escalonada del bloque About.
10. Scroll-snap entre secciones de escritorio, solo cuando no impida acceder al contenido.

**Nuevos:**

11. Selector de idioma ES/EN según la sección 7.
12. El tema se conserva al cambiar de idioma, sin parpadeo.

Los comportamientos defectuosos deben corregirse, no replicarse. Cualquier cambio intencional debe documentarse. Las alternativas táctiles y el respeto por `prefers-reduced-motion` forman parte de la aceptación.

## 9. Control de versiones y despliegues

### 9.1 Estado actual

Existe un repositorio remoto en GitHub, pero la carpeta local no es un clon. El historial y el contenido remoto pueden diferir de lo local (por ejemplo, ajustes hechos en 2024).

### 9.2 Antes de la Fase 1 (con aprobación de Ezequiel)

1. Ezequiel aporta la URL del repositorio y la URL, el proveedor y el dominio del sitio publicado.
2. Se clona el repositorio **en una carpeta aparte**, sin tocar `portfolio/`.
3. Se compara el estado local con el remoto y con lo realmente publicado, y se informa de las diferencias. El agente no resuelve las diferencias por su cuenta.
4. Ezequiel decide cuál es la fuente de verdad.
5. Se crea el tag **`legacy-v1`** sobre el commit que representa el sitio publicado, sin cambios de modernización. (Reemplaza a `legacy-2023` del plan v2: el estado actual incluye cambios de 2024.) El tag es una referencia de recuperación, no una rama de trabajo.
6. Los artefactos de `docs/audit/` se incorporan al repositorio en una rama de la Fase 0.

### 9.3 Estrategia de ramas

- `main`: producción. **No recibe cambios hasta el release final aprobado (Fase 5).**
- `modernization`: rama de integración. Recibe cada fase aprobada.
- `phase-N-<nombre>`: una rama de trabajo por fase, creada desde `modernization`.

Esta estrategia evita que un merge intermedio publique trabajo a medias si el hosting despliega automáticamente `main`.

### 9.4 Despliegues

- Confirmar si el hosting está conectado al repositorio y si despliega `main` automáticamente.
- Configurar previsualizaciones (deploy previews o branch deploys) para `modernization` y las ramas de fase, sin alterar producción.
- No publicar cambios en producción sin autorización explícita de Ezequiel.
- Nunca usar `push --force`, borrar ramas remotas ni reescribir historial sin pedirlo y obtener aprobación.
- Registrar en la documentación la rama, los commits, las pruebas y la aprobación de cada fase.

## 10. Fase 0 — Auditoría y línea base

**Única tarea autorizada al inicio.** No modifica los archivos existentes de la aplicación. Los artefactos se guardan solo en la carpeta nueva `docs/audit/`.

### Entregables

- `docs/audit/README.md`: alcance, método y resumen.
- `docs/audit/inventory.md`: inventario de archivos, recursos, enlaces (internos y externos) y secciones.
- `docs/audit/findings.md`: hallazgos confirmados, descartados y nuevos.
- `docs/audit/regression-matrix.md`: comportamiento actual, esperado y pasos de verificación.
- `docs/audit/content-gaps.md`: información profesional pendiente, en ambos idiomas.
- `docs/audit/performance-baseline.md`: línea base de rendimiento.
- `docs/audit/i18n-inventory.md`: inventario de **todos** los textos visibles y accesibles (HTML, JS, `aria-label`, `alt`, `title`, typewriter), y evaluación de viabilidad técnica del enfoque de la sección 7.
- `docs/audit/git-hosting.md`: diferencias entre local, remoto y publicado, y hallazgos de hosting (solo lectura).
- Capturas de referencia en `docs/audit/screenshots/`, si el entorno permite generarlas.

### Viewports mínimos

320, 360 y 390 px de ancho; 768 px; 1024 px; 1366 × 768; 1920 px; y apaisado bajo 844 × 390. Registrar navegador, tamaño, problemas visuales y evidencia. **No afirmar que un viewport fue verificado si no se pudo ejecutar la prueba.** Repetir la verificación de desbordes con el texto más largo (español).

### Mediciones obligatorias

- Lighthouse sobre el sitio actual: URL, fecha, dispositivo/modo, puntuaciones y hallazgos.
- Perfil del canvas: FPS y CPU en movimiento normal, movimiento del puntero, resize y pestaña en segundo plano, en la medida en que las herramientas lo permitan.
- Si el sitio no está publicado o no se puede medir, dejar constancia del impedimento y proponer cómo obtener la medición. **No inventar métricas.**

### Ojos en dispositivos táctiles

Presentar estas alternativas a Ezequiel para que elija antes de implementar: (1) seguir el toque mientras interactúa; (2) animación idle sutil, sin seguimiento; (3) ojos estáticos. No elegir en su nombre.

### Aceptación

- Cada interacción tiene un comportamiento esperado verificable.
- Cada contenido pendiente está identificado, por idioma.
- No se modifica código de implementación.
- Se registran dudas y riesgos sin inventar información.

## 11. Fases 1 a 5

### Fase 1 — Fundamentos y arquitectura

**Entregables**
- Configuración de Vite, TypeScript, GSAP y scripts de validación.
- Herramientas de la sección 12, el contrato de ciclo de vida y `docs/DECISIONS.md` con la tabla de propiedad de animaciones.
- Spike de prerender bilingüe con los criterios de la sección 7.8.
- Estructura modular, contratos y reglas de dependencia verificables.
- Tokens de diseño y estilos base.
- Contenido tipado y localizado (`Locale`, `Localized`, `content/ui.ts`).
- Documentación inicial (README, ARCHITECTURE, CONTENT_GUIDE).

**Aceptación**
- Instalación reproducible desde cero.
- TypeScript, lint, formato y build sin errores.
- Sin dependencias circulares injustificadas.
- Ambos idiomas se generan en `dist/` y el compilador detecta traducciones faltantes.
- Responsabilidades de cada módulo documentadas.

### Fase 2 — Responsive y presentación

**Entregables**
- Header adaptable con tres controles (Contrátame, tema, idioma).
- Hero actualizado al perfil profesional, en ambos idiomas.
- Secciones de experiencia, formación, proyectos y certificaciones; proyectos mobile destacados.
- Footer y marquee.
- Layout fluido con `clamp()`, Grid/Flexbox, `dvh` y alturas flexibles.

**Aceptación**
- No hay recortes, solapamientos ni scroll horizontal accidental en los viewports de prueba, en español ni en inglés.
- Los títulos no quedan ocultos bajo el header.
- El contenido es accesible independientemente del scroll-snap.
- El contenido profesional está aprobado por Ezequiel (ambos idiomas).

### Fase 3 — Interacciones y animaciones

**Entregables**
- Navegación accesible y reveal con `IntersectionObserver`.
- Animaciones GSAP con ciclo de vida y limpieza explícitos.
- Canvas optimizado.
- Ojos, tilt, typewriter, marquee y tema.
- Selector de idioma con mejora progresiva (View Transitions) y conservación de sección y tema.
- Alternativas táctiles y de movimiento reducido.

**Aceptación**
- Cada comportamiento de la sección 8 fue probado.
- Las animaciones no se duplican tras reinicializar.
- No hay listeners, observers ni timelines abandonados.
- Las animaciones no bloquean la navegación ni el acceso al contenido.

### Fase 4 — Accesibilidad, SEO y rendimiento

**Entregables**
- Semántica, teclado, foco visible y skip-link.
- Metadatos, Open Graph, favicon y título descriptivos, por idioma; `hreflang`, canonical, sitemap y robots.
- Optimización de imágenes, fuentes y documentos.
- Auditoría de contraste, rendimiento y movimiento reducido.

**Aceptación**
- Objetivo WCAG 2.2 AA para criterios aplicables.
- Sin errores críticos de accesibilidad conocidos.
- Métricas comparadas con la línea base.
- Problemas restantes documentados.

### Fase 5 — Integración, regresión y release

**Entregables**
- Pruebas de regresión y de enlaces, en ambos idiomas.
- Build de producción y configuración del hosting (`netlify.toml` si corresponde).
- Redirecciones 301 de URLs antiguas.
- Validación de rutas, recursos, PDFs y metadatos publicados.
- Documentación final y changelog.
- Release: merge de `modernization` a `main`, solo con autorización explícita.

**Aceptación**
- Despliegue operativo.
- Build y pruebas acordadas aprobados.
- Documentación alineada con el código real.
- Ezequiel puede localizar dónde modificar cada sección y cada traducción siguiendo las guías.

## 12. Fase 1 — herramientas y contratos obligatorios

Seleccionar y configurar:

- **ESLint:** análisis estático y reglas de calidad para TypeScript.
- **Prettier:** formato consistente.
- **`tsc --noEmit`:** comprobación de tipos.
- **dependency-cruiser:** reglas de dependencias que hagan cumplir los límites de la sección 6.
- **Vitest:** pruebas de lógica pura (por ejemplo, la matemática de las partículas o la resolución de tema e idioma), sin convertir cada detalle del DOM en una prueba unitaria artificial.
- **Playwright + axe:** pruebas de humo, regresión funcional y accesibilidad automatizada, en ambos idiomas.

Definir scripts claros para ejecutar cada comprobación por separado y en conjunto, y documentar el propósito de cada herramienta. Las pruebas automáticas complementan, pero no reemplazan, la revisión manual de accesibilidad y comportamiento visual.

### Contrato de ciclo de vida de features

Cada feature interactiva debe tener un contrato explícito de inicialización y limpieza. La inicialización devuelve una función de limpieza que desregistra listeners, desconecta observers, cancela `requestAnimationFrame`, elimina timelines de GSAP y libera cualquier otro recurso. Debe poder inicializarse y limpiarse de forma segura, sin duplicar eventos ni dejar animaciones huérfanas. Documentar qué ocurre si no existen los elementos opcionales que la feature necesita.

### Propiedad de las animaciones

Crear `docs/DECISIONS.md` con una tabla de responsabilidad por elemento y propiedad animada (`transform`, `opacity`, posición del canvas, etc.), con **un único propietario** entre CSS, GSAP o `requestAnimationFrame`, salvo coordinación expresamente justificada. Debe incluir al menos: menú, reveal de secciones, tarjetas, ojos, typewriter, marquee, transición de tema, transición de idioma y partículas. Propuesta de partida, a validar en la Fase 1:

| Elemento | Propietario propuesto |
|---|---|
| Marquee | CSS |
| Reveal de secciones | `IntersectionObserver` + GSAP (stagger) |
| Tilt y ojos | Eventos de puntero + `gsap.quickTo` |
| Partículas | `requestAnimationFrame` propio |
| Transición de tema e idioma | View Transitions API con alternativa sin animación |

## 13. Documentación obligatoria

La documentación principal queda reducida a:

- `README.md`: presentación, requisitos y comandos esenciales.
- `docs/ARCHITECTURE.md`: capas, módulos, dependencias, ciclo de vida y funcionamiento del build bilingüe.
- `docs/CONTENT_GUIDE.md`: cómo actualizar perfil, experiencia, educación, habilidades, proyectos y certificaciones, y **cómo editar o revisar traducciones**.
- `docs/DECISIONS.md`: decisiones técnicas, motivos, alternativas y tabla de propiedad de animaciones.
- `docs/CHANGELOG.md`: cambios relevantes por fase.

Los documentos de auditoría permanecen en `docs/audit/`. No crear documentos separados para animaciones, pruebas, desarrollo o despliegue si su contenido cabe con claridad en los anteriores; si aparece una necesidad real, justificarla antes.

Documentar cada módulo y cada decisión relevante, con comentarios útiles y no repetitivos: qué hace y qué problema resuelve; cómo funciona (entradas, salidas, estados); qué depende de él y qué necesita; por qué se eligió y qué alternativas se descartaron; dónde modificarlo sin romper otras partes; casos límite, compatibilidad y limitaciones. Mantener la documentación actualizada en cada entrega.

## 14. Delegación: tres agentes

1. **Arquitectura + calidad:** estructura, límites de dependencias, configuración de herramientas, contratos, build y prerender bilingüe, pruebas, accesibilidad, SEO técnico (hreflang, sitemap), rendimiento e integración. Custodia las reglas de arquitectura y revisa los criterios de aceptación.
2. **Contenido + documentación:** auditoría del perfil profesional, inventario de proyectos y recursos, contenido tipado y localizado, borradores de traducción marcados como pendientes de aprobación, y documentación. No inventa información y marca todo dato que requiera aprobación de Ezequiel.
3. **UI + interacciones:** componentes, estilos, responsive, navegación, GSAP, canvas, tema, selector de idioma y demás interacciones. Respeta los contratos de ciclo de vida y la tabla de propiedad de animaciones.

Se permite trabajo en paralelo cuando los contratos estén definidos. Ningún agente cambia contratos compartidos o configuración global sin coordinarlo con el lead. El merge por fase y la publicación quedan sujetos a aprobación de Ezequiel.

Cada entrega informa: archivos creados o modificados; decisiones y motivos; pruebas ejecutadas y resultados; riesgos, pendientes y dependencias; documentación actualizada.

## 15. Riesgos y mitigaciones

- **Sobrearquitectura:** mantener el diseño proporcional a un sitio estático; justificar cada capa.
- **Complejidad del prerender bilingüe:** spike en Fase 1 con criterios de éxito; Plan B de la sección 7.2.
- **Regresiones:** inventario inicial, pruebas y migración por módulos.
- **Conflictos GSAP/CSS:** un único responsable por propiedad animada y limpieza de timelines.
- **Accesibilidad perjudicada por movimiento:** `prefers-reduced-motion` y alternativas sin animación.
- **Traducciones inconsistentes o no aprobadas:** modelo lado a lado, compilador que exige ambos idiomas, borradores marcados y aprobación explícita.
- **Layout roto por textos largos:** el español como caso de estrés en todas las pruebas visuales.
- **Despliegue accidental a producción:** `main` intocable hasta Fase 5 y rama de integración `modernization`.
- **Divergencia entre carpeta local, remoto y publicado:** reconciliación documentada antes de etiquetar `legacy-v1`.
- **Enlaces externos rotos (CV y certificados):** inventario de URLs y redirecciones 301.
- **View Transitions sin soporte en algún navegador:** es mejora progresiva; la navegación normal siempre funciona.
- **Documentación desactualizada:** revisarla en cada entrega.
- **Información profesional incorrecta:** verificar todo el contenido con Ezequiel antes de publicarlo.
- **Build correcto pero sitio roto:** comprobar la versión desplegada y sus recursos reales.
- **Conflictos de trabajo paralelo:** límites de responsabilidad y contratos compartidos.

## 16. Actualización del perfil profesional

La auditoría debe recopilar y verificar, en español e inglés:

- Título profesional exacto y fecha.
- Presentación y objetivo profesional actuales.
- Experiencia laboral, fechas, responsabilidades y tecnologías.
- Proyectos que demuestren las capacidades actuales (con capturas, videos, repositorios o APK, si existen).
- Formación y certificaciones vigentes.
- Habilidades mobile, web y full stack.
- CV en ambos idiomas, enlaces públicos, redes y correo de contacto.

El enfoque visual y narrativo será **mobile-first**, sin ocultar la experiencia web. No inventar títulos, fechas, responsabilidades, tecnologías ni logros. Los textos finales, en ambos idiomas, deben ser aprobados por Ezequiel.

Nota de partida: hoy el único proyecto mobile visible es una calculadora de IMC en Flutter, que por sí sola no sostiene el enfoque mobile. Identificar qué proyectos mobile adicionales existen es una dependencia crítica de la Fase 2.

## 17. Decisiones pendientes y bloqueos

No inventar ni asumir estas respuestas. Registrarlas como bloqueos explícitos en el informe de auditoría. La auditoría puede avanzar en lo que no dependa de ellas.

| # | Decisión / dato | Estado | Bloquea |
|---|---|---|---|
| 1 | Idiomas | **Resuelto:** ES/EN | — |
| 2 | Enfoque técnico del idioma | **Resuelto:** prerender por idioma + selector como enlace (sección 7) | — |
| 3 | Intro al cambiar de idioma; persistencia/redirección desde `/` | Propuesta pendiente de confirmar | Fase 3 |
| 4 | URL del repositorio en GitHub | Pendiente | Reconciliación git, tag `legacy-v1` |
| 5 | Proveedor, URL y dominio del sitio publicado; despliegue automático desde `main` | Pendiente ("Netlify u otro") | Línea base Lighthouse, Fase 5 |
| 6 | Fuente de verdad (local vs remoto vs publicado) | Pendiente | Antes de la Fase 1 |
| 7 | Proyectos mobile a destacar y su material | Pendiente | Fase 2 |
| 8 | Título profesional exacto y fecha | Pendiente | Fase 2 |
| 9 | CV en inglés | Pendiente | Fase 2 |
| 10 | Aprobación de traducciones al inglés | Pendiente | Fase 2 en adelante |
| 11 | Alternativa táctil para los ojos | Pendiente (el agente propone, Ezequiel elige) | Fase 3 |

## 18. Criterios globales de finalización

- [ ] Arquitectura y dependencias documentadas y verificables por herramienta.
- [ ] TypeScript, lint y build sin errores.
- [ ] Funcionalidades preservadas o cambios intencionales registrados.
- [ ] Sitio completo en español e inglés, con selector accesible y SEO por idioma.
- [ ] Responsive validado en ambos idiomas.
- [ ] Accesibilidad, SEO y rendimiento auditados.
- [ ] Contenido profesional actualizado y aprobado en ambos idiomas.
- [ ] CV (ES/EN), certificados, recursos y enlaces verificados; URLs antiguas redirigidas.
- [ ] Comentarios y documentación alineados con la implementación.
- [ ] Hosting operativo y producción protegida hasta el release.
- [ ] Guías suficientes para retomar el proyecto meses después.

No fijar porcentajes de cobertura ni puntuaciones Lighthouse arbitrarias antes de medir la línea base y acordar objetivos realistas.

## 19. Instrucción para iniciar con el agente

**Primera tarea autorizada: ejecutar únicamente la Fase 0 (sección 10).**

Inspeccioná los archivos reales en `C:\Users\SystemAncestral\Documents\portfolio`. Confirmá los hallazgos del diagnóstico, inventariá recursos, textos y comportamientos, prepará la matriz de regresión y listá la información profesional faltante. Hacé solo lectura sobre git y hosting; no clones ni modifiques nada por tu cuenta.

No implementes todavía Vite, TypeScript, GSAP, i18n ni cambios de interfaz. Al finalizar, entregá un informe de auditoría con:

1. Hallazgos confirmados, descartados y nuevos.
2. Inventario del proyecto (archivos, recursos, enlaces, textos).
3. Matriz de comportamiento actual y esperado.
4. Datos profesionales que Ezequiel debe aportar o aprobar, por idioma.
5. Riesgos y dependencias.
6. Evaluación de viabilidad del enfoque bilingüe y de la estrategia de ramas.
7. Estado de git y hosting (diferencias local/remoto/publicado) y bloqueos abiertos.
8. Propuesta de orden de migración para su aprobación.

Esperá la aprobación antes de iniciar la Fase 1.
