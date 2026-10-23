# Estado de Git y hosting

## Copia local

- Ruta inspeccionada: `C:\Users\SystemAncestral\Documents\portfolio`.
- La comprobación del sistema de archivos confirmó que no existe `.git/`. Por ello no hay estado, rama, historial ni remotos consultables desde esta carpeta; no se ejecutaron comandos de Git.
- Tampoco hay `.gitignore`, `netlify.toml`, `_redirects` ni `CNAME`.
- No se clonó ni modificó repositorio, no se crearon ramas/tags y no se hicieron commits ni pushes.

## Remoto y publicación

- El plan afirma que existe un repositorio GitHub, pero su URL está pendiente. **NO VERIFICADO de forma independiente**; no se puede comparar remoto con local.
- URL pública, dominio y proveedor (Netlify u otro): **NO VERIFICADOS**.
- Conexión del hosting con GitHub, rama de despliegue automático y posibilidad de previews: **NO VERIFICADAS**.
- Diferencias entre local, remoto y sitio publicado: **NO VERIFICADAS**. La copia local contiene HTML/CSS/JS estáticos y cuatro PDF, pero no puede declararse fuente de verdad.

## Datos que debe aportar Ezequiel para G0

1. URL exacta del repositorio GitHub.
2. URL del sitio publicado, proveedor y dominio(s).
3. Qué rama despliega producción y si hay despliegue automático desde `main`.
4. Qué versión considera fuente de verdad tras comparar local, remoto y publicado.
5. Confirmar si se permiten mediciones Lighthouse de solo lectura en el sitio público.

La secuencia segura del plan —comparar primero, decidir fuente de verdad, y solo luego establecer la referencia `legacy-v1` y ramas de trabajo— es razonable, pero queda bloqueada por esos datos y aprobación. El agente no ejecutó ni propone ejecutar operaciones de Git; Ezequiel mantiene el control de todas ellas. Mantener `main` sin cambios hasta el release aprobado y confirmar previews antes de cualquier despliegue.
