import { PALETA } from '@/constantes/tema';
import type { Categoria } from '@/tipos/lugar';

// colorMapa solo se usa en los puntos y filtros del mapa, para distinguir cada categoría.
// En tarjetas y listas los íconos van con el estilo azul de la marca.
export const CATEGORIAS: Categoria[] = [
  {
    id: 'restaurantes',
    nombre: 'Restaurantes',
    icono: 'restaurantes',
    colorMapa: PALETA.magenta[500],
  },
  {
    id: 'comida-rapida',
    nombre: 'Comida rápida',
    icono: 'comidaRapida',
    colorMapa: PALETA.amarillo[600],
  },
  { id: 'hoteleria', nombre: 'Hotelería', icono: 'hoteleria', colorMapa: PALETA.azul[500] },
  { id: 'parques', nombre: 'Parques', icono: 'parques', colorMapa: PALETA.verde[500] },
  { id: 'museos', nombre: 'Museos', icono: 'museos', colorMapa: PALETA.azul[800] },
  {
    id: 'navegaciones',
    nombre: 'Navegaciones',
    icono: 'navegaciones',
    colorMapa: PALETA.celeste[500],
  },
  { id: 'actividades', nombre: 'Actividades', icono: 'actividades', colorMapa: PALETA.verde[800] },
];

export function obtenerCategoria(id: string | undefined) {
  return CATEGORIAS.find((categoria) => categoria.id === id);
}
