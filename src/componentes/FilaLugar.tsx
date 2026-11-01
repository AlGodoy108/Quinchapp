import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Estrellas } from '@/componentes/Estrellas';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugar: Lugar;
  alPresionar: () => void;
};

export function FilaLugar({ lugar, alPresionar }: Props) {
  const categoria = obtenerCategoria(lugar.categoriaId);

  return (
    <Pressable style={estilos.fila} onPress={alPresionar} accessibilityRole="button">
      <View style={[estilos.icono, { backgroundColor: categoria?.color }]}>
        {categoria && <Icono nombre={categoria.icono} tamano={22} color="#FFFFFF" />}
      </View>
      <View style={estilos.contenido}>
        <Text style={estilos.nombre} numberOfLines={1}>
          {lugar.nombre}
        </Text>
        <Text style={estilos.horario} numberOfLines={1}>
          {lugar.horario}
        </Text>
        <Estrellas valor={lugar.estrellas} />
      </View>
      <Icono nombre="flecha" tamano={18} color={COLORES.textoSuave} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  icono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    flex: 1,
    gap: 3,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.texto,
  },
  horario: {
    fontSize: 13,
    color: COLORES.textoSuave,
  },
});
