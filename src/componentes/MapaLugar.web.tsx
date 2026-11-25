import { StyleSheet, View } from 'react-native';

import type { PropsMapaLugar } from '@/componentes/MapaLugar';
import { MapaSinUbicacion } from '@/componentes/MapaSinUbicacion';
import { MAPA_FICHA } from '@/constantes/mapa';
import { RADIOS } from '@/constantes/tema';

// react-native-maps no funciona en web: aquí se usa el mapa de OpenStreetMap con su marcador,
// solo para poder revisar la ficha en el navegador.
export function MapaLugar({ coordenadas, aproximada, nombre }: PropsMapaLugar) {
  if (!coordenadas) {
    return <MapaSinUbicacion />;
  }

  const { latitude, longitude } = coordenadas;
  const delta = (aproximada ? MAPA_FICHA.acercamientoAproximado : MAPA_FICHA.acercamiento) / 2;
  const area = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(',');
  const url =
    'https://www.openstreetmap.org/export/embed.html' +
    `?bbox=${area}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <View style={estilos.marco}>
      <iframe title={`Mapa con la ubicación de ${nombre}`} src={url} style={estiloIframe} />
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

// Estilo CSS directo: el iframe es un elemento HTML, no un componente de React Native
const estiloIframe = { width: '100%', height: '100%', border: 0 };
