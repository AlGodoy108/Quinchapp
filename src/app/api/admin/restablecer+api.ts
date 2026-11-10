import { modificarDatosAdmin } from '@/servidor/almacenAdmin.ts';
import { cifrarContrasena, validarContrasenaNueva } from '@/servidor/contrasenas.ts';
import { leerCamposTexto, origenValido, responder, responderError } from '@/servidor/peticiones.ts';
import { cerrarTodasLasSesiones, hashToken } from '@/servidor/sesiones.ts';

type Resultado = { error: string } | { adminId: string };

const MENSAJE_ENLACE_INVALIDO = 'El enlace no es válido o ya venció. Pide uno nuevo.';

// Guardar la contraseña nueva usando el enlace del correo
export async function POST(request: Request) {
  if (!origenValido(request)) {
    return responderError(403, 'Petición rechazada.');
  }
  const campos = await leerCamposTexto(request, ['token', 'contrasena'] as const);
  if (!campos || !campos.token) {
    return responderError(400, MENSAJE_ENLACE_INVALIDO);
  }

  const hash = hashToken(campos.token);
  // Se cifra antes de entrar a la cola de escritura porque scrypt tarda
  const hashNuevo = await cifrarContrasena(campos.contrasena);

  const resultado = await modificarDatosAdmin((datos): Resultado => {
    const recuperacion = datos.recuperaciones.find((rec) => rec.hashToken === hash);
    const admin = datos.admins.find((a) => a.id === recuperacion?.adminId);
    if (!recuperacion || !admin) {
      return { error: MENSAJE_ENLACE_INVALIDO };
    }
    const problema = validarContrasenaNueva(campos.contrasena, admin.correo);
    if (problema) {
      return { error: problema };
    }
    admin.hashContrasena = hashNuevo;
    admin.contrasenaCambiadaEn = new Date().toISOString();
    // El enlace es de un solo uso, y se desbloquea la cuenta
    datos.recuperaciones = datos.recuperaciones.filter((rec) => rec.adminId !== admin.id);
    delete datos.intentos[admin.correo];
    return { adminId: admin.id };
  });

  if ('error' in resultado) {
    return responderError(400, resultado.error);
  }
  // Si alguien más tenía una sesión abierta con la contraseña anterior, se cierra
  await cerrarTodasLasSesiones(resultado.adminId);
  return responder({ mensaje: 'Tu contraseña se cambió. Ya puedes ingresar con ella.' });
}
