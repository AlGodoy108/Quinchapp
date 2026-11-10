import { agregarServicio, leerServicios } from '@/servidor/almacenServicios.ts';
import { exigirAdmin, responder, responderError } from '@/servidor/peticiones.ts';
import { validarServicio } from '@/utilidades/validarServicio';

// Lista de servicios cargados
export async function GET(request: Request) {
  const admin = await exigirAdmin(request);
  if (admin instanceof Response) {
    return admin;
  }
  return responder({ servicios: await leerServicios() });
}

// Agregar un servicio nuevo
export async function POST(request: Request) {
  const admin = await exigirAdmin(request);
  if (admin instanceof Response) {
    return admin;
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return responderError(400, 'Los datos enviados no son válidos.');
  }

  const validacion = validarServicio(cuerpo);
  if (!validacion.ok) {
    return responder({ error: 'Revisa los campos marcados.', errores: validacion.errores }, 400);
  }

  const resultado = await agregarServicio(validacion.datos);
  if ('error' in resultado) {
    return responderError(409, resultado.error);
  }
  return responder({ servicio: resultado.servicio }, 201);
}
