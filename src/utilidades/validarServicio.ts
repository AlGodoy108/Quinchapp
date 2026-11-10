// Revisa y limpia los datos de un servicio. La usan el formulario (para avisar al tiro)
// y la ruta API (que no confía en lo que llega del navegador).

import { CATEGORIAS_SERVICIO } from '@/constantes/categoriasServicio';
import { ESTADOS_VERIFICACION, type DatosServicio } from '@/tipos/servicio';

export type ErroresServicio = Partial<Record<keyof DatosServicio, string>>;

type ResultadoValidacion =
  { ok: true; datos: DatosServicio } | { ok: false; errores: ErroresServicio };

const MAXIMO_SERVICIOS = 40;

// Zona aproximada de Chiloé y sus islas. Sirve para detectar coordenadas copiadas al revés.
const ZONA = { latMin: -44, latMax: -41, lonMin: -75, lonMax: -72.5 };

// Acepta "-42,4718" (coma decimal) y "-42.4718"
export function leerNumero(valor: unknown): number | null | undefined {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : undefined;
  }
  if (typeof valor === 'string') {
    const texto = valor.trim().replace(',', '.');
    if (!texto) {
      return null;
    }
    const numero = Number(texto);
    return /^-?\d+(\.\d+)?$/.test(texto) && Number.isFinite(numero) ? numero : undefined;
  }
  return undefined;
}

