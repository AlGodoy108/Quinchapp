import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilaLugar } from '@/componentes/FilaLugar';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
import { obtenerLugares } from '@/servicios/lugares';

export default function PantallaLugares() {
  const { categoria, busqueda } = useLocalSearchParams<{
    categoria?: string;
    busqueda?: string;
  }>();
  const nombreCategoria = obtenerCategoria(categoria)?.nombre;
  const filtroActivo = nombreCategoria ?? (busqueda ? `“${busqueda}”` : null);

  return (
    <FlatList
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenido}
      data={obtenerLugares({ categoriaId: categoria || undefined, busqueda })}
      keyExtractor={(lugar) => lugar.id}
      ListHeaderComponent={
        filtroActivo ? (
          <Pressable
            style={estilos.filtro}
            onPress={() => router.setParams({ categoria: '', busqueda: '' })}
            accessibilityRole="button"
            accessibilityLabel={`Quitar filtro ${filtroActivo}`}
          >
            <Text style={estilos.textoFiltro}>{filtroActivo}</Text>
            <Icono nombre="cerrar" tamano={14} color="#FFFFFF" />
          </Pressable>
        ) : undefined
      }
      ListEmptyComponent={
        <View style={estilos.vacio}>
          <Text style={estilos.textoVacio}>No encontramos lugares con ese filtro.</Text>
        </View>
      }
      renderItem={({ item: lugar }) => (
        <FilaLugar
          lugar={lugar}
          alPresionar={() => router.push({ pathname: '/lugar/[id]', params: { id: lugar.id } })}
        />
      )}
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
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORES.primario,
  },
  textoFiltro: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vacio: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  textoVacio: {
    color: COLORES.textoSuave,
  },
});
