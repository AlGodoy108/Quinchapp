import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { CampoFormulario } from '@/componentes/CampoFormulario';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { PlantillaAcceso } from '@/componentes/PlantillaAcceso';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import { restablecerContrasena } from '@/servicios/admin';

const LARGO_MINIMO = 12;

// Se abre desde el enlace del correo de recuperación: /admin/restablecer?token=...
export default function PantallaRestablecer() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [contrasena, setContrasena] = useState('');
  const [repetida, setRepetida] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState<string | null>(null);

  async function enviar() {
    if (enviando || !token) {
      return;
    }
    if (contrasena.length < LARGO_MINIMO) {
      setError(`La contraseña debe tener al menos ${LARGO_MINIMO} caracteres.`);
      return;
    }
    if (contrasena !== repetida) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      setListo(await restablecerContrasena(token, contrasena));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <PlantillaAcceso titulo="Enlace incompleto">
        <MensajeAviso
          tipo="error"
          texto="Este enlace no tiene el código de recuperación. Ábrelo de nuevo desde el correo o pide uno nuevo."
        />
        <Link href="/admin/recuperar" style={estilos.enlace}>
          Pedir un enlace nuevo
        </Link>
      </PlantillaAcceso>
    );
  }

  if (listo) {
    return (
      <PlantillaAcceso titulo="Contraseña actualizada">
        <MensajeAviso tipo="exito" texto={listo} />
        <Link href="/admin/ingresar" style={estilos.enlace}>
          Ir a ingresar
        </Link>
      </PlantillaAcceso>
    );
  }

  return (
    <PlantillaAcceso
      titulo="Nueva contraseña"
      descripcion="Usa al menos 12 caracteres. Una frase de varias palabras es fácil de recordar y difícil de adivinar."
    >
      {error ? <MensajeAviso tipo="error" texto={error} /> : null}
      <View style={estilos.campos}>
        <CampoFormulario
          etiqueta="Contraseña nueva"
          valor={contrasena}
          alCambiar={setContrasena}
          secureTextEntry
          autoComplete="new-password"
          ayuda={
            contrasena.length < LARGO_MINIMO
              ? `Faltan ${LARGO_MINIMO - contrasena.length} caracteres`
              : 'Largo suficiente'
          }
          onSubmitEditing={enviar}
        />
        <CampoFormulario
          etiqueta="Repite la contraseña"
          valor={repetida}
          alCambiar={setRepetida}
          secureTextEntry
          autoComplete="new-password"
          onSubmitEditing={enviar}
        />
      </View>
      <Boton
        texto={enviando ? 'Guardando…' : 'Guardar contraseña'}
        alPresionar={enviar}
        desactivado={enviando}
      />
      <Link href="/admin/recuperar" style={estilos.enlace}>
        Pedir un enlace nuevo
      </Link>
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
});
