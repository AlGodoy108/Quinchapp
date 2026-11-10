// Guarda los servicios turísticos en datos/servicios.json.
// Este archivo SÍ se sube al repositorio: así todo el equipo tiene los mismos datos.
// Cuando exista una base de datos real, solo hay que reemplazar este archivo.

import path from 'node:path';

import { CATEGORIAS_SERVICIO } from '../constantes/categoriasServicio.ts';
import type { DatosServicio, Servicio } from '../tipos/servicio.ts';
import { normalizarTexto } from '../utilidades/normalizarTexto.ts';
import { crearArchivoJson } from './archivoJson.ts';

type DatosServicios = {
  servicios: Servicio[];
};

// ARCHIVO_SERVICIOS permite usar otro archivo, por ejemplo para pruebas
const ARCHIVO =
  process.env.ARCHIVO_SERVICIOS ?? path.join(process.cwd(), 'datos', 'servicios.json');

const archivo = crearArchivoJson<DatosServicios>(ARCHIVO, { servicios: [] });

export async function leerServicios() {
  return (await archivo.leer()).servicios;
}

// Siguiente ID de la categoría: si existen CAB-001 y CAB-004, el siguiente es CAB-005
function siguienteId(servicios: Servicio[], codigo: string) {
  const numeros = servicios
    .map((servicio) => servicio.id.match(new RegExp(`^${codigo}-(\\d+)$`))?.[1])
    .filter((numero): numero is string => numero !== undefined)
    .map(Number);
  const siguiente = Math.max(0, ...numeros) + 1;
  return `${codigo}-${String(siguiente).padStart(3, '0')}`;
}

// Busca un servicio con el mismo nombre en la misma categoría (sin importar mayúsculas ni tildes)
function buscarRepetido(servicios: Servicio[], datos: DatosServicio) {
  const nombre = normalizarTexto(datos.nombre);
  return servicios.find(
    (s) => s.categoria === datos.categoria && normalizarTexto(s.nombre) === nombre,
  );
}

function nuevoServicio(servicios: Servicio[], datos: DatosServicio, codigo: string): Servicio {
  const ahora = new Date().toISOString();
  return {
    id: siguienteId(servicios, codigo),
    ...datos,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };
}

export function agregarServicio(datos: DatosServicio) {
  return archivo.modificar((contenido): { servicio: Servicio } | { error: string } => {
    const categoria = CATEGORIAS_SERVICIO.find((c) => c.nombre === datos.categoria);
    if (!categoria) {
      return { error: 'La categoría no existe.' };
    }
    const repetido = buscarRepetido(contenido.servicios, datos);
    if (repetido) {
      return { error: `Ya existe "${repetido.nombre}" en ${repetido.categoria} (${repetido.id}).` };
    }
    const servicio = nuevoServicio(contenido.servicios, datos, categoria.codigo);
    contenido.servicios.push(servicio);
    return { servicio };
  });
}

export type FilaParaImportar = { fila: number; datos: DatosServicio };

export type PlanFila =
  | { fila: number; estado: 'nueva'; servicio: Servicio }
  | { fila: number; estado: 'repetida'; mensaje: string };

// Decide qué filas se pueden agregar. Revisa repetidos contra lo ya guardado
// y también dentro de la misma planilla.
function planificarImportacion(existentes: Servicio[], filas: FilaParaImportar[]) {
  const todos = [...existentes];
  const filaDeOrigen = new Map<string, number>();
  const plan: PlanFila[] = [];
  for (const { fila, datos } of filas) {
    const categoria = CATEGORIAS_SERVICIO.find((c) => c.nombre === datos.categoria);
    const repetido = buscarRepetido(todos, datos);
    if (!categoria) {
      plan.push({ fila, estado: 'repetida', mensaje: 'La categoría no existe.' });
    } else if (repetido) {
      const enPlanilla = filaDeOrigen.get(repetido.id);
      plan.push({
        fila,
        estado: 'repetida',
        mensaje:
          enPlanilla !== undefined
            ? `Está repetido: es igual a la fila ${enPlanilla} de la planilla.`
            : `Ya existe en el panel como ${repetido.id}.`,
      });
    } else {
      const servicio = nuevoServicio(todos, datos, categoria.codigo);
      todos.push(servicio);
      filaDeOrigen.set(servicio.id, fila);
      plan.push({ fila, estado: 'nueva', servicio });
    }
  }
  return plan;
}

// guardar = false solo calcula la vista previa; guardar = true agrega las filas nuevas.
// Todo pasa dentro de una sola escritura, así no se mezcla con otro guardado al mismo tiempo.
export async function importarServicios(filas: FilaParaImportar[], guardar: boolean) {
  if (!guardar) {
    return planificarImportacion(await leerServicios(), filas);
  }
  return archivo.modificar((contenido) => {
    const plan = planificarImportacion(contenido.servicios, filas);
    for (const paso of plan) {
      if (paso.estado === 'nueva') {
        contenido.servicios.push(paso.servicio);
      }
    }
    return plan;
  });
}
