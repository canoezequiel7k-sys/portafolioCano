# Inventario de textos e internacionalización

## Cobertura actual

El sitio solo tiene contenido en español. No se encontró selector de idioma, rutas `/en/`, `lang` distinto de `es`, ni sistema de traducciones. El typewriter también genera texto español desde JavaScript. Nombres de marcas/tecnologías, `Full Stack Developer`, `check-in/check-out` y nombres propios aparecen en el texto, pero no constituyen una versión inglesa.

No hay atributos `title` en los elementos. El único `aria-label` explícito es el del botón de tema. No hay regiones live ni mensajes de estado/error declarados. El SVG del personaje no tiene título ni nombre accesible explícito.

## Textos visibles actuales

Transcripción del texto de `index.html` y del string de `script.js`, agrupada por ubicación. Los nombres de producto/tecnología y marcas se mantienen exactamente como aparecen.

| Ubicación | Texto |
|---|---|
| Título de documento y encabezado H1 | `Mi Portafolio` |
| Control de menú | `Menu ☰` |
| Navegación | `Inicio`; `Trabajos`; `Acerca de mí`; `Proyectos` |
| Enlaces sociales del menú | `Instagram`; `LinkedIn`; `GitHub` |
| Acción del header | `Contrátame` |
| Botón de tema | Texto dinámico: `☀️` o `🌙` |
| Etiqueta accesible del tema | `Cambiar tema` |
| Typewriter (`script.js`) | `Hola! soy Ezequiel...` |
| Presentación | `Desarrollador Web y Full Stack Junior` |
| Presentación | `Diseño y desarrollo aplicaciones y sitios web, priorizando rendimiento como la experiencia del usuario.` |
| Experiencia | `Experiencia Laboral` |
| Experiencia | `Operador de TI – Coto CICSA, Av. Boedo:` |
| Experiencia | `Atención y soporte directo a usuarios, resolviendo incidencias de hardware y software de forma rápida y clara. Mantenimiento preventivo de equipos y redes, garantizando la continuidad operativa del negocio. Trabajo en equipo con otras áreas para optimizar procesos, utilizando Windows Server, Active Directory y sistemas de ticketing.` |
| Experiencia | `Full Stack Developer – Hotelera JH, Belgrano:` |
| Experiencia | `Desarrollo de una aplicación de escritorio para hotelería, enfocada en la gestión de habitaciones. Incluye reservas, control de ocupación, check-in y check-out, registro de habitaciones en mantenimiento y generación de reportes de estadía. La herramienta mejoró la organización del personal y agilizó la atención a clientes, utilizando Python + MySQL.` |
| Habilidades | `Herramientas y Habilidades` |
| Etiquetas de iconos del marquee | `GitHub`, `Python`, `Java`, `HTML`, `CSS`, `JavaScript`, `django`, `pygame`, `c++`, `dart`, `flutter`, `MySQL`, `PostgreSQL`, `Linux`, `Git`, `vagrant`, `Docker`; la lista aparece dos veces |
| Habilidades textuales | `Lenguajes: Python, Java, C#, C++` |
| Habilidades textuales | `Base de Datos: PostgreSQL, MySQL` |
| Habilidades textuales | `Desarrollo web: HTML, CSS, JavaScript` |
| Habilidades textuales | `Frameworks / Mobile: Flutter, Django, Dart` |
| Habilidades textuales | `Manejo de Docker, Vagrant y Linux` |
| Acerca | `Acerca de mí`; `Sobre mí 👨‍💻` |
| Acerca | `Me adapto rápido a nuevas herramientas y proyectos, buscando siempre soluciones eficientes y organizadas. Disfruto trabajar en equipo y aprender constantemente para que cada proyecto sea de calidad.` |
| Formación/idiomas | `🎓 Estudiante de Licenciatura en Sistemas (UNLa)` |
| Formación/idiomas | `💻 Técnico en Programación (UTN)` |
| Formación/idiomas | `🌍 Inglés B1 | Portugués A2` |
| CV | `📄 Descargar mi CV` |
| Certificaciones | `📜 Certificaciones & Logros` |
| Certificaciones | `Inglés B1 – Certificado Oficial`; `Introducción C# – freeCodeCamp`; `Curso de Desarrollo Web – CoderHouse` |
| Proyectos | `Proyectos` |
| Proyecto 1 | `Aplicacion de Escritorio` |
| Proyecto 1 | `Aplicación de escritorio para la gestión de habitaciones para Hotelera JH, Belgrano.` |
| Proyecto 1 | `Ver en GitHub` |
| Proyecto 2 | `Aplicacion Móvil` |
| Proyecto 2 | `App sencilla en Flutter para calcular el IMC. Permite ingresar datos y muestra el resultado con una breve descripción.` |
| Proyecto 2 | `Ver en GitHub` |
| Pie | `© 2025 Ezequiel Cano · Desarrollador Web` |
| Pie | `GitHub · LinkedIn · Email` |

