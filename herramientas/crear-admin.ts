// Crea una cuenta de administrador, o cambia la contraseña de una que ya existe.
// Uso: npm run admin:crear
// No hay registro público: las cuentas admin solo se crean con este comando.

import { createInterface } from 'node:readline';

import {
  buscarAdminPorCorreo,
  modificarDatosAdmin,
  normalizarCorreo,
  nuevoAdmin,
  RUTA_ARCHIVO_ADMIN,
} from '../src/servidor/almacenAdmin.ts';
import { cifrarContrasena, validarContrasenaNueva } from '../src/servidor/contrasenas.ts';
import { cerrarTodasLasSesiones } from '../src/servidor/sesiones.ts';

const lector = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: process.stdin.isTTY,
});

// Mientras se escribe la contraseña no se muestra lo que se teclea
let ocultarEntrada = false;
const lectorInterno = lector as unknown as { _writeToOutput: (texto: string) => void };
const escribirOriginal = lectorInterno._writeToOutput.bind(lector);
lectorInterno._writeToOutput = (texto) => {
  if (!ocultarEntrada) {
    escribirOriginal(texto);
  }
};

const lineas = lector[Symbol.asyncIterator]();

async function preguntar(texto: string, oculta = false) {
  process.stdout.write(texto);
  ocultarEntrada = oculta;
  const { value } = await lineas.next();
  ocultarEntrada = false;
  if (oculta && process.stdin.isTTY) {
    process.stdout.write('\n');
  }
  return (value as string | undefined) ?? '';
}

async function principal() {
  console.log('Crear administrador del panel de Quinchapp\n');

  const correo = normalizarCorreo(await preguntar('Correo: '));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new Error('El correo no es válido.');
  }
  const nombre = (await preguntar('Nombre: ')).trim();
  if (!nombre) {
    throw new Error('Escribe un nombre.');
  }

  const contrasena = await preguntar('Contraseña (no se muestra al escribir): ', true);
  const problema = validarContrasenaNueva(contrasena, correo);
  if (problema) {
    throw new Error(problema);
  }
  if ((await preguntar('Repite la contraseña: ', true)) !== contrasena) {
    throw new Error('Las contraseñas no coinciden.');
  }

  const hash = await cifrarContrasena(contrasena);
  const { adminId, existia } = await modificarDatosAdmin((datos) => {
    const existente = buscarAdminPorCorreo(datos, correo);
    if (existente) {
      existente.nombre = nombre;
      existente.hashContrasena = hash;
      existente.contrasenaCambiadaEn = new Date().toISOString();
      delete datos.intentos[correo];
      return { adminId: existente.id, existia: true };
    }
    const admin = nuevoAdmin(correo, nombre, hash);
    datos.admins.push(admin);
    return { adminId: admin.id, existia: false };
  });

  if (existia) {
    await cerrarTodasLasSesiones(adminId);
    console.log(`\nListo: se actualizó la contraseña de ${correo} y se cerraron sus sesiones.`);
  } else {
    console.log(`\nListo: se creó el administrador ${correo}.`);
  }
  console.log(`Datos guardados en ${RUTA_ARCHIVO_ADMIN} (no se sube a GitHub).`);
}

principal()
  .catch((error: Error) => {
    console.error(`\nError: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => lector.close());
