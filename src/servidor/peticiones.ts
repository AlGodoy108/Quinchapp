// Ayudas comunes para las rutas API del panel de administración

import type { Admin } from './almacenAdmin.ts';
import { obtenerAdminDeSesion } from './sesiones.ts';

const CABECERAS_SEGURAS = {
  // Las respuestas con datos de sesión no se guardan en caché
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function responder(datos: unknown, estado = 200, cabeceras: Record<string, string> = {}) {
  return Response.json(datos, { status: estado, headers: { ...CABECERAS_SEGURAS, ...cabeceras } });
}

export function responderError(estado: number, mensaje: string) {
  return responder({ error: mensaje }, estado);
}

// Las peticiones que cambian algo solo se aceptan si vienen de esta misma página.
// Así otro sitio no puede enviar formularios usando la sesión del admin (CSRF).
export function origenValido(request: Request) {
  const origen = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origen || !host) {
    return false;
  }
  try {
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

// Lee el cuerpo JSON y devuelve solo los campos de texto pedidos
export async function leerCamposTexto<C extends string>(request: Request, campos: readonly C[]) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return null;
  }
  if (typeof cuerpo !== 'object' || cuerpo === null) {
    return null;
  }
  const resultado = {} as Record<C, string>;
  for (const campo of campos) {
    const valor = (cuerpo as Record<string, unknown>)[campo];
    if (typeof valor !== 'string') {
      return null;
    }
    resultado[campo] = valor;
  }
  return resultado;
}

// Para rutas que solo puede usar un admin con sesión. Devuelve el admin o una respuesta de error.
export async function exigirAdmin(request: Request): Promise<Admin | Response> {
  if (request.method !== 'GET' && !origenValido(request)) {
    return responderError(403, 'Petición rechazada.');
  }
  const admin = await obtenerAdminDeSesion(request);
  return admin ?? responderError(401, 'Tu sesión expiró. Vuelve a ingresar.');
}

export function datosPublicosAdmin(admin: Admin) {
  return { correo: admin.correo, nombre: admin.nombre };
}
