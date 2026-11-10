import { Pressable, StyleSheet, Text } from 'react-native';

import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  texto: string;
  alPresionar: () => void;
  // secundario: fondo blanco con borde, para acciones menos importantes
  variante?: 'primario' | 'secundario';
  desactivado?: boolean;
};

// Botón principal azul, con la forma de los botones del Figma
export function Boton({ texto, alPresionar, variante = 'primario', desactivado = false }: Props) {
  const secundario = variante === 'secundario';
  return (
    <Pressable
      style={({ pressed }) => [
        estilos.boton,
        secundario && estilos.botonSecundario,
        pressed && estilos.presionado,
        desactivado && estilos.desactivado,
      ]}
      onPress={alPresionar}
      disabled={desactivado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desactivado }}
    >
      <Text style={[estilos.texto, secundario && estilos.textoSecundario]}>{texto}</Text>
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
  botonSecundario: {
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  presionado: {
    opacity: 0.85,
  },
  desactivado: {
    opacity: 0.5,
  },
  texto: {
    ...TIPOGRAFIA.boton,
    color: COLORES.sobrePrimario,
  },
  textoSecundario: {
    color: COLORES.primario,
  },
});
