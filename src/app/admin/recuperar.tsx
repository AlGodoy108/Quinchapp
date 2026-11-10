import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { CampoFormulario } from '@/componentes/CampoFormulario';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { PlantillaAcceso } from '@/componentes/PlantillaAcceso';
import { COLORES, TIPOGRAFIA } from '@/constantes/tema';
import { solicitarRecuperacion } from '@/servicios/admin';

export default function PantallaRecuperar() {
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function enviar() {
    if (enviando) {
      return;
    }
    if (!correo.trim()) {
      setError('Escribe tu correo.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      setMensaje(await solicitarRecuperacion(correo));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <PlantillaAcceso
      titulo="Recuperar contraseña"
      descripcion="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva."
    >
      {error ? <MensajeAviso tipo="error" texto={error} /> : null}
      {mensaje ? (
        <MensajeAviso
          tipo="exito"
          texto={`${mensaje} El enlace vence en 30 minutos. (En desarrollo, el enlace aparece en la terminal donde corre el servidor.)`}
        />
      ) : (
        <>
          <CampoFormulario
            etiqueta="Correo"
            valor={correo}
            alCambiar={setCorreo}
            placeholder="nombre@correo.cl"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            onSubmitEditing={enviar}
          />
          <Boton
            texto={enviando ? 'Enviando…' : 'Enviar enlace'}
            alPresionar={enviar}
            desactivado={enviando}
          />
        </>
      )}
      <Link href="/admin/ingresar" style={estilos.enlace}>
        Volver a ingresar
      </Link>
    </PlantillaAcceso>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.primario,
    textAlign: 'center',
  },
});
