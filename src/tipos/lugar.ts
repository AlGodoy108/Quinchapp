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

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

export type Contacto = {
  telefono?: string;
  whatsapp?: string;
  email?: string;
  sitioWeb?: string;
};

// Los datos reales vienen incompletos (celdas vacías, "Consultar", "Sin dirección publicada").
// Por eso todo lo que puede faltar es opcional: las pantallas deben mostrar un aviso
// en vez de dejar huecos. Revisa src/utilidades/datosLugar.ts antes de usar estos campos.
export type Lugar = {
  id: string;
  nombre: string;
  categoriaId: IdCategoria;
  descripcion?: string;
  horario?: string;
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
