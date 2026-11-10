# Aplicacion Quinchao

Aplicación móvil construida con [Expo](https://expo.dev) (SDK 58), React Native, TypeScript y Expo Router.

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (recomendado: la versión LTS más reciente)
- [Git](https://git-scm.com)
- La app **Expo Go** en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Editor recomendado: [VS Code](https://code.visualstudio.com) (al abrir el proyecto te sugerirá las extensiones necesarias)

## Instalación

```bash
git clone <URL-DEL-REPOSITORIO>
cd aplicacion-quinchao
npm install
```

## Ejecutar la app

```bash
npm start
```

Se mostrará un código QR en la terminal:

- **Android:** escanéalo desde la app Expo Go.
- **iOS:** escanéalo con la cámara del iPhone.

El celular y el computador deben estar en la **misma red Wi-Fi**. Si la red de la universidad bloquea la conexión, usa:

```bash
npx expo start --tunnel
```

## Scripts disponibles

| Comando                | Qué hace                                    |
| ---------------------- | ------------------------------------------- |
| `npm start`            | Inicia el servidor de desarrollo            |
| `npm run android`      | Abre la app en un emulador Android          |
| `npm run web`          | Abre la app en el navegador                 |
| `npm run lint`         | Revisa el código con ESLint                 |
| `npm run format`       | Formatea todo el código con Prettier        |
| `npm run format:check` | Verifica el formato sin modificar archivos  |
| `npm run typecheck`    | Revisa los tipos de TypeScript              |
| `npm run admin:crear`  | Crea una cuenta del panel de administración |

## Panel de administración (web)

El panel para cargar servicios turísticos funciona **solo en el navegador** y vive en la misma app.

1. Crea tu cuenta de administrador (no hay registro público):
   ```bash
   npm run admin:crear
   ```
   Si el correo ya existe, el comando le cambia la contraseña.
2. Inicia el servidor con `npm start` y abre [http://localhost:8081/admin](http://localhost:8081/admin).
3. **Recuperar contraseña:** por ahora no se envían correos de verdad. El enlace aparece en la terminal donde corre `npm start`.

Las cuentas y sesiones se guardan en `datos/privado/admin.json`, que **no** se sube a GitHub: cada integrante crea su propia cuenta en su computador.
Si cambias una ruta API (`src/app/api/`) y no ves el cambio, reinicia `npm start`.

El Excel de ejemplo con datos ficticios está en `datos/ejemplo/`. El Excel con datos reales va en `datos/privado/` y nunca se sube.

**Importar desde Excel:** lee la hoja `Datos` (mismas columnas que el Excel de ejemplo), muestra una vista previa con las filas listas, repetidas o con errores, y guarda solo las listas. Las columnas `id`, `fuente_url` y `fecha_consulta` no se importan.

Los servicios guardados (con el formulario o importados) quedan en `datos/servicios.json`, que **sí** se sube a GitHub y el repositorio es público: no importes ahí datos que no deban ser públicos.

## Estructura del proyecto

```
src/
├── app/           Pantallas y rutas (Expo Router): cada archivo es una pantalla
│   ├── _layout.tsx    Layout raíz de la app
│   ├── (tabs)/        Pestañas: Inicio, Mapa, Categorías y Lugares
│   ├── lugar/[id].tsx Detalle de un lugar
│   ├── admin/         Panel de administración (solo web)
│   └── api/           Rutas API del servidor (archivos +api.ts)
├── componentes/   Componentes visuales reutilizables
├── hooks/         Hooks personalizados (useAlgo)
├── constantes/    Tema (estilos), íconos, categorías y datos de ejemplo
├── servicios/     Llamadas a APIs y almacenamiento (por ahora, los lugares de ejemplo)
├── servidor/      Código que corre solo en el servidor (contraseñas, sesiones)
├── utilidades/    Funciones auxiliares sin React
└── tipos/         Tipos e interfaces de TypeScript compartidos
herramientas/      Comandos de terminal (npm run admin:crear)
datos/             Excel de ejemplo (datos/ejemplo) y datos privados (datos/privado, no se sube)
assets/            Imágenes, íconos y fuentes
```

> La carpeta `src/app/` tiene que llamarse `app`: es el nombre que exige Expo Router.
> Ahí solo van pantallas. Todo lo demás va en las otras carpetas.

Para importar desde `src/` usa el alias `@/`:

```ts
import { BotonPrimario } from '@/componentes/BotonPrimario';
```

## Estilos

Todos los estilos están centralizados en [src/constantes/tema.ts](src/constantes/tema.ts) y vienen de las variables del Figma (paleta del logo de Quinchao):

| Exporta                                 | Qué contiene                                                            |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `PALETA`                                | Las escalas 50–900 de azul, amarillo, celeste, magenta, verde y neutros |
| `COLORES`                               | El uso de cada color: `primario`, `texto`, `borde`, `fondo`…            |
| `TIPOGRAFIA`                            | Estilos de texto en Poppins: `titulo1`, `cuerpo`, `boton`…              |
| `RADIOS`, `BORDES`, `ESPACIOS`, `ICONO` | Bordes redondeados, grosores, márgenes e íconos                         |

```ts
import { COLORES, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

const estilos = StyleSheet.create({
  titulo: { ...TIPOGRAFIA.titulo2, color: COLORES.texto },
  tarjeta: { borderRadius: RADIOS.tarjeta, backgroundColor: COLORES.superficie },
});
```

- **No escribas colores ni tamaños sueltos** (`'#1070BA'`, `fontSize: 15`) en las pantallas: usa el tema.
- **No uses `fontWeight`** con Poppins: cada peso es una fuente distinta y ya viene en `TIPOGRAFIA`.
- **Íconos:** usa `<Icono nombre="..." />`. Son de [Lucide](https://lucide.dev/icons), el mismo set del Figma. Para agregar uno, impórtalo en [src/constantes/iconos.ts](src/constantes/iconos.ts).

## Agregar librerías

Instala siempre con `npx expo install` (no con `npm install`), así se instala la versión compatible con el SDK de Expo:

```bash
npx expo install nombre-de-la-libreria
```

**Ojo con Expo Go:** solo funciona con las librerías nativas que ya trae incluidas. Antes de agregar una librería, revisa en su documentación que sea compatible con Expo Go.

## Cómo colaborar

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de hacer tu primer cambio.
