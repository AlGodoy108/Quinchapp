import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { obtenerCategoria } from '@/constantes/categorias';
import { REGION_QUINCHAO } from '@/constantes/lugaresEjemplo';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugares: Lugar[];
  alAbrirLugar: (lugar: Lugar) => void;
};

export function MapaLugares({ lugares, alAbrirLugar }: Props) {
  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={REGION_QUINCHAO}>
      {lugares.map((lugar) => (
        <Marker
          key={lugar.id}
          coordinate={lugar.coordenadas}
          title={lugar.nombre}
          description={lugar.horario}
          pinColor={obtenerCategoria(lugar.categoriaId)?.colorMapa}
          onCalloutPress={() => alAbrirLugar(lugar)}
        />
      ))}
    </MapView>
  );
}