// Google Maps copia las coordenadas juntas: "-42.4718, -73.4892"
export function separarCoordenadas(texto: string) {
  const partes = texto.trim().match(/^(-?\d+(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d+(?:[.,]\d+)?)$/);
  return partes ? { latitud: partes[1], longitud: partes[2] } : null;
}

export function hoyIso() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Con o sin https://, como aparecen en el Excel ("facebook.com/...")
const PATRON_WEB = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;

export function validarServicio(entrada: unknown): ResultadoValidacion {
  const crudo = (typeof entrada === 'object' && entrada !== null ? entrada : {}) as Record<
    string,
    unknown
  >;
  const errores: ErroresServicio = {};

  function texto(campo: keyof DatosServicio, requerido: string | null, maximo: number) {
    const valor = typeof crudo[campo] === 'string' ? (crudo[campo] as string).trim() : '';
    if (!valor && requerido) {
      errores[campo] = requerido;
    } else if (valor.length > maximo) {
      errores[campo] = `Máximo ${maximo} caracteres (tiene ${valor.length}).`;
    }
    return valor;
  }

  const categoria = texto('categoria', 'Elige una categoría.', 60);
  if (categoria && !CATEGORIAS_SERVICIO.some((c) => c.nombre === categoria)) {
    errores.categoria = 'Elige una de las categorías de la lista.';
  }
  const subcategoria = texto('subcategoria', 'Escribe o elige una subcategoría.', 80);
  const nombre = texto('nombre', 'Escribe el nombre del servicio.', 120);
  const descripcion = texto('descripcion', 'Escribe una descripción corta.', 1000);
  const direccion = texto(
    'direccion',
    'Escribe la dirección o marca "Sin dirección publicada".',
    200,
  );
  const localidad = texto('localidad', 'Escribe o elige la localidad.', 80);
  const comuna = texto('comuna', 'Escribe la comuna.', 80);
  const region = texto('region', 'Escribe la región.', 80);

  const latitud = leerNumero(crudo.latitud);
  const longitud = leerNumero(crudo.longitud);
  if (latitud === undefined) {
    errores.latitud = 'Escribe solo el número, por ejemplo -42.4718.';
  }
  if (longitud === undefined) {
    errores.longitud = 'Escribe solo el número, por ejemplo -73.4892.';
  }
  if (latitud !== undefined && longitud !== undefined) {
    if ((latitud === null) !== (longitud === null)) {
      errores[latitud === null ? 'latitud' : 'longitud'] =
        'Completa latitud y longitud, o deja las dos vacías.';
    } else if (latitud !== null && longitud !== null) {
      const enZona =
        latitud >= ZONA.latMin &&
        latitud <= ZONA.latMax &&
        longitud >= ZONA.lonMin &&
        longitud <= ZONA.lonMax;
      if (!enZona) {
        errores.latitud =
          'Estas coordenadas quedan fuera de Chiloé. Revisa que no estén al revés (la latitud es la que parte en -42).';
      }
    }
  }

  const telefono = texto('telefono', null, 100);
  const email = texto('email', null, 120);
  if (email && !PATRON_CORREO.test(email)) {
    errores.email = 'El correo no parece válido (ejemplo: contacto@negocio.cl).';
  }
  const sitioWeb = texto('sitioWeb', null, 300);
  if (sitioWeb && !PATRON_WEB.test(sitioWeb)) {
    errores.sitioWeb = 'La dirección web no parece válida (ejemplo: www.negocio.cl).';
  }
  const redesSociales = texto('redesSociales', null, 300);
  const horario = texto('horario', 'Escribe el horario o marca "Consultar".', 200);
  const precioReferencia = texto('precioReferencia', 'Escribe el precio o marca "Consultar".', 200);
  const capacidad = texto('capacidad', null, 120);

  let servicios: string[] = [];
  if (Array.isArray(crudo.servicios)) {
    const limpios = crudo.servicios
      .filter((s): s is string => typeof s === 'string')
      .map((s) => s.trim())
      .filter(Boolean);
    servicios = [...new Set(limpios)];
    if (servicios.length > MAXIMO_SERVICIOS) {
      errores.servicios = `Máximo ${MAXIMO_SERVICIOS} servicios.`;
    } else if (servicios.some((s) => s.length > 80)) {
      errores.servicios = 'Cada servicio puede tener hasta 80 caracteres.';
    } else if (servicios.some((s) => s.includes(';'))) {
      errores.servicios = 'Los servicios no pueden llevar ";". Agrégalos uno por uno.';
    }
  } else if (crudo.servicios !== undefined) {
    errores.servicios = 'La lista de servicios no es válida.';
  }

  const estado = texto('estadoVerificacion', 'Elige si la información está verificada.', 60);
  if (estado && !ESTADOS_VERIFICACION.includes(estado as (typeof ESTADOS_VERIFICACION)[number])) {
    errores.estadoVerificacion = 'Elige una de las dos opciones.';
  }
  const fuenteUrl = texto('fuenteUrl', null, 500);
  if (fuenteUrl && !PATRON_WEB.test(fuenteUrl)) {
    errores.fuenteUrl = 'Pega la dirección web completa de donde sacaste la información.';
  }
  const fechaConsulta = texto('fechaConsulta', 'Escribe la fecha de consulta.', 10);
  if (fechaConsulta) {
    const fecha = new Date(`${fechaConsulta}T00:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaConsulta) || Number.isNaN(fecha.getTime())) {
      errores.fechaConsulta = 'Usa el formato AAAA-MM-DD, por ejemplo 2026-11-09.';
    } else if (fechaConsulta > hoyIso()) {
      errores.fechaConsulta = 'La fecha de consulta no puede ser futura.';
    }
  }

  if (Object.keys(errores).length > 0) {
    return { ok: false, errores };
  }
  return {
    ok: true,
    datos: {
      categoria,
      subcategoria,
      nombre,
      descripcion,
      direccion,
      localidad,
      comuna,
      region,
      latitud: latitud ?? null,
      longitud: longitud ?? null,
      telefono,
      email: email.toLowerCase(),
      sitioWeb,
      redesSociales,
      horario,
      precioReferencia,
      servicios,
      capacidad,
      estadoVerificacion: estado as DatosServicio['estadoVerificacion'],
      fuenteUrl,
      fechaConsulta,
    },
  };
}
