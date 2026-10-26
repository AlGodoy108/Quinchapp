# Guía para colaborar

## Flujo de trabajo

1. **Nunca trabajes directo en `main`.** `main` siempre debe funcionar.
2. Actualiza tu copia antes de empezar:
   ```bash
   git checkout main
   git pull
   ```
3. Crea una rama para tu tarea:
   ```bash
   git checkout -b feature/pantalla-login
   ```
4. Haz commits pequeños y frecuentes.
5. Antes de subir, verifica que todo esté bien:
   ```bash
   npm run lint
   npm run typecheck
   ```
6. Sube tu rama y abre un **Pull Request** en GitHub hacia `main`.
7. Otra persona del equipo revisa el PR antes de hacer merge.

## Nombres de ramas

| Prefijo     | Uso                                        | Ejemplo                      |
| ----------- | ------------------------------------------ | ---------------------------- |
| `feature/`  | Funcionalidad nueva                        | `feature/mapa-de-lugares`    |
| `fix/`      | Corrección de un error                     | `fix/boton-no-responde`      |
| `docs/`     | Solo documentación                         | `docs/actualizar-readme`     |
| `refactor/` | Reorganizar código sin cambiar lo que hace | `refactor/separar-servicios` |

Usa minúsculas y guiones, sin tildes ni espacios.

## Mensajes de commit

Formato: `tipo: descripción corta en presente`

```
feat: agrega pantalla de inicio de sesión
fix: corrige el cierre de la app al volver atrás
docs: explica cómo usar el túnel en el README
style: formatea componentes con prettier
refactor: mueve llamadas a la API a servicios
```

## Convenciones de código

- **Idioma:** el código se escribe en español (variables, funciones, componentes, carpetas).
  Las palabras reservadas y las APIs de librerías quedan en inglés, como es obvio (`useState`, `View`, `StyleSheet`).
- **Componentes:** PascalCase, un componente por archivo: `TarjetaLugar.tsx`.
- **Hooks:** empiezan con `use`: `useUbicacion.ts`.
- **Funciones y variables:** camelCase: `obtenerLugares`, `listaDeLugares`.
- **Constantes globales:** MAYÚSCULAS: `URL_API`.
- **Pantallas:** solo dentro de `src/app/`. Los nombres de archivo de rutas van en minúsculas con guiones: `src/app/detalle-lugar.tsx`.
- **Formato:** lo hace Prettier automáticamente. En VS Code se aplica al guardar si tienes instaladas las extensiones recomendadas.

## Datos sensibles

- **Nunca** subas contraseñas, claves de API ni tokens al repositorio.
- Usa un archivo `.env.local` (ya está en `.gitignore`) y comparte las claves por un canal privado.
- En Expo, las variables que la app necesita deben empezar con `EXPO_PUBLIC_`. **Toda variable `EXPO_PUBLIC_` queda visible dentro de la app**, así que no pongas ahí nada secreto.
