import { Pressable, StyleSheet, Text } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import type { Categoria } from '@/tipos/lugar';

type Props = {
  categoria: Categoria;
  alPresionar: () => void;
};

export function CirculoCategoria({ categoria, alPresionar }: Props) {
  return (
    <Pressable style={estilos.contenedor} onPress={alPresionar} accessibilityRole="button">
      <ContenedorIcono nombre={categoria.icono} tamano={64} redondo />
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
    gap: ESPACIOS.s,
  },
  nombre: {
    ...TIPOGRAFIA.pequeno,
    textAlign: 'center',
    color: COLORES.texto,
  },
});
