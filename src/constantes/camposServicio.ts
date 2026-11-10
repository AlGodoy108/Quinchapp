// Nombres de los campos de un servicio: cómo se muestran y en qué columna del Excel están

import type { DatosServicio } from '@/tipos/servicio';

export const ETIQUETAS_CAMPOS_SERVICIO: Record<keyof DatosServicio, string> = {
  categoria: 'Categoría',
  subcategoria: 'Subcategoría',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  direccion: 'Dirección',
  localidad: 'Localidad',
  comuna: 'Comuna',
  region: 'Región',
  latitud: 'Latitud',
  longitud: 'Longitud',
  telefono: 'Teléfono',
  email: 'Correo',
  sitioWeb: 'Sitio web',
  redesSociales: 'Redes sociales',
  horario: 'Horario',
  precioReferencia: 'Precio de referencia',
  servicios: 'Servicios',
  capacidad: 'Capacidad',
  estadoVerificacion: 'Estado de verificación',
};

// Columna de la hoja "Datos" que corresponde a cada campo.
// Las columnas id, fuente_url y fecha_consulta del Excel no se importan.
export const COLUMNAS_EXCEL: Record<keyof DatosServicio, string> = {
  categoria: 'categoria',
  subcategoria: 'subcategoria',
  nombre: 'nombre',
  descripcion: 'descripcion',
  direccion: 'direccion',
  localidad: 'localidad',
  comuna: 'comuna',
  region: 'region',
  latitud: 'latitud',
  longitud: 'longitud',
  telefono: 'telefono',
  email: 'email',
  sitioWeb: 'sitio_web',
  redesSociales: 'redes_sociales',
  horario: 'horario',
  precioReferencia: 'precio_referencia',
  servicios: 'servicios',
  capacidad: 'capacidad',
  estadoVerificacion: 'estado_verificacion',
};

// Sin estas columnas no se puede importar: son los campos obligatorios del formulario
export const COLUMNAS_OBLIGATORIAS: (keyof DatosServicio)[] = [
  'categoria',
  'subcategoria',
  'nombre',
  'descripcion',
  'direccion',
  'localidad',
  'comuna',
  'region',
  'horario',
  'precioReferencia',
  'estadoVerificacion',
];