## Textos accesibles no visibles o repetidos

- `alt`: iconos de redes `Instagram`, `LinkedIn`, `GitHub`; los 17 iconos de habilidades indicados arriba se repiten (34 instancias); foto `Mi foto`; imágenes `Proyecto 1` y `Proyecto 2`.
- `aria-label`: botón de tema, `Cambiar tema` (no describe el destino de la acción ni cambia con el modo).
- `title`: título del documento `Mi Portafolio`; ningún atributo `title` HTML en enlaces, botones o imágenes.
- Los iconos de marquee duplicados tienen `alt` igual al original y, por tanto, vuelven a exponerse en el árbol accesible.
- Contenido dinámico: `Hola! soy Ezequiel...` se añade carácter por carácter; al terminar se quita el borde/cursor. El botón de tema alterna `☀️`/`🌙`.
- No se encontraron textos de tooltip ni mensajes de éxito/error en el JavaScript.

## Viabilidad del enfoque bilingüe del plan v3

**Viable con un spike de prerender en Fase 1; no probado aún.** Dos páginas estáticas (`/` ES, `/en/` EN) y un selector de idioma como enlace real permiten URL compartible, `lang`, metadatos y SEO por idioma sin renderizar el contenido principal en cliente. Las actuales secciones tienen IDs aptos para conservar el ancla. El texto puede guardarse lado a lado en un tipo localizado que exija ambos idiomas.

Riesgos a validar:

1. La página actual es HTML estático sin build. El prerender debe producir ambos documentos y mantener una misma estructura de IDs, metadatos y enlaces.
2. Recursos como `style.css`, `script.js`, `assets/...` y los PDF se referencian con rutas relativas; bajo `/en/` podrían resolverse dentro de `/en/` y fallar. El spike debe validar URLs de build o definir una base absoluta coherente.
3. La ruta local propuesta `/en/` debe funcionar tanto en servidor de desarrollo como en el hosting confirmado, con enlaces/recarga directa y sin redirección automática.
4. El selector debe preservar sección y tema; hoy no hay idioma ni persistencia de tema sincronizada entre documentos.
5. Hay textos no obvios que también deben localizarse: title/meta/OG, nombres accesibles, `alt`, mensajes futuros, contenido de typewriter y etiquetas.
6. El contenido profesional EN, el CV EN y la aprobación de traducciones son dependencias editoriales. No publicar traducciones sin aprobación.
7. El texto español actual sirve para probar los viewports como caso largo de la versión presente; no representa aún los textos profesionales actualizados que están pendientes.

Recomendación de spike: generar `dist/index.html` y `dist/en/index.html`, probar recarga directa de ambas rutas, resolver todos los recursos, comprobar `lang`, canonical/hreflang, IDs coincidentes y enlaces de idioma con ancla. Solo adoptar el Plan B de intercambio en cliente con aprobación.
