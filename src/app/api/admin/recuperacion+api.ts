import {
  buscarAdminPorCorreo,
  leerDatosAdmin,
  modificarDatosAdmin,
} from '@/servidor/almacenAdmin.ts';
import { enviarCorreoRecuperacion } from '@/servidor/correo.ts';
import { leerCamposTexto, origenValido, responder, responderError } from '@/servidor/peticiones.ts';
import { crearToken, hashToken } from '@/servidor/sesiones.ts';

const DURACION_ENLACE_MS = 30 * 60 * 1000;
// Mínimo entre dos enlaces para el mismo admin, para que no se pueda llenar su correo
const ESPERA_ENTRE_ENLACES_MS = 2 * 60 * 1000;

// Siempre se responde lo mismo, exista o no el correo, para no revelar quién es admin
const MENSAJE =
  'Si el correo pertenece a un administrador, te enviamos un enlace para crear una contraseña nueva.';

// Pedir un enlace para restablecer la contraseña
export async function POST(request: Request) {
  if (!origenValido(request)) {
    return responderError(403, 'Petición rechazada.');
  }
  const campos = await leerCamposTexto(request, ['correo'] as const);
  if (!campos || !campos.correo.trim()) {
    return responderError(400, 'Escribe tu correo.');
  }

  const admin = buscarAdminPorCorreo(await leerDatosAdmin(), campos.correo);
  if (!admin) {
    return responder({ mensaje: MENSAJE });
  }

  const token = crearToken();
  const creado = await modificarDatosAdmin((datos) => {
    const anterior = datos.recuperaciones.find((rec) => rec.adminId === admin.id);
    if (anterior && anterior.expiraEn - DURACION_ENLACE_MS + ESPERA_ENTRE_ENLACES_MS > Date.now()) {
      return false;
    }
    // Un enlace nuevo invalida los anteriores
    datos.recuperaciones = datos.recuperaciones.filter((rec) => rec.adminId !== admin.id);
    datos.recuperaciones.push({
      hashToken: hashToken(token),
      adminId: admin.id,
      expiraEn: Date.now() + DURACION_ENLACE_MS,
    });
    return true;
  });

  if (creado) {
    const enlace = `${new URL(request.url).origin}/admin/restablecer?token=${token}`;
    await enviarCorreoRecuperacion(admin.correo, enlace);
  }
  return responder({ mensaje: MENSAJE });
}
