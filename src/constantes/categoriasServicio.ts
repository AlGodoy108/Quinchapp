import type { NombreIcono } from '@/constantes/iconos';

export type CategoriaServicio = {
  // Prefijo del ID en el Excel: CAM-001, HOT-003...
  codigo: string;
  nombre: string;
  icono: NombreIcono;
  // Subcategorías que ya aparecen en el levantamiento; se puede escribir otra
  subcategorias: string[];
};

// Las 12 categorías de la hoja "Categorias" del Excel de oferta turística
export const CATEGORIAS_SERVICIO: CategoriaServicio[] = [
  {
    codigo: 'CAM',
    nombre: 'Camping',
    icono: 'camping',
    subcategorias: ['Camping urbano', 'Camping rural'],
  },
  {
    codigo: 'CAB',
    nombre: 'Cabañas',
    icono: 'cabanas',
    subcategorias: ['Cabaña urbana', 'Cabaña rural', 'Cabaña frente al mar'],
  },
  {
    codigo: 'HOT',
    nombre: 'Hoteles',
    icono: 'hoteleria',
    subcategorias: ['Hotel', 'Hotel boutique', 'Hotel boutique con spa', 'Hotel rural', 'Hostería'],
  },
  {
    codigo: 'APT',
    nombre: 'Apart hotel / Departamentos',
    icono: 'departamentos',
    subcategorias: ['Departamentos equipados', 'Casa vacacional'],
  },
  {
    codigo: 'HOS',
    nombre: 'Hospedaje',
    icono: 'hoteleria',
    subcategorias: ['Hostal', 'Hospedaje', 'Hospedaje y cabañas'],
  },
  {
    codigo: 'REST',
    nombre: 'Restaurantes',
    icono: 'restaurantes',
    subcategorias: [
      'Cocina chilota / mariscos',
      'Pescados y mariscos',
      'Restobar',
      'Sushi / comida rápida',
      'Restaurante de hotel / pastelería',
    ],
  },
  {
    codigo: 'COM',
    nombre: 'Venta de comida',
    icono: 'cafeteria',
    subcategorias: [
      'Cafetería / pastelería',
      'Panadería / comida típica',
      'Panadería / minimercado',
      'Minimarket / panadería',
      'Autoservicio con comida preparada',
    ],
  },
  {
    codigo: 'ATR',
    nombre: 'Lugares turísticos',
    icono: 'museos',
    subcategorias: ['Patrimonio UNESCO', 'Museo', 'Mirador', 'Borde costero'],
  },
  {
    codigo: 'EXC',
    nombre: 'Islas y excursiones',
    icono: 'navegaciones',
    subcategorias: ['Isla / patrimonio', 'Tour guiado', 'Tour local', 'Transporte marítimo'],
  },
  {
    codigo: 'ART',
    nombre: 'Artesanía',
    icono: 'artesania',
    subcategorias: ['Mercado artesanal', 'Taller artesanal'],
  },
  {
    codigo: 'EVE',
    nombre: 'Fiestas y eventos',
    icono: 'eventos',
    subcategorias: ['Fiesta religiosa', 'Fiesta costumbrista', 'Festival', 'Folclor / gastronomía'],
  },
  {
    codigo: 'TRA',
    nombre: 'Transporte',
    icono: 'transporte',
    subcategorias: ['Rampa de barcaza', 'Embarcadero de lanchas', 'Terminal de buses'],
  },
];

export function obtenerCategoriaServicio(nombre: string | undefined) {
  return CATEGORIAS_SERVICIO.find((categoria) => categoria.nombre === nombre);
}

// Localidades de la comuna de Quinchao que aparecen en el levantamiento
export const LOCALIDADES_QUINCHAO = [
  'Achao',
  'Villa Quinchao',
  'Isla Quinchao',
  'Isla Alao',
  'Isla Apiao',
  'Isla Caguach',
  'Isla Chaulinec',
  'Isla Linlín',
  'Isla Llingua',
  'Isla Meulín',
  'Isla Quenac',
  'Isla Teuquelín',
];

export const COMUNA_POR_DEFECTO = 'Quinchao';
export const REGION_POR_DEFECTO = 'Los Lagos';

// Textos que el Excel usa cuando no hay dato publicado
export const TEXTO_SIN_DIRECCION = 'Sin dirección publicada';
export const TEXTO_CONSULTAR = 'Consultar';
