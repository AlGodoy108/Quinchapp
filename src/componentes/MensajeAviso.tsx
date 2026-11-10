import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  texto: string;
  tipo: 'error' | 'exito';
};

// Recuadro de color para avisar un error o confirmar que algo salió bien
export function MensajeAviso({ texto, tipo }: Props) {
  const esError = tipo === 'error';
  return (
    <View
      style={[estilos.aviso, esError ? estilos.error : estilos.exito]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={[estilos.texto, { color: esError ? COLORES.emergencia : COLORES.acento }]}>
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    padding: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    borderLeftWidth: 4,
  },
  error: {
    borderLeftColor: COLORES.emergencia,
    backgroundColor: COLORES.emergenciaSuave,
  },
  exito: {
    borderLeftColor: COLORES.acento,
    backgroundColor: COLORES.acentoSuave,
  },
  texto: {
    ...TIPOGRAFIA.cuerpo,
  },
});
