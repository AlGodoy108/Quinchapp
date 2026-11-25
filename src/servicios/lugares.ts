import { obtenerCategoria } from '@/constantes/categorias';
import datosLugares from '@/constantes/lugares.json';
import type { Lugar } from '@/tipos/lugar';
import { normalizarTexto } from '@/utilidades/normalizarTexto';

// lugares.json se genera desde el Excel con "npm run datos" (herramientas/generar-lugares.ts).
// No lo edites a mano: cambia el Excel y vuelve a correr el comando.
const LUGARES = datosLugares as Lugar[];

type FiltroLugares = {
  categoriaId?: string;
  busqueda?: string;
};

// Cuando exista una API o base de datos, solo hay que cambiar este archivo
export function obtenerLugares({ categoriaId, busqueda }: FiltroLugares = {}) {
  const texto = normalizarTexto(busqueda ?? '');

  return LUGARES.filter((lugar) => {
    if (categoriaId && lugar.categoriaId !== categoriaId) {
      return false;
    }
    const nombreCategoria = obtenerCategoria(lugar.categoriaId)?.nombre ?? '';
    return [lugar.nombre, nombreCategoria, lugar.subcategoria ?? '', lugar.direccion ?? ''].some(
      (campo) => normalizarTexto(campo).includes(texto),
    );
  });
}

export function obtenerLugaresDestacados() {
  return LUGARES.filter((lugar) => lugar.destacado);
}

export function obtenerLugarPorId(id: string) {
  return LUGARES.find((lugar) => lugar.id === id);
}
