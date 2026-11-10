// Importación masiva de servicios desde la hoja "Datos" del Excel

import type { ErroresServicio } from '@/utilidades/validarServicio';

// Una fila leída del Excel, todavía sin revisar. fila = número de fila en el Excel.
export type FilaPlanilla = {
  fila: number;
  datos: Record<string, unknown>;
};

// nueva: se puede importar · repetida: ya existe (o está dos veces en la planilla) · error: datos inválidos
export type EstadoFila = 'nueva' | 'repetida' | 'error';

export type ResultadoFila = {
  fila: number;
  nombre: string;
  categoria: string;
  estado: EstadoFila;
  errores?: ErroresServicio;
  mensaje?: string;
  // Solo cuando la fila ya quedó guardada
  id?: string;
};
