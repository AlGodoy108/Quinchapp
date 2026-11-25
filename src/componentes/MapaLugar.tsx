import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { MapaSinUbicacion } from '@/componentes/MapaSinUbicacion';
import { MAPA_FICHA } from '@/constantes/mapa';
import { RADIOS } from '@/constantes/tema';
import type { Coordenadas } from '@/tipos/lugar';

export type PropsMapaLugar = {
  coordenadas?: Coordenadas;
  // true cuando el punto es aproximado (centro de la localidad)
  aproximada: boolean;
  colorPunto?: string;
  nombre: string;
  alPresionar: () => void;
};

// Mapa pequeño con un punto en la ubicación del lugar (ficha del lugar).
// Está quieto para no pelear con el scroll de la pantalla: al tocarlo se abre "Cómo llegar".
export function MapaLugar({
  coordenadas,
  aproximada,
  colorPunto,
  nombre,
  alPresionar,
}: PropsMapaLugar) {
  if (!coordenadas) {
    return <MapaSinUbicacion />;
  }

  const delta = aproximada ? MAPA_FICHA.acercamientoAproximado : MAPA_FICHA.acercamiento;

  return (
    <View style={estilos.marco}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...coordenadas, latitudeDelta: delta, longitudeDelta: delta }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        onPress={alPresionar}
        accessibilityLabel={`Mapa con la ubicación de ${nombre}`}
      >
        <Marker
          coordinate={coordenadas}
          title={nombre}
          pinColor={colorPunto}
          opacity={aproximada ? 0.55 : 1}
          onPress={alPresionar}
        />
      </MapView>
    </View>
  );
}

const estilos = StyleSheet.create({
  marco: {
    height: MAPA_FICHA.alto,
    borderRadius: RADIOS.tarjeta,
    overflow: 'hidden',
  },
});
