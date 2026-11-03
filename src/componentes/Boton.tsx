import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  texto: string;
  alPresionar: () => void;
};

// Botón principal azul, con la forma de los botones del Figma
export function Boton({ texto, alPresionar }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}
      onPress={alPresionar}
      accessibilityRole="button"
    >
      <Text style={estilos.texto}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: ESPACIOS.xxl,
    paddingVertical: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    backgroundColor: COLORES.primario,
  },
  presionado: {
    opacity: 0.85,
  },
  texto: {
    ...TIPOGRAFIA.boton,
    color: COLORES.sobrePrimario,
  },
});
