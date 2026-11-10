// Llamadas a la API del panel de administración (src/app/api/admin/)

import type { Servicio } from '@/tipos/servicio';
import type { ErroresServicio } from '@/utilidades/validarServicio';

export type AdminSesion = {
  correo: string;
  nombre: string;
};

export class ErrorSesion extends Error {}

// El servidor rechazó algunos campos; errores dice cuáles y por qué
export class ErrorValidacion extends Error {
  constructor(
    mensaje: string,
    public errores: ErroresServicio,
  ) {
    super(mensaje);
  }
}

async function pedir<T>(ruta: string, metodo: string, cuerpo?: object): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      credentials: 'same-origin',
      headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisa que `npx expo start` esté corriendo.',
    );
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const mensaje = datos.error ?? 'Ocurrió un error. Intenta de nuevo.';
    if (respuesta.status === 401) {
      throw new ErrorSesion(mensaje);
    }
    throw datos.errores ? new ErrorValidacion(mensaje, datos.errores) : new Error(mensaje);
  }
  return datos as T;
}

export async function obtenerSesionAdmin() {
  const { admin } = await pedir<{ admin: AdminSesion | null }>('/api/admin/sesion', 'GET');
  return admin;
}

export async function iniciarSesionAdmin(correo: string, contrasena: string) {
  const { admin } = await pedir<{ admin: AdminSesion }>('/api/admin/sesion', 'POST', {
    correo,
    contrasena,
  });
  return admin;
}

export async function cerrarSesionAdmin() {
  await pedir('/api/admin/sesion', 'DELETE');
}

export async function solicitarRecuperacion(correo: string) {
  const { mensaje } = await pedir<{ mensaje: string }>('/api/admin/recuperacion', 'POST', {
    correo,
  });
  return mensaje;
}

export async function restablecerContrasena(token: string, contrasena: string) {
  const { mensaje } = await pedir<{ mensaje: string }>('/api/admin/restablecer', 'POST', {
    token,
    contrasena,
  });
  return mensaje;
}

export async function crearServicio(datos: object) {
  const { servicio } = await pedir<{ servicio: Servicio }>('/api/admin/servicios', 'POST', datos);
  return servicio;
}
