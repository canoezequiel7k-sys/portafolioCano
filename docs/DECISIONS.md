# Decisiones técnicas

## Fase 1

| Decisión                                   | Motivo                                                                                                                            | Estado             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Vite + TypeScript estricto                 | Build estático, rutas de desarrollo sencillas y datos localizados tipados.                                                        | Implementado       |
| ES/EN prerenderizados por URL              | `/` conserva el idioma por defecto; `/en/` tiene URL propia y markup disponible sin renderizar el contenido de perfil en cliente. | Spike implementado |
| Renderer puro de HTML                      | Separa contenido de DOM; permite construir ambos idiomas en build.                                                                | Implementado       |
| EN permanece como borrador `noindex`       | La traducción no está aprobada; no debe indexarse/publicarse como definitiva.                                                     | Hasta aprobación   |
| Mantener temporalmente CSS y script legacy | Fase 1 configura arquitectura; el rediseño y migración de interacciones pertenecen a fases posteriores.                           | Provisional        |
| Conservar rutas actuales de PDF y assets   | Evita romper URLs potencialmente compartidas.                                                                                     | Implementado       |
| Netlify publica `dist/` en build           | Proveedor confirmado; la configuración no se ha desplegado desde esta rama.                                                       | Preliminar         |

## Fase 2

| Decisión                                | Motivo                                                                                      | Estado       |
| --------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| Conservar el scroll dentro de `main`    | Mantiene el comportamiento legacy de navegación y reveal mientras se hace fluido el layout. | Implementado |
| Permitir que las secciones crezcan      | El contenido no se recorta en móvil, apaisado o con texto más largo.                        | Implementado |
| Selector ES/EN como enlace con fallback | Funciona sin JavaScript y anuncia idioma de destino con `hreflang` y `lang`.                | Implementado |
| Mantener EN como borrador               | El enlace no constituye aprobación editorial ni habilita indexación.                        | Sin cambios  |

## Fase 3

| Decisión                                         | Motivo                                                                                        | Estado       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------ |
| Menú como botón accesible                        | `aria-expanded`, enlaces inertes al cerrar, Tab/foco, cierre con Escape y click externo.      | Implementado |
| Reveal con IntersectionObserver y GSAP           | Conserva el stagger de 150 ms y evita cálculos por cada evento de scroll.                     | Implementado |
| Canvas de 180 partículas con pausa y DPR         | Evita trabajo oculto, mantiene partículas en resize y protege los cálculos no finitos.        | Implementado |
| Ojos siguen puntero fino; idle en táctil         | Ezequiel eligió idle táctil; seguimiento acotado a seis unidades SVG en dispositivos finos.   | Implementado |
| Tilt GSAP solo con hover/puntero fino            | Conserva intensidades 8 y 12 sin competir con gestos táctiles.                                | Implementado |
| Typewriter 120 ms; no reiniciar en cambio idioma | Preferencia elegida por Ezequiel; reduced motion completa el texto sin animarlo.              | Implementado |
| Marquee CSS duplicado accesible                  | Dos grupos idénticos, copia oculta a lectores de pantalla y ciclo de 25 segundos.             | Implementado |
| Tema e idioma con mejora View Transitions        | Persiste tema y sección; fallback normal. El idioma se recuerda solo tras elección explícita. | Implementado |
| Excluir crawlers de la redirección por idioma    | La preferencia guardada no altera el idioma de rastreo ni crea detección automática.          | Implementado |

## Propiedad de animaciones

Cada propiedad animada tiene un único propietario salvo coordinación documentada:

| Elemento                     | Propietario actual          | Propuesta objetivo                                    | Fase |
| ---------------------------- | --------------------------- | ----------------------------------------------------- | ---- |
| Menú                         | CSS + feature de navegación | CSS + feature de navegación; transiciones simples CSS | 3    |
| Reveal de secciones/tarjetas | IntersectionObserver + GSAP | IntersectionObserver + GSAP stagger                   | 3    |
| Ojos                         | Feature GSAP                | Seguimiento limitado; idle táctil GSAP                | 3    |
| Tilt                         | Feature GSAP                | Una feature, GSAP quickTo                             | 3    |
| Typewriter                   | Feature TypeScript          | Feature aislada, con reduced motion                   | 3    |
| Marquee                      | CSS                         | CSS                                                   | 3    |
| Tema                         | Feature + View Transitions  | View Transitions con alternativa CSS                  | 3    |
| Idioma                       | Enlace HTML + feature       | Navegación nativa y View Transitions progresivas      | 3    |
| Partículas                   | Feature canvas con rAF      | rAF propio, pausado en segundo plano                  | 3    |

Las rutas Vite ya no cargan `script.js`: las interacciones migradas se inicializan desde `src/features/index.ts` y devuelven limpieza para HMR. El archivo y el HTML legacy de la raíz se conservan juntos para no dejar rota esa entrada independiente.
