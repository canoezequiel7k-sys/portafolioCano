# Guía de contenido

## Dónde editar

- Perfil y datos del portafolio: `src/content/profile.ts`.
- Textos de interfaz, títulos y textos accesibles: `src/content/ui.ts`.
- Tipos que fuerzan los dos idiomas: `src/types/content.ts`.
- Las descripciones SEO y Open Graph usan el resumen localizado de `src/content/profile.ts`.
- Los textos alternativos de las capturas pertenecen a cada proyecto en `src/content/profile.ts`.
- Las imágenes WebP nuevas se mantienen junto a los JPG originales para no romper rutas existentes. Los PDFs se optimizan sin cambiar sus nombres ni enlaces.

Para el build público, configurá `SITE_URL` con el origen HTTPS del sitio. En Netlify se usa `URL` como respaldo; `SITE_URL` permite fijar el dominio canónico personalizado. Sin ambos valores no se emiten canonical, alternates, `og:url`, sitemap ni la referencia al sitemap en `robots.txt`. No uses una URL local ni de preview.

Los campos narrativos usan `Localized`, con claves requeridas `es` y `en`. Fechas, URLs, nombres de tecnologías y archivos son valores no localizados cuando no deben traducirse. No añadas texto visible en el renderer o en una interacción: incorpora una entrada al contenido tipado.

El enlace de idioma también se define en `src/content/ui.ts`; cada ruta incluye `hreflang` y `lang` para el idioma de destino. Tras una selección explícita se guarda la preferencia y `/` puede redirigir a `/en/`; no se usa detección del idioma del navegador. La elección se excluye para crawlers.

## Traducciones

El español es predeterminado. El inglés actual es borrador y está marcado en `/en/`; no debe publicarse hasta aprobación de Ezequiel. Mantén cada traducción junto a su original, conserva nombres propios y no agregues credenciales, fechas, logros ni equivalencias académicas que no hayan sido confirmadas.

## Documentos y assets

En Fase 1, los recursos se mantienen en sus rutas existentes (`assets/` y los cuatro PDF de la raíz). El build los copia a `dist/` para conservar enlaces. Cualquier renombrado o cambio de destino requiere inventariar enlaces existentes y definir redirecciones antes de publicarlo.

## Verificación

Ejecuta `npm run typecheck`, `npm run test` y `npm run build`. El tipo `Localized` hace que TypeScript falle cuando se omite un idioma. Playwright comprueba ambos HTML; revisa los textos EN antes de solicitar aprobación.
