import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  actual: number;
  total: number;
  titulo: string;
};

// "Paso 3 de 8 · Ubicación" con una barra que se va llenando
export function ProgresoPasos({ actual, total, titulo }: Props) {
  return (
    <View
      style={estilos.contenedor}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: actual }}
    >
      <Text style={estilos.texto}>
        Paso {actual} de {total} · {titulo}
      </Text>
      <View style={estilos.riel}>
        <View style={[estilos.relleno, { width: `${(actual / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: ESPACIOS.s,
  },
  texto: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.primario,
  },
  riel: {
    height: 6,
    overflow: 'hidden',
    borderRadius: RADIOS.circulo,
    backgroundColor: COLORES.borde,
  },
  relleno: {
    height: '100%',
    borderRadius: RADIOS.circulo,
    backgroundColor: COLORES.primario,
  },
});
