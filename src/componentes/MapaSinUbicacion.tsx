import { StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { MAPA_FICHA } from '@/constantes/mapa';
import { COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { TEXTOS_PENDIENTES } from '@/utilidades/datosLugar';

// Se muestra en lugar del mapa cuando el lugar no tiene coordenadas
export function MapaSinUbicacion() {
  return (
    <View style={estilos.caja}>
      <Icono nombre="sinUbicacion" tamano={ICONO.normal + 6} color={COLORES.textoSecundario} />
      <Text style={estilos.texto}>{TEXTOS_PENDIENTES.sinUbicacion}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    height: MAPA_FICHA.alto,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIOS.s,
    padding: ESPACIOS.l,
    borderRadius: RADIOS.tarjeta,
    backgroundColor: COLORES.fondo,
  },
  texto: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
