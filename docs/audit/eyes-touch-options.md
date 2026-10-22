# Alternativas táctiles para los ojos del personaje

El comportamiento actual sigue el mouse mediante `mousemove`; no hay alternativa táctil explícita. Se presentan las tres opciones solicitadas, sin seleccionar una.

| Opción | Comportamiento | Pros | Contras |
|---|---|---|---|
| 1. Seguir el toque mientras interactúa | Las pupilas siguen la posición del dedo durante el contacto, con límite SVG de 6 unidades; vuelven al centro al terminar. | Mantiene la interacción más parecida a desktop; respuesta directa y fácil de entender. | El dedo tapa parte del personaje; puede competir con scroll/gestos; requiere resolver `pointer`/cancelación y accesibilidad. |
| 2. Animación idle sutil | Sin seguimiento del toque; pupilas hacen un movimiento pequeño y ocasional, limitado y pausado con pestaña oculta/reduced motion. | No interfiere con gestos; da vida al personaje sin exigir interacción. | Movimiento permanente puede distraer; exige respetar preferencias de movimiento y definir pausa. |
| 3. Estático | Pupilas centradas, sin seguimiento ni animación en táctil. | Más simple, predecible, eficiente y compatible con reduced motion. | Se pierde la interacción expresiva en móvil. |

**Decisión pendiente de Ezequiel antes de implementar la Fase 3.** La alternativa elegida debe verificarse en dispositivo táctil real y no reemplaza soporte para `prefers-reduced-motion`.
