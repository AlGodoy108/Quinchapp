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

export function agregarServicio(datos: DatosServicio) {
  return archivo.modificar((contenido): { servicio: Servicio } | { error: string } => {
    const categoria = CATEGORIAS_SERVICIO.find((c) => c.nombre === datos.categoria);
    if (!categoria) {
      return { error: 'La categoría no existe.' };
    }
    const nombre = normalizarTexto(datos.nombre);
    const repetido = contenido.servicios.find(
      (s) => s.categoria === datos.categoria && normalizarTexto(s.nombre) === nombre,
    );
    if (repetido) {
      return { error: `Ya existe "${repetido.nombre}" en ${repetido.categoria} (${repetido.id}).` };
    }

    const ahora = new Date().toISOString();
    const servicio: Servicio = {
      id: siguienteId(contenido.servicios, categoria.codigo),
      ...datos,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };
    contenido.servicios.push(servicio);
    return { servicio };
  });
}
