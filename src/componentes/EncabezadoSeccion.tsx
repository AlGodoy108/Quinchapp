import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  titulo: string;
  textoAccion: string;
  alPresionarAccion: () => void;
};

export function EncabezadoSeccion({ titulo, textoAccion, alPresionarAccion }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Pressable onPress={alPresionarAccion} hitSlop={12} accessibilityRole="button">
        <Text style={estilos.accion}>{textoAccion}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACIOS.xxl,
    marginBottom: ESPACIOS.m,
  },
  titulo: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
  },
  accion: {
    ...TIPOGRAFIA.boton,
    color: COLORES.primario,
  },
});
