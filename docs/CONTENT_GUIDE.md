# Guía de contenido

## Dónde editar

- Perfil y datos del portafolio: `src/content/profile.ts`.
- Textos de interfaz, títulos y textos accesibles: `src/content/ui.ts`.
- Tipos que fuerzan los dos idiomas: `src/types/content.ts`.
- Las descripciones SEO y Open Graph usan el resumen localizado de `src/content/profile.ts`.
- Los textos alternativos de las capturas pertenecen a cada proyecto en `src/content/profile.ts`.
- Las imágenes WebP nuevas se mantienen junto a los JPG originales para no romper rutas existentes. Los certificados mantienen sus rutas; los CV se publican como `/cv-es.pdf` y `/cv-en.pdf`.

Para el build público, configurá `SITE_URL` con el origen HTTPS del sitio. En Netlify se usa `URL` como respaldo; `SITE_URL` permite fijar el dominio canónico personalizado. Sin ambos valores no se emiten canonical, alternates, `og:url`, sitemap ni la referencia al sitemap en `robots.txt`. No uses una URL local ni de preview.

Los campos narrativos usan `Localized`, con claves requeridas `es` y `en`. Fechas, URLs, nombres de tecnologías y archivos son valores no localizados cuando no deben traducirse. No añadas texto visible en el renderer o en una interacción: incorpora una entrada al contenido tipado.

El enlace de idioma también se define en `src/content/ui.ts`; cada ruta incluye `hreflang` y `lang` para el idioma de destino. Tras una selección explícita se guarda la preferencia y `/` puede redirigir a `/en/`; no se usa detección del idioma del navegador. La elección se excluye para crawlers.

## Traducciones

El español es predeterminado. Ezequiel aprobó el contenido inglés el 2026-10-23. Mantén cada traducción junto a su original, conserva nombres propios y no agregues credenciales, fechas, logros ni equivalencias académicas que no hayan sido confirmadas.

## Documentos y assets

Los recursos se mantienen en `assets/` y el build copia los archivos necesarios a `dist/`. Los certificados conservan sus URLs originales. Los CV nuevos se copian como `cv-es.pdf` y `cv-en.pdf`; `/cv_ezequiel.pdf` redirige al CV español mediante Netlify. El contenido inglés del sitio fue aprobado y es indexable.

## Verificación

Ejecuta `npm run typecheck`, `npm run test` y `npm run build`. El tipo `Localized` hace que TypeScript falle cuando se omite un idioma. Playwright comprueba ambos HTML; revisa los textos EN antes de solicitar aprobación.
