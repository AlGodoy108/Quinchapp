// Cifrado y validación de contraseñas con scrypt (incluido en Node, sin librerías extra).
// scrypt es lento a propósito: así probar millones de contraseñas cuesta demasiado.

import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const OPCIONES: ScryptOptions = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const LARGO_HASH = 64;

export const LARGO_MINIMO_CONTRASENA = 12;
const LARGO_MAXIMO_CONTRASENA = 128;

// Contraseñas tan comunes que se rechazan aunque cumplan el largo
const CONTRASENAS_COMUNES = [
  '123456789012',
  'contrasena123',
  'contraseña123',
  'password1234',
  'qwertyuiop12',
  'quinchao1234',
  'quinchapp123',
  'achao1234567',
  'administrador',
  'admin1234567',
];

function derivar(contrasena: string, sal: Buffer, opciones: ScryptOptions): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    scrypt(contrasena.normalize('NFKC'), sal, LARGO_HASH, opciones, (error, clave) =>
      error ? rechazar(error) : resolver(clave),
    );
  });
}

// Formato guardado: scrypt$N$r$p$sal$hash (sal y hash en base64)
export async function cifrarContrasena(contrasena: string) {
  const sal = randomBytes(16);
  const hash = await derivar(contrasena, sal, OPCIONES);
  return [
    'scrypt',
    OPCIONES.N,
    OPCIONES.r,
    OPCIONES.p,
    sal.toString('base64'),
    hash.toString('base64'),
  ].join('$');
}

export async function verificarContrasena(contrasena: string, guardado: string) {
  const [algoritmo, n, r, p, sal, hash] = guardado.split('$');
  if (algoritmo !== 'scrypt' || !sal || !hash) {
    return false;
  }
  const esperado = Buffer.from(hash, 'base64');
  const calculado = await derivar(contrasena, Buffer.from(sal, 'base64'), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: OPCIONES.maxmem,
  });
  // Comparación de tiempo constante: no revela cuántos caracteres coinciden
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}

// Hash de una contraseña que nadie conoce. Se compara contra él cuando el correo no existe,
// para que la respuesta tarde lo mismo y no delate qué correos están registrados.
let hashFicticio: Promise<string> | undefined;
export function obtenerHashFicticio() {
  hashFicticio ??= cifrarContrasena(randomBytes(32).toString('hex'));
  return hashFicticio;
}

// Devuelve el problema de la contraseña nueva, o null si es válida
export function validarContrasenaNueva(contrasena: string, correo: string): string | null {
  if (contrasena.length < LARGO_MINIMO_CONTRASENA) {
    return `La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`;
  }
  if (contrasena.length > LARGO_MAXIMO_CONTRASENA) {
    return `La contraseña no puede tener más de ${LARGO_MAXIMO_CONTRASENA} caracteres.`;
  }
  const minuscula = contrasena.toLowerCase();
  const usuarioCorreo = correo.split('@')[0]?.toLowerCase();
  if (usuarioCorreo && usuarioCorreo.length >= 4 && minuscula.includes(usuarioCorreo)) {
    return 'La contraseña no puede contener tu correo.';
  }
  if (CONTRASENAS_COMUNES.includes(minuscula) || new Set(minuscula).size < 4) {
    return 'Esa contraseña es demasiado fácil de adivinar. Prueba con una frase de varias palabras.';
  }
  return null;
}
