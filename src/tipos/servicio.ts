// Un servicio turístico: una fila de la hoja "Datos" del Excel de oferta turística.
// Cada campo corresponde a una columna (sitioWeb = sitio_web, etc.).

export const ESTADOS_VERIFICACION = [
  'Verificado (fuente reciente)',
  'Por verificar (fuente antigua o incompleta)',
] as const;

export type EstadoVerificacion = (typeof ESTADOS_VERIFICACION)[number];

export type DatosServicio = {
  categoria: string;
  subcategoria: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  localidad: string;
  comuna: string;
  region: string;
  latitud: number | null;
  longitud: number | null;
  // Los campos opcionales vacíos se guardan como ''
  telefono: string;
  email: string;
  sitioWeb: string;
  redesSociales: string;
  horario: string;
  precioReferencia: string;
  // En el Excel van separados por ";"
  servicios: string[];
  capacidad: string;
  estadoVerificacion: EstadoVerificacion;
  // Las columnas fuente_url y fecha_consulta del Excel no se guardan: eran notas de la recopilación
};

export type Servicio = DatosServicio & {
  // Código de la categoría + número: CAB-006
  id: string;
  creadoEn: string;
  actualizadoEn: string;
};
