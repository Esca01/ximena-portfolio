# Portafolio — Ximena Córdoba

Portafolio profesional **bilingüe (ES/EN)** con modo claro/oscuro, hoja de vida en
formato **ATS** y un **panel de administración** para editar el contenido sin tocar código.
Las ediciones del panel y la foto se guardan en **Vercel Blob**, así que son visibles
**para todos los visitantes** (no solo en el navegador de quien edita).

## Páginas

| URL      | Archivo       | Descripción |
|----------|---------------|-------------|
| `/`      | `index.html`  | Página principal del portafolio |
| `/cv`    | `cv.html`     | Hoja de vida en formato ATS (botón “Descargar PDF”) |
| `/admin` | `admin.html`  | Panel para editar el contenido (con login) |

## Cómo funciona la persistencia

- El contenido **por defecto** vive en `data.js` (lo que se ve si nunca se ha editado).
- El panel `/admin` guarda los cambios en **Vercel Blob** mediante funciones serverless
  (`/api/content`, `/api/photo`), por lo que **todos los visitantes ven la última versión**.
- Cada navegador guarda además una **copia local** (localStorage) para pintar al instante
  y funcionar sin conexión; al cargar, la página se sincroniza con la versión global.
- El **tema** (claro/oscuro) y el **idioma** son preferencias por visitante.

## Variables de entorno

| Variable | Para qué | Cómo se crea |
|----------|----------|--------------|
| `BLOB_READ_WRITE_TOKEN` | Leer/escribir en Vercel Blob | Se añade **sola** al crear el Blob Store en Vercel |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`, validada en el servidor | La defines tú en **Settings → Environment Variables** |

> La contraseña del admin ya **no** está en el código ni en el navegador: se valida en el
> servidor contra `ADMIN_PASSWORD`. Para cambiarla, edita esa variable en Vercel y vuelve a
> desplegar (**Deployments → ⋯ → Redeploy**).

## Desarrollo local

Requiere las funciones serverless, así que se usa el CLI de Vercel:

```bash
npm install
vercel link            # enlaza con el proyecto de Vercel (una vez)
vercel env pull        # trae BLOB_READ_WRITE_TOKEN y ADMIN_PASSWORD a .env.local
npm run dev            # = vercel dev  →  http://localhost:3000
```

Vista rápida solo del frontend (sin admin/persistencia): `npx serve .`

## Editar el código

El sitio carga **React de producción** (en `vendor/`) y JavaScript **precompilado** —
no transpila en el navegador. Si editas `app.jsx`, `cv.jsx` o `admin.jsx`, recompila:

```bash
npm run compile        # esbuild: *.jsx → *.js (app.js, cv.js, admin.js)
```

Los archivos compilados (`app.js`, `cv.js`, `admin.js`) se versionan en el repo, así que
Vercel **solo instala dependencias** (no hace build). Editar contenido desde `/admin` **no**
requiere recompilar.

## Estructura

```
api/            Funciones serverless (content, photo, login)
lib/            Helper de autenticación compartido
vendor/         React + ReactDOM de producción (auto-alojados)
scripts/        build.mjs (compilación de JSX)
*.html          Páginas
*.jsx / *.js    Fuentes React y su compilado
data.js         Contenido por defecto (bilingüe)
store.js        Capa de datos + apariencia + sincronización con Blob
image-slot.js   Componente de imagen (solo visualización en producción)
```

## Desplegar

Conectado a GitHub: cada `git push` a la rama principal despliega automáticamente en Vercel.
Primer despliegue y configuración de Blob/variables: ver el panel de Vercel del proyecto.
