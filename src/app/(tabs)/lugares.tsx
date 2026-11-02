import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilaLugar } from '@/componentes/FilaLugar';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
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
            <Icono nombre="cerrar" tamano={ICONO.pequeno - 2} color={COLORES.sobrePrimario} />
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
    gap: ESPACIOS.s,
    padding: ESPACIOS.l,
  },
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ESPACIOS.s,
    marginBottom: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.m,
    paddingVertical: ESPACIOS.s,
    borderRadius: RADIOS.chip,
    backgroundColor: COLORES.primario,
  },
  textoFiltro: {
    ...TIPOGRAFIA.boton,
    fontSize: 13,
    color: COLORES.sobrePrimario,
  },
  vacio: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  textoVacio: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
  },
});
