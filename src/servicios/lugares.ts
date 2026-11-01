import { obtenerCategoria } from '@/constantes/categorias';
import { LUGARES_EJEMPLO } from '@/constantes/lugaresEjemplo';
import { normalizarTexto } from '@/utilidades/normalizarTexto';

type FiltroLugares = {
  categoriaId?: string;
  busqueda?: string;
};

// Cuando exista una API o base de datos, solo hay que cambiar este archivo
export function obtenerLugares({ categoriaId, busqueda }: FiltroLugares = {}) {
  const texto = normalizarTexto(busqueda ?? '');

  return LUGARES_EJEMPLO.filter((lugar) => {
    if (categoriaId && lugar.categoriaId !== categoriaId) {
      return false;
    }
    const nombreCategoria = obtenerCategoria(lugar.categoriaId)?.nombre ?? '';
    return (
      normalizarTexto(lugar.nombre).includes(texto) ||
      normalizarTexto(nombreCategoria).includes(texto)
    );
  });
}

export function obtenerLugaresDestacados() {
  return LUGARES_EJEMPLO.filter((lugar) => lugar.destacado);
}

export function obtenerLugarPorId(id: string) {
  return LUGARES_EJEMPLO.find((lugar) => lugar.id === id);
}
