import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { CATEGORIAS } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
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
            <View style={[estilos.icono, { backgroundColor: categoria.color }]}>
              <Icono nombre={categoria.icono} tamano={22} color="#FFFFFF" />
            </View>
            <View style={estilos.textos}>
              <Text style={estilos.nombre}>{categoria.nombre}</Text>
              <Text style={estilos.cantidad}>
                {cantidad} {cantidad === 1 ? 'lugar' : 'lugares'}
              </Text>
            </View>
            <Icono nombre="flecha" tamano={18} color={COLORES.textoSuave} />
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
    gap: 8,
    padding: 16,
  },
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.texto,
  },
  cantidad: {
    fontSize: 13,
    color: COLORES.textoSuave,
  },
});
