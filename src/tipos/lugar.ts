import type { NombreIcono } from '@/constantes/iconos';

export type IdCategoria =
  | 'restaurantes'
  | 'comida-rapida'
  | 'hoteleria'
  | 'parques'
  | 'museos'
  | 'navegaciones'
  | 'actividades';

export type Categoria = {
  id: IdCategoria;
  nombre: string;
  icono: NombreIcono;
  colorMapa: string;
};

export type Lugar = {
  id: string;
  nombre: string;
  categoriaId: IdCategoria;
  descripcion: string;
  horario: string;
  estrellas: number;
  destacado: boolean;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
};
