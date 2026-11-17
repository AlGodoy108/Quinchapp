import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { obtenerCategoria } from '@/constantes/categorias';
import { REGION_QUINCHAO } from '@/constantes/lugaresEjemplo';
import type { Lugar } from '@/tipos/lugar';
import { TEXTOS_PENDIENTES, textoONada, tieneUbicacion } from '@/utilidades/datosLugar';

type Props = {
  lugares: Lugar[];
  alAbrirLugar: (lugar: Lugar) => void;
};

export function MapaLugares({ lugares, alAbrirLugar }: Props) {
  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={REGION_QUINCHAO}>
      {lugares.filter(tieneUbicacion).map((lugar) => {
        const sinConfirmar = lugar.ubicacionConfirmada === false;
        const horario = textoONada(lugar.horario) ?? TEXTOS_PENDIENTES.horario;

        return (
          <Marker
            key={lugar.id}
            coordinate={lugar.coordenadas}
            title={lugar.nombre}
            description={sinConfirmar ? `${TEXTOS_PENDIENTES.ubicacion} · ${horario}` : horario}
            pinColor={obtenerCategoria(lugar.categoriaId)?.colorMapa}
            // Los puntos con ubicación aproximada se ven más claros
            opacity={sinConfirmar ? 0.55 : 1}
            onCalloutPress={() => alAbrirLugar(lugar)}
          />
        );
      })}
    </MapView>
  );
}
