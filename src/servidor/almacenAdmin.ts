// Guarda cuentas de administrador, sesiones y enlaces de recuperación en un archivo JSON local.
// Vive en datos/privado/ (ignorado por git) porque contiene datos de acceso.
// Cuando exista una base de datos real, solo hay que reemplazar este archivo.

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

export async function leerDatosAdmin(): Promise<DatosAdmin> {
  try {
    const texto = await readFile(ARCHIVO, 'utf8');
    return { ...DATOS_VACIOS, ...JSON.parse(texto) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return structuredClone(DATOS_VACIOS);
    }
    throw error;
  }
}

// Las escrituras se hacen de a una para que dos peticiones simultáneas no se pisen
let colaEscritura: Promise<unknown> = Promise.resolve();

export function modificarDatosAdmin<T>(cambio: (datos: DatosAdmin) => T): Promise<T> {
  const tarea = colaEscritura.then(async () => {
    const datos = await leerDatosAdmin();
    const ahora = Date.now();
    datos.sesiones = datos.sesiones.filter((sesion) => sesion.expiraEn > ahora);
    datos.recuperaciones = datos.recuperaciones.filter((rec) => rec.expiraEn > ahora);

    const resultado = cambio(datos);

    // Se escribe en un archivo temporal y luego se renombra, así nunca queda un JSON a medias
    await mkdir(path.dirname(ARCHIVO), { recursive: true });
    const temporal = `${ARCHIVO}.${process.pid}.tmp`;
    await writeFile(temporal, JSON.stringify(datos, null, 2), { mode: 0o600 });
    await rename(temporal, ARCHIVO);
    return resultado;
  });
  colaEscritura = tarea.catch(() => {});
  return tarea;
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
