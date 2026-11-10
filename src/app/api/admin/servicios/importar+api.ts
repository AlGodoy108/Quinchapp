import { importarServicios, type FilaParaImportar } from '@/servidor/almacenServicios.ts';
import { exigirAdmin, responder, responderError } from '@/servidor/peticiones.ts';
import type { ResultadoFila } from '@/tipos/importacion';
import { validarServicio } from '@/utilidades/validarServicio';

const MAXIMO_FILAS = 2000;

function textoCorto(valor: unknown) {
  return typeof valor === 'string' ? valor.trim().slice(0, 120) : '';
}

// Importa servicios desde las filas del Excel (leídas en el navegador).
// { filas, confirmar: false } devuelve la vista previa sin guardar nada.
// { filas, confirmar: true } vuelve a revisar todo y guarda solo las filas válidas y nuevas.
export async function POST(request: Request) {
  const admin = await exigirAdmin(request);
  if (admin instanceof Response) {
    return admin;
  }

  let cuerpo: { filas?: unknown; confirmar?: unknown };
  try {
    cuerpo = await request.json();
  } catch {
    return responderError(400, 'Los datos enviados no son válidos.');
  }
  const { filas, confirmar } = cuerpo ?? {};
  if (!Array.isArray(filas) || filas.length === 0) {
    return responderError(400, 'La planilla no tiene filas para importar.');
  }
  if (filas.length > MAXIMO_FILAS) {
    return responderError(400, `Se pueden importar hasta ${MAXIMO_FILAS} filas a la vez.`);
  }

  const resultados = new Map<number, ResultadoFila>();
  const validas: FilaParaImportar[] = [];
  filas.forEach((item: unknown, indice) => {
    const { fila: numero, datos } = (typeof item === 'object' && item !== null ? item : {}) as {
      fila?: unknown;
      datos?: unknown;
    };
    const fila = Number.isInteger(numero) ? (numero as number) : indice + 2;
    const crudo = (typeof datos === 'object' && datos !== null ? datos : {}) as Record<
      string,
      unknown
    >;
    const base = {
      fila,
      nombre: textoCorto(crudo.nombre),
      categoria: textoCorto(crudo.categoria),
    };
    const validacion = validarServicio(crudo);
    if (validacion.ok) {
      validas.push({ fila, datos: validacion.datos });
      resultados.set(fila, { ...base, estado: 'nueva' });
    } else {
      resultados.set(fila, { ...base, estado: 'error', errores: validacion.errores });
    }
  });

  const plan = await importarServicios(validas, confirmar === true);
  let guardados = 0;
  for (const paso of plan) {
    const anterior = resultados.get(paso.fila)!;
    if (paso.estado === 'nueva') {
      if (confirmar === true) {
        guardados += 1;
        resultados.set(paso.fila, { ...anterior, id: paso.servicio.id });
      }
    } else {
      resultados.set(paso.fila, { ...anterior, estado: 'repetida', mensaje: paso.mensaje });
    }
  }

  return responder({
    resultados: [...resultados.values()].sort((a, b) => a.fila - b.fila),
    guardados,
  });
}
