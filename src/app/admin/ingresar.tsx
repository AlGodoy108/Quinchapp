import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { CampoFormulario } from '@/componentes/CampoFormulario';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { PlantillaAcceso } from '@/componentes/PlantillaAcceso';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';

export default function PantallaIngresar() {
  const { ingresar } = useSesionAdmin();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar() {
    if (enviando) {
      return;
    }
    if (!correo.trim() || !contrasena) {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      // Si sale bien, el layout cambia solo al panel
      await ingresar(correo, contrasena);
    } catch (e) {
      setError((e as Error).message);
      setContrasena('');
      setEnviando(false);
    }
  }

  return (
    <PlantillaAcceso
      titulo="Ingresar"
      descripcion="Acceso exclusivo para administradores de la app."
    >
      {error ? <MensajeAviso tipo="error" texto={error} /> : null}
      <View style={estilos.campos}>
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
        <CampoFormulario
          etiqueta="Contraseña"
          valor={contrasena}
          alCambiar={setContrasena}
          secureTextEntry
          autoComplete="current-password"
          onSubmitEditing={enviar}
        />
      </View>
      <Boton
        texto={enviando ? 'Ingresando…' : 'Ingresar'}
        alPresionar={enviar}
        desactivado={enviando}
      />
      <Link href="/admin/recuperar" style={estilos.enlace}>
        ¿Olvidaste tu contraseña?
      </Link>
      <Text style={estilos.nota}>
        Las cuentas de administrador las crea el equipo con el comando npm run admin:crear.
      </Text>
    </PlantillaAcceso>
  );
}

const estilos = StyleSheet.create({
  campos: {
    gap: ESPACIOS.l,
  },
  enlace: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.primario,
    textAlign: 'center',
  },
  nota: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
