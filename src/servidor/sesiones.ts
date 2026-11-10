// Sesiones del panel de administración guardadas en una cookie HttpOnly.
// HttpOnly: el JavaScript de la página no puede leerla (protege contra robo por XSS).
// SameSite=Strict: el navegador no la envía desde otros sitios (protege contra CSRF).

import { createHash, randomBytes } from 'node:crypto';

import { leerDatosAdmin, modificarDatosAdmin, type Admin } from './almacenAdmin.ts';

const NOMBRE_COOKIE = 'quinchapp_admin';
const DURACION_SESION_MS = 8 * 60 * 60 * 1000;

export function crearToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function leerCookie(request: Request, nombre: string) {
  const cookies = request.headers.get('cookie') ?? '';
  for (const parte of cookies.split(';')) {
    const [clave, ...valor] = parte.trim().split('=');
    if (clave === nombre) {
      return valor.join('=');
    }
  }
  return undefined;
}

function armarCookie(request: Request, valor: string, maxAgeSegundos: number) {
  // Secure obliga a usar https; en desarrollo local se usa http, así que solo se agrega con https
  const segura = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${NOMBRE_COOKIE}=${valor}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSegundos}${segura}`;
}

export async function iniciarSesion(request: Request, adminId: string) {
  const token = crearToken();
  await modificarDatosAdmin((datos) => {
    datos.sesiones.push({
      hashToken: hashToken(token),
      adminId,
      expiraEn: Date.now() + DURACION_SESION_MS,
    });
  });
  return armarCookie(request, token, DURACION_SESION_MS / 1000);
}

export async function cerrarSesion(request: Request) {
  const token = leerCookie(request, NOMBRE_COOKIE);
  if (token) {
    const hash = hashToken(token);
    await modificarDatosAdmin((datos) => {
      datos.sesiones = datos.sesiones.filter((sesion) => sesion.hashToken !== hash);
    });
  }
  return armarCookie(request, '', 0);
}

export async function cerrarTodasLasSesiones(adminId: string) {
  await modificarDatosAdmin((datos) => {
    datos.sesiones = datos.sesiones.filter((sesion) => sesion.adminId !== adminId);
  });
}

// Devuelve el admin dueño de la cookie, o null si no hay sesión válida
export async function obtenerAdminDeSesion(request: Request): Promise<Admin | null> {
  const token = leerCookie(request, NOMBRE_COOKIE);
  if (!token) {
    return null;
  }
  const hash = hashToken(token);
  const datos = await leerDatosAdmin();
  const sesion = datos.sesiones.find((s) => s.hashToken === hash && s.expiraEn > Date.now());
  return datos.admins.find((admin) => admin.id === sesion?.adminId) ?? null;
}
