import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIAS } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
import type { IdCategoria } from '@/tipos/lugar';

type Props = {
  seleccionada: IdCategoria | null;
  alSeleccionar: (categoria: IdCategoria | null) => void;
};

export function FiltroCategorias({ seleccionada, alSeleccionar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.contenido}
    >
      <Opcion
        nombre="Todas"
        color={COLORES.primario}
        activa={seleccionada === null}
        alPresionar={() => alSeleccionar(null)}
      />
      {CATEGORIAS.map((categoria) => (
        <Opcion
          key={categoria.id}
          nombre={categoria.nombre}
          color={categoria.color}
          activa={seleccionada === categoria.id}
          alPresionar={() => alSeleccionar(categoria.id)}
        />
      ))}
    </ScrollView>
  );
}

type PropsOpcion = {
  nombre: string;
  color: string;
  activa: boolean;
  alPresionar: () => void;
};

function Opcion({ nombre, color, activa, alPresionar }: PropsOpcion) {
  return (
    <Pressable
      style={[estilos.opcion, activa && { backgroundColor: color, borderColor: color }]}
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityState={{ selected: activa }}
    >
      <View style={[estilos.punto, { backgroundColor: activa ? '#FFFFFF' : color }]} />
      <Text style={[estilos.nombre, activa && estilos.nombreActivo]}>{nombre}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nombre: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.texto,
  },
  nombreActivo: {
    color: '#FFFFFF',
  },
});
