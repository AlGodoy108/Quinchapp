// Lectura y escritura segura de un archivo JSON local, usado como base de datos simple

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function crearArchivoJson<T extends object>(ruta: string, vacio: T, modo = 0o644) {
  async function leer(): Promise<T> {
    try {
      const texto = await readFile(ruta, 'utf8');
      return { ...structuredClone(vacio), ...JSON.parse(texto) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return structuredClone(vacio);
      }
      throw error;
    }
  }

  // Las escrituras se hacen de a una para que dos peticiones simultáneas no se pisen
  let colaEscritura: Promise<unknown> = Promise.resolve();

  function modificar<R>(cambio: (datos: T) => R): Promise<R> {
    const tarea = colaEscritura.then(async () => {
      const datos = await leer();
      const resultado = cambio(datos);
      // Se escribe en un archivo temporal y luego se renombra, así nunca queda un JSON a medias
      await mkdir(path.dirname(ruta), { recursive: true });
      const temporal = `${ruta}.${process.pid}.tmp`;
      await writeFile(temporal, `${JSON.stringify(datos, null, 2)}\n`, { mode: modo });
      await rename(temporal, ruta);
      return resultado;
    });
    colaEscritura = tarea.catch(() => {});
    return tarea;
  }

  return { leer, modificar };
}
