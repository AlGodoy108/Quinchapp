import {
  buscarAdminPorCorreo,
  leerDatosAdmin,
  modificarDatosAdmin,
  normalizarCorreo,
} from '@/servidor/almacenAdmin.ts';
import { obtenerHashFicticio, verificarContrasena } from '@/servidor/contrasenas.ts';
import {
  datosPublicosAdmin,
  leerCamposTexto,
  origenValido,
  responder,
  responderError,
} from '@/servidor/peticiones.ts';
import { cerrarSesion, iniciarSesion, obtenerAdminDeSesion } from '@/servidor/sesiones.ts';

const MAXIMO_FALLOS = 5;
const DURACION_BLOQUEO_MS = 15 * 60 * 1000;
const MENSAJE_FALLO = 'Correo o contraseña incorrectos.';

// ¿Quién tiene la sesión abierta? Sin sesión responde admin: null (no es un error)
export async function GET(request: Request) {
  const admin = await obtenerAdminDeSesion(request);
  return responder({ admin: admin ? datosPublicosAdmin(admin) : null });
}

// Iniciar sesión
export async function POST(request: Request) {
  if (!origenValido(request)) {
    return responderError(403, 'Petición rechazada.');
  }
  const campos = await leerCamposTexto(request, ['correo', 'contrasena'] as const);
  if (!campos || !campos.correo.trim() || !campos.contrasena) {
    return responderError(400, 'Escribe tu correo y tu contraseña.');
  }
  const correo = normalizarCorreo(campos.correo);

  const datos = await leerDatosAdmin();
  const intentos = datos.intentos[correo];
  if (intentos && intentos.bloqueadoHasta > Date.now()) {
    const minutos = Math.ceil((intentos.bloqueadoHasta - Date.now()) / 60000);
    return responderError(
      429,
      `Demasiados intentos fallidos. Espera ${minutos} minuto${minutos === 1 ? '' : 's'} o recupera tu contraseña.`,
    );
  }

  const admin = buscarAdminPorCorreo(datos, correo);
  // Si el correo no existe igual se calcula un hash, para que la respuesta tarde lo mismo
  const valida = await verificarContrasena(
    campos.contrasena,
    admin?.hashContrasena ?? (await obtenerHashFicticio()),
  );

  if (!admin || !valida) {
    await modificarDatosAdmin((d) => {
      const fallos = (d.intentos[correo]?.fallos ?? 0) + 1;
      d.intentos[correo] =
        fallos >= MAXIMO_FALLOS
          ? { fallos: 0, bloqueadoHasta: Date.now() + DURACION_BLOQUEO_MS }
          : { fallos, bloqueadoHasta: 0 };
    });
    return responderError(401, MENSAJE_FALLO);
  }

  await modificarDatosAdmin((d) => {
    delete d.intentos[correo];
  });
  const cookie = await iniciarSesion(request, admin.id);
  return responder({ admin: datosPublicosAdmin(admin) }, 200, { 'Set-Cookie': cookie });
}

// Cerrar sesión
export async function DELETE(request: Request) {
  if (!origenValido(request)) {
    return responderError(403, 'Petición rechazada.');
  }
  const cookie = await cerrarSesion(request);
  return responder({ ok: true }, 200, { 'Set-Cookie': cookie });
}
