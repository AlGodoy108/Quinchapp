// Envío de correos. Por ahora no hay servicio de correo contratado, así que el enlace
// se muestra en la terminal donde corre `npx expo start`.
// Para publicar, reemplazar el cuerpo de esta función por un servicio real (Resend, Brevo, etc.).

export async function enviarCorreoRecuperacion(correo: string, enlace: string) {
  console.log(
    [
      '',
      '──────── Correo de recuperación (simulado) ────────',
      `Para: ${correo}`,
      'Abre este enlace para crear una contraseña nueva (vence en 30 minutos):',
      enlace,
      '───────────────────────────────────────────────────',
      '',
    ].join('\n'),
  );
}
