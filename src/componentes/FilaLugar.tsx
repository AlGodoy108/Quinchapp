import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Estrellas } from '@/componentes/Estrellas';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugar: Lugar;
  alPresionar: () => void;
};

export function FilaLugar({ lugar, alPresionar }: Props) {
  const categoria = obtenerCategoria(lugar.categoriaId);

  return (
    <Pressable style={estilos.fila} onPress={alPresionar} accessibilityRole="button">
      {categoria && <ContenedorIcono nombre={categoria.icono} tamano={44} />}
      <View style={estilos.contenido}>
        <Text style={estilos.nombre} numberOfLines={1}>
          {lugar.nombre}
        </Text>
        <Text style={estilos.horario} numberOfLines={1}>
          {lugar.horario}
        </Text>
        <Estrellas valor={lugar.estrellas} />
      </View>
      <Icono nombre="flecha" tamano={ICONO.pequeno + 2} color={COLORES.textoSecundario} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.m,
    padding: ESPACIOS.m,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  contenido: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  horario: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
