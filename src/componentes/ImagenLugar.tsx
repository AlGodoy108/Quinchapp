import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { IMAGEN_SIN_DATOS } from '@/constantes/imagenes';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { TEXTOS_PENDIENTES, textoONada } from '@/utilidades/datosLugar';

type Props = {
  foto?: string;
  nombreLugar: string;
  alto?: number;
};

// Foto de portada del lugar. Si no hay foto o no se puede descargar, muestra al pudú.
export function ImagenLugar({ foto, nombreLugar, alto = 200 }: Props) {
  const [fallo, setFallo] = useState(false);
  const url = textoONada(foto);

  if (url && !fallo) {
    return (
      <Image
        source={{ uri: url }}
        style={[estilos.marco, { height: alto }]}
        resizeMode="cover"
        onError={() => setFallo(true)}
        accessibilityLabel={`Foto de ${nombreLugar}`}
      />
    );
  }

  return (
    <View style={[estilos.marco, estilos.sinFoto, { height: alto }]}>
      <Image
        source={IMAGEN_SIN_DATOS}
        style={estilos.pudu}
        resizeMode="contain"
        accessibilityLabel={`${nombreLugar} todavía no tiene foto`}
      />
      <View style={estilos.etiqueta}>
        <Icono nombre="informacion" tamano={ICONO.pequeno - 2} color={COLORES.textoSecundario} />
        <Text style={estilos.textoEtiqueta}>{TEXTOS_PENDIENTES.foto}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  marco: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIOS.s,
  },
  pudu: {
    flex: 1,
    width: '100%',
  },
  etiqueta: {
    position: 'absolute',
    left: ESPACIOS.m,
    top: ESPACIOS.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.s,
    paddingVertical: ESPACIOS.xs,
    borderRadius: RADIOS.chip,
    backgroundColor: COLORES.fondo,
  },
  textoEtiqueta: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
