# servidor

Código que corre **solo en el servidor**: contraseñas, sesiones, archivos privados.

- Solo se importa desde rutas API (`src/app/**/*+api.ts`) o desde `herramientas/`. **Nunca** desde pantallas ni componentes: terminaría dentro de la app y del navegador.
- Entre archivos de esta carpeta, importa con ruta relativa y extensión (`./sesiones.ts`), no con `@/`. Así también funcionan con `node` directamente (por ejemplo `npm run admin:crear`).
