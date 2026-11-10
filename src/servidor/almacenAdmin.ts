// Guarda cuentas de administrador, sesiones y enlaces de recuperación en un archivo JSON local.
// Vive en datos/privado/ (ignorado por git) porque contiene datos de acceso.
// Cuando exista una base de datos real, solo hay que reemplazar este archivo.

import { randomUUID } from 'node:crypto';
import path from 'node:path';

import { crearArchivoJson } from './archivoJson.ts';

export type Admin = {
  id: string;
  correo: string;
  nombre: string;
  hashContrasena: string;
  creadoEn: string;
  contrasenaCambiadaEn: string;
};

export type Sesion = {
  // Se guarda el hash del token, nunca el token: si alguien lee el archivo no puede usarlo
  hashToken: string;
  adminId: string;
  expiraEn: number;
};

export type Recuperacion = {
  hashToken: string;
  adminId: string;
  expiraEn: number;
};

export type IntentosFallidos = {
  fallos: number;
  bloqueadoHasta: number;
};

export type DatosAdmin = {
  admins: Admin[];
  sesiones: Sesion[];
  recuperaciones: Recuperacion[];
  // La clave es el correo en minúsculas
  intentos: Record<string, IntentosFallidos>;
};

// ARCHIVO_ADMIN permite usar otro archivo, por ejemplo para pruebas
const ARCHIVO =
  process.env.ARCHIVO_ADMIN ?? path.join(process.cwd(), 'datos', 'privado', 'admin.json');

const DATOS_VACIOS: DatosAdmin = { admins: [], sesiones: [], recuperaciones: [], intentos: {} };

// Permisos 600: solo el usuario del computador puede leer el archivo
const archivo = crearArchivoJson(ARCHIVO, DATOS_VACIOS, 0o600);

export const leerDatosAdmin = archivo.leer;

export function modificarDatosAdmin<T>(cambio: (datos: DatosAdmin) => T): Promise<T> {
  return archivo.modificar((datos) => {
    const ahora = Date.now();
    datos.sesiones = datos.sesiones.filter((sesion) => sesion.expiraEn > ahora);
    datos.recuperaciones = datos.recuperaciones.filter((rec) => rec.expiraEn > ahora);
    return cambio(datos);
  });
}

export function normalizarCorreo(correo: string) {
  return correo.trim().toLowerCase();
}

export function buscarAdminPorCorreo(datos: DatosAdmin, correo: string) {
  const buscado = normalizarCorreo(correo);
  return datos.admins.find((admin) => admin.correo === buscado);
}

export function nuevoAdmin(correo: string, nombre: string, hashContrasena: string): Admin {
  const ahora = new Date().toISOString();
  return {
    id: randomUUID(),
    correo: normalizarCorreo(correo),
    nombre: nombre.trim(),
    hashContrasena,
    creadoEn: ahora,
    contrasenaCambiadaEn: ahora,
  };
}

export const RUTA_ARCHIVO_ADMIN = ARCHIVO;
