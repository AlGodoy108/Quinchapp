import type { ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useTituloPagina } from '@/hooks/useTituloPagina';

type Props = {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
};

// Tarjeta centrada con el logo, para las pantallas de ingreso y recuperación del panel admin
export function PlantillaAcceso({ titulo, descripcion, children }: Props) {
  useTituloPagina(`${titulo} · Panel Quinchapp`);
  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.tarjeta}>
        <Image
          source={require('../../assets/Base/LOGO ORIGINAL HORIZONTAL TRANSPARENCIA.png')}
          style={estilos.logo}
          resizeMode="contain"
          accessibilityLabel="Municipalidad de Quinchao"
        />
        <View style={estilos.textos}>
          <Text style={estilos.etiqueta}>Panel de administración</Text>
          <Text style={estilos.titulo} accessibilityRole="header">
            {titulo}
          </Text>
          {descripcion ? <Text style={estilos.descripcion}>{descripcion}</Text> : null}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIOS.l,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    gap: ESPACIOS.xl,
    padding: ESPACIOS.xxl,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  logo: {
    width: '100%',
    height: 72,
  },
  textos: {
    gap: ESPACIOS.xs,
  },
  etiqueta: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.primario,
  },
  titulo: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
  },
});
