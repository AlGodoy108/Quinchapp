import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FiltroCategorias } from '@/componentes/FiltroCategorias';
import { MapaLugares } from '@/componentes/MapaLugares';
import { COLORES, ESPACIOS } from '@/constantes/tema';
import { obtenerLugares } from '@/servicios/lugares';
import type { IdCategoria } from '@/tipos/lugar';

export default function PantallaMapa() {
  const margenes = useSafeAreaInsets();
  const [categoria, setCategoria] = useState<IdCategoria | null>(null);

  return (
    <View style={estilos.pantalla}>
      <MapaLugares
        lugares={obtenerLugares({ categoriaId: categoria ?? undefined })}
        alAbrirLugar={(lugar) => router.push({ pathname: '/lugar/[id]', params: { id: lugar.id } })}
      />
      <View style={[estilos.filtro, { top: margenes.top + ESPACIOS.s }]}>
        <FiltroCategorias seleccionada={categoria} alSeleccionar={setCategoria} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  filtro: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
