/// <reference types="node" />

// GENERA LOS LUGARES DE LA APP DESDE EL EXCEL
//
// Uso:  npm run datos                         (usa el Excel de ejemplo)
//       npm run datos -- ruta/a/otro.xlsx     (usa otro Excel con la misma estructura)
//
// Lee la hoja "Datos" y escribe src/constantes/lugares.json, que es lo que usa la app.
// Ubicación de cada lugar en el mapa:
//   1. Si la fila trae latitud y longitud, se usan tal cual.
//   2. Si no, se busca la dirección en OpenStreetMap (Nominatim).
//   3. Si la dirección no se encuentra, se busca la localidad (punto aproximado).
//   4. Si nada funciona, el lugar queda sin ubicación y la app muestra el aviso.
// Las búsquedas se guardan en herramientas/direcciones-buscadas.json para no repetirlas:
// la app nunca se conecta a internet para esto.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as esperar } from 'node:timers/promises';
import { readSheet } from 'read-excel-file/node';

import type { Coordenadas, IdCategoria, Lugar } from '../src/tipos/lugar';

const EXCEL_POR_DEFECTO = 'assets/DatosEjemplos/oferta_turistica_ejemplo.xlsx';
const HOJA = 'Datos';
const SALIDA = 'src/constantes/lugares.json';
const CACHE = 'herramientas/direcciones-buscadas.json';

// Nombre de la categoría en el Excel (sin tildes ni mayúsculas) → id en la app
const CATEGORIAS_EXCEL: Record<string, IdCategoria> = {
  camping: 'camping',
  cabanas: 'cabanas',
  hoteles: 'hoteles',
  'apart hotel / departamentos': 'departamentos',
  hospedaje: 'hospedaje',
  restaurantes: 'restaurantes',
  'venta de comida': 'venta-comida',
  'lugares turisticos': 'lugares-turisticos',
  'islas y excursiones': 'excursiones',
  artesania: 'artesania',
  'fiestas y eventos': 'fiestas-eventos',
  transporte: 'transporte',
};

// Textos que en la planilla significan "no hay dato" (igual que src/utilidades/datosLugar.ts)
const TEXTOS_SIN_DATO = [
  'consultar',
  'sin informacion',
  'sin direccion publicada',
  'por confirmar',
  'por verificar',
  'no disponible',
  'n/a',
  '-',
];

// Solo se aceptan resultados dentro de la comuna de Quinchao (islas incluidas)
const ZONA_QUINCHAO = { oeste: -73.8, norte: -42.3, este: -73.15, sur: -42.7 };

type Fila = Record<string, unknown>;
type Cache = Record<string, Coordenadas | null>;

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function texto(valor: unknown) {
  if (valor === null || valor === undefined) {
    return undefined;
  }
  const limpio = String(valor).trim();
  if (!limpio || TEXTOS_SIN_DATO.includes(normalizar(limpio))) {
    return undefined;
  }
  return limpio;
}

function numero(valor: unknown) {
  if (valor === null || valor === undefined || valor === '') {
    return undefined;
  }
  const convertido = typeof valor === 'number' ? valor : Number(String(valor).replace(',', '.'));
  return Number.isFinite(convertido) ? convertido : undefined;
}

function dentroDeQuinchao({ latitude, longitude }: Coordenadas) {
  return (
    latitude <= ZONA_QUINCHAO.norte &&
    latitude >= ZONA_QUINCHAO.sur &&
    longitude >= ZONA_QUINCHAO.oeste &&
    longitude <= ZONA_QUINCHAO.este
  );
}

// ---------- Búsqueda de direcciones (Nominatim, OpenStreetMap) ----------

const cache: Cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
let busquedasNuevas = 0;

