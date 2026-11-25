import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Buscador } from '@/componentes/Buscador';
import { EstadoVacio } from '@/componentes/EstadoVacio';
import { FilaLugar } from '@/componentes/FilaLugar';
import { FiltroCategorias } from '@/componentes/FiltroCategorias';
import { Icono } from '@/componentes/Icono';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import { obtenerLugares } from '@/servicios/lugares';
import type { IdCategoria } from '@/tipos/lugar';

// Se abre al tocar el buscador de Inicio: el teclado aparece al tiro,
// las categorías quedan debajo y los resultados se filtran mientras se escribe.
export default function PantallaBuscar() {
  const margenes = useSafeAreaInsets();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<IdCategoria | null>(null);

  const resultados = obtenerLugares({ busqueda, categoriaId: categoria ?? undefined });
  const hayFiltro = busqueda.trim().length > 0 || categoria !== null;

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria(null);
  };

  return (
    <View style={[estilos.pantalla, { paddingTop: margenes.top + ESPACIOS.s }]}>
      <View style={estilos.barra}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={ESPACIOS.s}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Icono nombre="volver" color={COLORES.primario} />
        </Pressable>
        <View style={estilos.buscador}>
          <Buscador valor={busqueda} alCambiar={setBusqueda} autoFoco />
        </View>
      </View>

      <View style={estilos.filtro}>
        <FiltroCategorias seleccionada={categoria} alSeleccionar={setCategoria} />
      </View>

      <FlatList
        style={estilos.lista}
        contentContainerStyle={estilos.contenido}
        data={resultados}
        keyExtractor={(lugar) => lugar.id}
        // Permite tocar un resultado sin tener que cerrar antes el teclado
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          resultados.length > 0 ? (
            <Text style={estilos.conteo}>
              {hayFiltro
                ? `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}`
                : 'Todos los lugares'}
            </Text>
          ) : undefined
        }
        ListEmptyComponent={
          <EstadoVacio
            titulo="No encontramos lugares"
            descripcion="Prueba con otra palabra o elige otra categoría."
            textoBoton="Quitar filtros"
            alPresionarBoton={limpiarFiltros}
          />
        }
        renderItem={({ item: lugar }) => (
          <FilaLugar
            lugar={lugar}
            alPresionar={() => router.push({ pathname: '/lugar/[id]', params: { id: lugar.id } })}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.m,
    paddingHorizontal: ESPACIOS.l,
  },
  buscador: {
    flex: 1,
  },
  filtro: {
    paddingTop: ESPACIOS.m,
    paddingBottom: ESPACIOS.s,
    paddingLeft: ESPACIOS.xs,
  },
  lista: {
    flex: 1,
  },
  contenido: {
    gap: ESPACIOS.s,
    paddingHorizontal: ESPACIOS.l,
    paddingBottom: ESPACIOS.l,
  },
  conteo: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
