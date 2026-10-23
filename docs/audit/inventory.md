# Inventario del proyecto

## Archivos y pesos

Pesos observados localmente. `assets/` contiene 21 iconos y 3 imágenes. No se incluyen archivos generados ni dependencias.

| Ruta | Bytes |
|---|---:|
| `index.html` | 10.266 |
| `style.css` | 17.079 |
| `script.js` | 8.190 |
| `README.MD` | 21 |
| `cv_ezequiel.pdf` | 101.243 |
| `ingles_certificado.pdf` | 60.524 |
| `freecodecamp.pdf` | 368.201 |
| `coderhause.pdf` | 1.603.412 |
| `assets/icons/c++.svg` | 1.143 |
| `assets/icons/css.svg` | 3.468 |
| `assets/icons/dart.svg` | 710 |
| `assets/icons/django.svg` | 644 |
| `assets/icons/docker.svg` | 4.452 |
| `assets/icons/flutter.svg` | 646 |
| `assets/icons/git.svg` | 778 |
| `assets/icons/github.png` | 13.104 |
| `assets/icons/github.svg` | 1.866 |
| `assets/icons/html.svg` | 674 |
| `assets/icons/instagram.png` | 9.594 |
| `assets/icons/java.svg` | 1.540 |
| `assets/icons/javascript.svg` | 1.144 |
| `assets/icons/kotlin.svg` | 502 |
| `assets/icons/linkedin.png` | 4.699 |
| `assets/icons/linux.svg` | 193.922 |
| `assets/icons/mysql.svg` | 2.765 |
| `assets/icons/postgresql.svg` | 9.178 |
| `assets/icons/pygame.png` | 15.200 |
| `assets/icons/python.svg` | 2.300 |
| `assets/icons/vagrant.png` | 18.611 |
| `assets/images/foto-perfil.jpg` | 103.638 |
| `assets/images/proyecto1.jpg` | 148.998 |
| `assets/images/proyecto2.jpg` | 248.951 |
| `Plan_modernizacion_portafolio_Ezequiel_v3.md` | 37.742 |
| `ROADMAP_portafolio_Ezequiel.md` | 15.475 |

**Totales:** 34 archivos y 3.010.680 bytes (2,87 MiB), incluyendo plan y roadmap. Archivos de aplicación sin esos dos documentos: 2.957.463 bytes (2,82 MiB). Los cuatro PDF suman 2.133.380 bytes (2,03 MiB); `coderhause.pdf` representa 1.603.412 bytes.

`assets/icons/kotlin.svg` existe pero no está referenciado por el HTML. De los iconos del marquee, los 17 nombres se repiten dos veces para la animación.

## Secciones y recursos de la página

`index.html` contiene cuatro `<section>`:

| ID | Contenido |
|---|---|
| `inicio` | Personaje SVG, typewriter, presentación y rol profesional |
| `trabajos` | Dos experiencias, marquee de habilidades y lista de tecnologías |
| `acerca` | Foto, perfil, formación/idiomas, CV y certificaciones |
| `proyectos` | Aplicación de escritorio y aplicación móvil |

El pie `footer#contacto.seccion` es una quinta área desplazable, pero no un elemento `<section>`. El menú ofrece anclas a `inicio`, `trabajos`, `acerca` y `proyectos`; no incluye `contacto`.

Recursos usados: `style.css`, `script.js`; iconos sociales PNG, 17 iconos de tecnologías, tres JPG, y cuatro PDF. Se comprobó que las 29 rutas relativas únicas referidas por HTML existen. El HTML no declara dimensiones ni carga diferida para sus tres imágenes JPG.

## Enlaces

### Internos

- Anclas: `#inicio`, `#trabajos`, `#acerca`, `#proyectos`; `href="#"` en el control que abre/cierra menú.
- Hojas y scripts: `style.css`, `script.js`.
- Imagen de perfil: `assets/images/foto-perfil.jpg`.
- Imágenes de proyecto: `assets/images/proyecto1.jpg`, `assets/images/proyecto2.jpg`.
- Iconos sociales: `assets/icons/instagram.png`, `assets/icons/linkedin.png`, `assets/icons/github.png`.
- Marquee: `assets/icons/github.svg`, `python.svg`, `java.svg`, `html.svg`, `css.svg`, `javascript.svg`, `django.svg`, `pygame.png`, `c++.svg`, `dart.svg`, `flutter.svg`, `mysql.svg`, `postgresql.svg`, `linux.svg`, `git.svg`, `vagrant.png`, `docker.svg`; cada uno se presenta dos veces.
- PDF: `cv_ezequiel.pdf` (CV), `ingles_certificado.pdf` (dos enlaces), `freecodecamp.pdf`, `coderhause.pdf`.

Los cinco enlaces a PDF usan rutas/nombres públicos simples. **Podrían estar compartidos o enlazados externamente**; no se recibió evidencia para confirmar desde qué sitios. No renombrar ni mover sin inventario remoto y redirecciones aprobadas. El nombre `coderhause.pdf` se conserva tal como existe.

### Externos

Hay nueve instancias de enlaces externos en el HTML, seis destinos únicos:

| Destino | Uso | Posible referencia externa |
|---|---|---|
| `https://www.instagram.com/canoezequiel7k/` | Icono social | Perfil público; confirmar que siga vigente |
| `https://www.linkedin.com/in/canoezequiel7k-sys/` | Icono y pie | Perfil público; posible enlace externo |
| `https://github.com/canoezequiel7k-sys` | Icono y pie | Perfil público; posible enlace externo |
| `https://github.com/canoezequiel7k-sys/BelgranoJH.git` | Proyecto de escritorio | Repositorio de proyecto; confirmar URL pública |
| `https://github.com/canoezequiel7k-sys/Imc_calculator_app.git` | Proyecto móvil | Repositorio de proyecto; confirmar URL pública |
| `mailto:canoezequiel63@gmail.com` | Contrátame y pie | Dirección pública; puede estar enlazada en otros sitios |

El estado HTTP y la titularidad de esos destinos no se verificaron.

## Archivos de infraestructura observados

No se encontraron `.git/`, `.gitignore`, `netlify.toml`, `_redirects` ni `CNAME` en la carpeta local. Esto describe solo la copia local; no demuestra el estado del remoto o del hosting.
