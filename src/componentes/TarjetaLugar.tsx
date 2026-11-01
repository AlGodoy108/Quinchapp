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

export function TarjetaLugar({ lugar, alPresionar }: Props) {
  const categoria = obtenerCategoria(lugar.categoriaId);

  return (
    <Pressable style={estilos.tarjeta} onPress={alPresionar} accessibilityRole="button">
      <View style={[estilos.imagen, { backgroundColor: categoria?.color }]}>
        {categoria && <Icono nombre={categoria.icono} tamano={40} color="#FFFFFF" />}
      </View>
      <View style={estilos.contenido}>
        <Text style={estilos.nombre} numberOfLines={1}>
          {lugar.nombre}
        </Text>
        <Text style={estilos.categoria}>{categoria?.nombre}</Text>
        <Estrellas valor={lugar.estrellas} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: 220,
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  imagen: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    padding: 12,
    gap: 4,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.texto,
  },
  categoria: {
    fontSize: 13,
    color: COLORES.textoSuave,
  },
});
