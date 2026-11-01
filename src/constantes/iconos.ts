import type { SymbolViewProps } from 'expo-symbols';

function icono(ios: string, material: string) {
  return { ios, android: material, web: material } as SymbolViewProps['name'];
}

// Cada ícono tiene su nombre en SF Symbols (iOS) y en Material Symbols (Android y web)
export const ICONOS = {
  inicio: icono('house.fill', 'home'),
  mapa: icono('map.fill', 'map'),
  categorias: icono('square.grid.2x2.fill', 'category'),
  lugares: icono('list.bullet', 'format_list_bulleted'),
  buscar: icono('magnifyingglass', 'search'),
  cerrar: icono('xmark', 'close'),
  flecha: icono('chevron.right', 'chevron_right'),
  estrella: icono('star.fill', 'star'),
  horario: icono('clock', 'schedule'),
  restaurantes: icono('fork.knife', 'restaurant'),
  comidaRapida: icono('takeoutbag.and.cup.and.straw.fill', 'fastfood'),
  hoteleria: icono('bed.double.fill', 'hotel'),
  parques: icono('leaf.fill', 'park'),
  museos: icono('building.columns.fill', 'museum'),
  navegaciones: icono('ferry.fill', 'directions_boat'),
  actividades: icono('figure.hiking', 'hiking'),
};

export type NombreIcono = keyof typeof ICONOS;