async function buscarEnMapa(consulta: string): Promise<Coordenadas | null> {
  if (consulta in cache) {
    return cache[consulta];
  }

  // Nominatim pide como máximo una consulta por segundo
  if (busquedasNuevas > 0) {
    await esperar(1100);
  }
  busquedasNuevas++;

  const { oeste, norte, este, sur } = ZONA_QUINCHAO;
  const parametros = new URLSearchParams({
    q: consulta,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'cl',
    viewbox: `${oeste},${norte},${este},${sur}`,
    bounded: '1',
  });

  const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?${parametros}`, {
    headers: { 'User-Agent': 'Quinchapp-generador-de-datos/1.0', 'Accept-Language': 'es' },
  });
  if (!respuesta.ok) {
    throw new Error(`Nominatim respondió ${respuesta.status} al buscar "${consulta}"`);
  }

  const [resultado] = (await respuesta.json()) as { lat: string; lon: string }[];
  const coordenadas = resultado
    ? { latitude: Number(resultado.lat), longitude: Number(resultado.lon) }
    : null;

  cache[consulta] = coordenadas && dentroDeQuinchao(coordenadas) ? coordenadas : null;
  return cache[consulta];
}

type Ubicacion = {
  coordenadas?: Coordenadas;
  confirmada: boolean;
  origen: 'excel' | 'direccion' | 'localidad' | 'sin ubicacion';
};

async function ubicar(fila: Fila, verificado: boolean): Promise<Ubicacion> {
  const latitude = numero(fila.latitud);
  const longitude = numero(fila.longitud);
  if (latitude !== undefined && longitude !== undefined && !(latitude === 0 && longitude === 0)) {
    return { coordenadas: { latitude, longitude }, confirmada: verificado, origen: 'excel' };
  }

  const direccion = texto(fila.direccion);
  const localidad = texto(fila.localidad);
  const comuna = texto(fila.comuna) ?? 'Quinchao';

  if (direccion) {
    const consulta = [direccion, localidad, comuna, 'Chile'].filter(Boolean).join(', ');
    const coordenadas = await buscarEnMapa(consulta);
    if (coordenadas) {
      return { coordenadas, confirmada: false, origen: 'direccion' };
    }
  }

  // "Putique, Achao" → primero se busca Putique y, si no aparece, Achao
  for (const parte of localidad?.split(',').map((p) => p.trim()) ?? []) {
    const coordenadas = await buscarEnMapa(`${parte}, ${comuna}, Chile`);
    if (coordenadas) {
      return { coordenadas, confirmada: false, origen: 'localidad' };
    }
  }

  return { confirmada: false, origen: 'sin ubicacion' };
}

// ---------- Conversión ----------

async function principal() {
  const rutaExcel = process.argv[2] ?? EXCEL_POR_DEFECTO;
  const [encabezado, ...filasExcel] = await readSheet(rutaExcel, HOJA);
  const columnas = encabezado.map((celda) => normalizar(String(celda ?? '')));

  const lugares: Lugar[] = [];
  const categoriasConDestacado = new Set<IdCategoria>();
  const resumen: Record<Ubicacion['origen'], string[]> = {
    excel: [],
    direccion: [],
    localidad: [],
    'sin ubicacion': [],
  };

  for (const [indice, celdas] of filasExcel.entries()) {
    const fila: Fila = Object.fromEntries(columnas.map((columna, i) => [columna, celdas[i]]));
    const id = texto(fila.id);
    const nombre = texto(fila.nombre);
    if (!id || !nombre) {
      continue; // fila vacía
    }

    const textoCategoria = normalizar(String(fila.categoria ?? ''));
    const categoriaId = CATEGORIAS_EXCEL[textoCategoria];
    if (!categoriaId) {
      throw new Error(
        `Fila ${indice + 2} (${id}): la categoría "${fila.categoria}" no existe. ` +
          'Agrégala en CATEGORIAS_EXCEL (herramientas/generar-lugares.ts) y en src/constantes/categorias.ts.',
      );
    }

    const verificado = normalizar(String(fila.estado_verificacion ?? '')).startsWith('verificado');
    const ubicacion = await ubicar(fila, verificado);
    resumen[ubicacion.origen].push(id);

    // El Excel no marca destacados: se destaca el primer lugar verificado de cada categoría
    const destacado = verificado && !categoriasConDestacado.has(categoriaId);
    if (destacado) {
      categoriasConDestacado.add(categoriaId);
    }

    const direccion = [texto(fila.direccion), texto(fila.localidad)].filter(Boolean).join(', ');
    const servicios = String(fila.servicios ?? '')
      .split(';')
      .map((servicio) => servicio.trim())
      .filter(Boolean);

    lugares.push({
      id: id.toLowerCase(),
      nombre,
      categoriaId,
      subcategoria: texto(fila.subcategoria),
      descripcion: texto(fila.descripcion),
      horario: texto(fila.horario),
      precio: texto(fila.precio_referencia),
      capacidad: texto(fila.capacidad),
      servicios: servicios.length > 0 ? servicios : undefined,
      destacado,
      direccion: direccion || undefined,
      contacto: {
        telefono: texto(fila.telefono),
        email: texto(fila.email),
        sitioWeb: texto(fila.sitio_web),
        redesSociales: texto(fila.redes_sociales),
      },
      coordenadas: ubicacion.coordenadas,
      ubicacionConfirmada: ubicacion.confirmada,
    });
  }

  writeFileSync(SALIDA, `${JSON.stringify(lugares, null, 2)}\n`);
  writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);

  console.log(`Listo: ${lugares.length} lugares escritos en ${SALIDA}`);
  console.log(`  Con latitud/longitud del Excel: ${resumen.excel.length}`);
  console.log(
    `  Ubicados por dirección:         ${resumen.direccion.length} ${resumen.direccion.join(' ')}`,
  );
  console.log(
    `  Ubicados por localidad (aprox.): ${resumen.localidad.length} ${resumen.localidad.join(' ')}`,
  );
  console.log(
    `  Sin ubicación:                  ${resumen['sin ubicacion'].length} ${resumen['sin ubicacion'].join(' ')}`,
  );
  console.log(`  Búsquedas nuevas en OpenStreetMap: ${busquedasNuevas}`);
}

principal().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
