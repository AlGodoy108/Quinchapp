// Lee la hoja "Datos" de un Excel de oferta turística en el navegador.
// Solo transforma las celdas al formato del formulario; la revisión real la hace el servidor.

import { readSheet, type CellValue, type SheetData } from 'read-excel-file/browser';

import { COLUMNAS_EXCEL, COLUMNAS_OBLIGATORIAS } from '@/constantes/camposServicio';
import type { FilaPlanilla } from '@/tipos/importacion';
import type { DatosServicio } from '@/tipos/servicio';

export const HOJA_SERVICIOS = 'Datos';
export const TAMANO_MAXIMO_PLANILLA = 5 * 1024 * 1024;

type Celda = CellValue | null | undefined;

function celdaVacia(celda: Celda) {
  return celda === null || celda === undefined || celda === '';
}

function convertirCelda(campo: keyof DatosServicio, celda: Celda): unknown {
  if (campo === 'servicios') {
    // En el Excel van juntos, separados por ";"
    return celdaVacia(celda)
      ? []
      : String(celda)
          .split(';')
          .map((parte) => parte.trim())
          .filter(Boolean);
  }
  if (celdaVacia(celda)) {
    return campo === 'latitud' || campo === 'longitud' ? null : '';
  }
  if (typeof celda === 'number') {
    return campo === 'latitud' || campo === 'longitud' ? celda : String(celda);
  }
  if ((celda as unknown) instanceof Date) {
    return (celda as unknown as Date).toISOString().slice(0, 10);
  }
  return String(celda);
}

export async function leerPlanillaServicios(archivo: Blob): Promise<FilaPlanilla[]> {
  if (archivo.size > TAMANO_MAXIMO_PLANILLA) {
    throw new Error('El archivo pesa más de 5 MB. Revisa que sea la planilla correcta.');
  }

  let filas: SheetData;
  try {
    filas = await readSheet(archivo, HOJA_SERVICIOS);
  } catch (error) {
    if ((error as Error).name === 'SheetNotFoundError') {
      throw new Error(
        `La planilla no tiene una hoja llamada "${HOJA_SERVICIOS}". Usa el mismo formato del Excel de ejemplo.`,
      );
    }
    throw new Error('No se pudo leer el archivo. Revisa que sea un Excel (.xlsx).');
  }

  const [encabezado = [], ...resto] = filas;
  const columnas = encabezado.map((celda) =>
    typeof celda === 'string' ? celda.trim().toLowerCase() : '',
  );
  const faltan = COLUMNAS_OBLIGATORIAS.map((campo) => COLUMNAS_EXCEL[campo]).filter(
    (columna) => !columnas.includes(columna),
  );
  if (faltan.length > 0) {
    throw new Error(
      `A la hoja "${HOJA_SERVICIOS}" le faltan estas columnas: ${faltan.join(', ')}. La primera fila debe tener los títulos de las columnas.`,
    );
  }

  const resultado: FilaPlanilla[] = [];
  resto.forEach((celdas, indice) => {
    if (celdas.every(celdaVacia)) {
      return;
    }
    const datos: Record<string, unknown> = {};
    for (const [campo, columna] of Object.entries(COLUMNAS_EXCEL)) {
      const posicion = columnas.indexOf(columna);
      datos[campo] = convertirCelda(
        campo as keyof DatosServicio,
        posicion >= 0 ? celdas[posicion] : null,
      );
    }
    // +2: la fila 1 del Excel son los títulos
    resultado.push({ fila: indice + 2, datos });
  });

  if (resultado.length === 0) {
    throw new Error(`La hoja "${HOJA_SERVICIOS}" no tiene servicios, solo los títulos.`);
  }
  return resultado;
}
