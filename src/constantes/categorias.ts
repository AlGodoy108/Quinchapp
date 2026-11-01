import type { Categoria } from '@/tipos/lugar';

// El color de cada categoría también se usa en los puntos del mapa
export const CATEGORIAS: Categoria[] = [
  { id: 'restaurantes', nombre: 'Restaurantes', icono: 'restaurantes', color: '#D32F2F' },
  { id: 'comida-rapida', nombre: 'Comida rápida', icono: 'comidaRapida', color: '#EF6C00' },
  { id: 'hoteleria', nombre: 'Hotelería', icono: 'hoteleria', color: '#1565C0' },
  { id: 'parques', nombre: 'Parques', icono: 'parques', color: '#2E7D32' },
  { id: 'museos', nombre: 'Museos', icono: 'museos', color: '#6A1B9A' },
  { id: 'navegaciones', nombre: 'Navegaciones', icono: 'navegaciones', color: '#00838F' },
  { id: 'actividades', nombre: 'Actividades', icono: 'actividades', color: '#AD7A00' },
];

export function obtenerCategoria(id: string | undefined) {
  return CATEGORIAS.find((categoria) => categoria.id === id);
}
