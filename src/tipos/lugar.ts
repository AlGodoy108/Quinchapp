import type { NombreIcono } from '@/constantes/iconos';

// Las mismas 12 categorías de la columna "categoria" del Excel de oferta turística
export type IdCategoria =
  | 'camping'
  | 'cabanas'
  | 'hoteles'
  | 'departamentos'
  | 'hospedaje'
  | 'restaurantes'
  | 'venta-comida'
  | 'lugares-turisticos'
  | 'excursiones'
  | 'artesania'
  | 'fiestas-eventos'
  | 'transporte';

export type Categoria = {
  id: IdCategoria;
  nombre: string;
  icono: NombreIcono;
  colorMapa: string;
};

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

export type Contacto = {
  telefono?: string;
  whatsapp?: string;
  email?: string;
  sitioWeb?: string;
  redesSociales?: string;
};

// Los datos reales vienen incompletos (celdas vacías, "Consultar", "Sin dirección publicada").
// Por eso todo lo que puede faltar es opcional: las pantallas deben mostrar un aviso
// en vez de dejar huecos. Revisa src/utilidades/datosLugar.ts antes de usar estos campos.
export type Lugar = {
  id: string;
  nombre: string;
  categoriaId: IdCategoria;
  // Ej. "Hotel boutique" dentro de Hoteles
  subcategoria?: string;
  descripcion?: string;
  horario?: string;
  // Precio de referencia tal como viene del Excel (ej. "$45.000 por noche (referencial)")
  precio?: string;
  capacidad?: string;
  // Servicios del lugar (en el Excel van separados por ";")
  servicios?: string[];
  estrellas?: number;
  destacado: boolean;
  // URL de la foto. Si falta o no carga, se muestra la imagen del pudú
  foto?: string;
  direccion?: string;
  contacto?: Contacto;
  coordenadas?: Coordenadas;
  // false cuando las coordenadas son aproximadas o vienen de una fuente "Por verificar"
  ubicacionConfirmada?: boolean;
};
