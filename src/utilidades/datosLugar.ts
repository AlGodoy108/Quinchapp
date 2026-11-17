import type { Contacto, Coordenadas, Lugar } from '@/tipos/lugar';
import { normalizarTexto } from '@/utilidades/normalizarTexto';

// Textos que aparecen en la planilla cuando en realidad no hay dato
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

// Devuelve el texto limpio, o undefined si está vacío o es un "Consultar"
export function textoONada(valor: string | null | undefined) {
  const limpio = valor?.trim();
  if (!limpio || TEXTOS_SIN_DATO.includes(normalizarTexto(limpio))) {
    return undefined;
  }
  return limpio;
}

export function coordenadasValidas(coordenadas: Coordenadas | undefined) {
  if (!coordenadas) {
    return false;
  }
  const { latitude, longitude } = coordenadas;
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180 &&
    // 0,0 es el valor que queda cuando la celda venía vacía
    !(latitude === 0 && longitude === 0)
  );
}

export function tieneUbicacion(lugar: Lugar): lugar is Lugar & { coordenadas: Coordenadas } {
  return coordenadasValidas(lugar.coordenadas);
}

// Solo los dígitos y el "+" inicial, para armar los enlaces tel: y wa.me
function soloDigitos(telefono: string) {
  return telefono.replace(/[^\d+]/g, '');
}

export function contactoDisponible(contacto: Contacto | undefined) {
  const telefono = textoONada(contacto?.telefono);
  const whatsapp = textoONada(contacto?.whatsapp) ?? telefono;
  const email = textoONada(contacto?.email);
  const sitioWeb = textoONada(contacto?.sitioWeb);

  return {
    telefono,
    email,
    sitioWeb,
    enlaceLlamar: telefono ? `tel:${soloDigitos(telefono)}` : undefined,
    enlaceWhatsapp: whatsapp
      ? `https://wa.me/${soloDigitos(whatsapp).replace('+', '')}`
      : undefined,
    enlaceEmail: email ? `mailto:${email}` : undefined,
    enlaceSitioWeb: sitioWeb
      ? /^https?:\/\//.test(sitioWeb)
        ? sitioWeb
        : `https://${sitioWeb}`
      : undefined,
    hayAlguno: Boolean(telefono || whatsapp || email || sitioWeb),
  };
}

// Mensajes que se muestran en lugar del dato faltante (iguales al Figma)
export const TEXTOS_PENDIENTES = {
  descripcion: 'Aún no tenemos una descripción de este lugar.',
  horario: 'Horario por confirmar',
  contacto: 'Contacto pendiente de confirmar',
  direccion: 'Dirección por confirmar',
  ubicacion: 'Ubicación sin confirmar',
  sinUbicacion: 'Este lugar todavía no tiene ubicación en el mapa',
  foto: 'Foto no disponible',
  estrellas: 'Sin calificación',
};
