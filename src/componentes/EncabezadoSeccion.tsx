import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORES } from '@/constantes/colores';

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
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORES.texto,
  },
  accion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.primario,
  },
});
