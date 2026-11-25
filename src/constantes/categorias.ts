import { PALETA } from '@/constantes/tema';
import type { Categoria } from '@/tipos/lugar';

// Las 12 categorías del Excel de oferta turística, en el mismo orden.
// Si el Excel trae una categoría nueva, agrégala aquí, en IdCategoria (src/tipos/lugar.ts)
// y en CATEGORIAS_EXCEL (herramientas/generar-lugares.ts).
// colorMapa solo se usa en los puntos y filtros del mapa, para distinguir cada categoría.
// En tarjetas y listas los íconos van con el estilo azul de la marca.
export const CATEGORIAS: Categoria[] = [
  { id: 'camping', nombre: 'Camping', icono: 'camping', colorMapa: PALETA.verde[600] },
  { id: 'cabanas', nombre: 'Cabañas', icono: 'cabanas', colorMapa: PALETA.verde[800] },
  { id: 'hoteles', nombre: 'Hoteles', icono: 'hoteles', colorMapa: PALETA.azul[500] },
  {
    id: 'departamentos',
    nombre: 'Apart hotel y departamentos',
    icono: 'departamentos',
    colorMapa: PALETA.azul[800],
  },
  { id: 'hospedaje', nombre: 'Hospedaje', icono: 'hospedaje', colorMapa: PALETA.celeste[700] },
  {
    id: 'restaurantes',
    nombre: 'Restaurantes',
    icono: 'restaurantes',
    colorMapa: PALETA.magenta[500],
  },
  {
    id: 'venta-comida',
    nombre: 'Venta de comida',
    icono: 'ventaComida',
    colorMapa: PALETA.amarillo[600],
  },
  {
    id: 'lugares-turisticos',
    nombre: 'Lugares turísticos',
    icono: 'lugaresTuristicos',
    colorMapa: PALETA.magenta[800],
  },
  {
    id: 'excursiones',
    nombre: 'Islas y excursiones',
    icono: 'excursiones',
    colorMapa: PALETA.celeste[500],
  },
  { id: 'artesania', nombre: 'Artesanía', icono: 'artesania', colorMapa: PALETA.amarillo[800] },
  {
    id: 'fiestas-eventos',
    nombre: 'Fiestas y eventos',
    icono: 'fiestasEventos',
    colorMapa: PALETA.magenta[300],
  },
  { id: 'transporte', nombre: 'Transporte', icono: 'transporte', colorMapa: PALETA.neutro[700] },
];

export function obtenerCategoria(id: string | undefined) {
  return CATEGORIAS.find((categoria) => categoria.id === id);
}
