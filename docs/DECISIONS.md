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

## Propiedad de animaciones

Cada propiedad animada debe tener un único propietario salvo coordinación documentada. Propuesta a validar antes de migrar:

| Elemento                     | Propietario actual | Propuesta objetivo                                           | Fase |
| ---------------------------- | ------------------ | ------------------------------------------------------------ | ---- |
| Menú                         | CSS + `script.js`  | CSS + feature de navegación; transiciones simples CSS        | 3    |
| Reveal de secciones/tarjetas | CSS + `script.js`  | IntersectionObserver + GSAP stagger                          | 3    |
| Ojos                         | `script.js`        | Feature de puntero/GSAP quickTo                              | 3    |
| Tilt                         | CSS + `script.js`  | Una feature, GSAP quickTo                                    | 3    |
| Typewriter                   | CSS + `script.js`  | Feature aislada, con reduced motion                          | 3    |
| Marquee                      | CSS                | CSS                                                          | 3    |
| Tema                         | CSS + `script.js`  | View Transitions con alternativa                             | 3    |
| Idioma                       | No existe          | View Transitions progresivas y navegación normal de respaldo | 3    |
| Partículas                   | rAF en `script.js` | rAF propio                                                   | 3    |

No se inicializan timelines GSAP en esta fase; la matriz es una propuesta de propiedad para el trabajo de interacciones.
