import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { COLORES } from '@/constantes/colores';
import type { Categoria } from '@/tipos/lugar';

type Props = {
  categoria: Categoria;
  alPresionar: () => void;
};

export function CirculoCategoria({ categoria, alPresionar }: Props) {
  return (
    <Pressable style={estilos.contenedor} onPress={alPresionar} accessibilityRole="button">
      <View style={[estilos.circulo, { backgroundColor: categoria.color }]}>
        <Icono nombre={categoria.icono} tamano={28} color="#FFFFFF" />
      </View>
      <Text style={estilos.nombre} numberOfLines={2}>
        {categoria.nombre}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    width: 84,
    alignItems: 'center',
    gap: 6,
  },
  circulo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORES.texto,
  },
});
