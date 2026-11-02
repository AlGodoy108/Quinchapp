import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Estrellas } from '@/componentes/Estrellas';
import { obtenerCategoria } from '@/constantes/categorias';
import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugar: Lugar;
  alPresionar: () => void;
};

export function TarjetaLugar({ lugar, alPresionar }: Props) {
  const categoria = obtenerCategoria(lugar.categoriaId);

  return (
    <Pressable style={estilos.tarjeta} onPress={alPresionar} accessibilityRole="button">
      {categoria && <ContenedorIcono nombre={categoria.icono} />}
      <View style={estilos.textos}>
        <Text style={estilos.nombre} numberOfLines={1}>
          {lugar.nombre}
        </Text>
        <Text style={estilos.categoria}>{categoria?.nombre}</Text>
      </View>
      <Estrellas valor={lugar.estrellas} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: 200,
    gap: ESPACIOS.m,
    padding: ESPACIOS.l,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  textos: {
    gap: 2,
  },
  nombre: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  categoria: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
