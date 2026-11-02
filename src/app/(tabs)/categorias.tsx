import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Icono } from '@/componentes/Icono';
import { CATEGORIAS } from '@/constantes/categorias';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { obtenerLugares } from '@/servicios/lugares';

export default function PantallaCategorias() {
  return (
    <FlatList
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenido}
      data={CATEGORIAS}
      keyExtractor={(categoria) => categoria.id}
      renderItem={({ item: categoria }) => {
        const cantidad = obtenerLugares({ categoriaId: categoria.id }).length;

        return (
          <Pressable
            style={estilos.fila}
            onPress={() =>
              router.navigate({
                pathname: '/lugares',
                params: { categoria: categoria.id, busqueda: '' },
              })
            }
            accessibilityRole="button"
          >
            <ContenedorIcono nombre={categoria.icono} tamano={44} />
            <View style={estilos.textos}>
              <Text style={estilos.nombre}>{categoria.nombre}</Text>
              <Text style={estilos.cantidad}>
                {cantidad} {cantidad === 1 ? 'lugar' : 'lugares'}
              </Text>
            </View>
            <Icono nombre="flecha" tamano={ICONO.pequeno + 2} color={COLORES.textoSecundario} />
          </Pressable>
        );
      }}
    />
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    gap: ESPACIOS.s,
    padding: ESPACIOS.l,
  },
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
  textos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  cantidad: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
