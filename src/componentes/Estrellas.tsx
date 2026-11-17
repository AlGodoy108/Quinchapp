import { StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { COLORES, ESPACIOS, FUENTES, ICONO, TIPOGRAFIA } from '@/constantes/tema';
import { TEXTOS_PENDIENTES } from '@/utilidades/datosLugar';

export function Estrellas({ valor }: { valor?: number }) {
  const tieneValor = typeof valor === 'number' && Number.isFinite(valor) && valor > 0;

  if (!tieneValor) {
    return (
      <View style={estilos.contenedor} accessibilityLabel={TEXTOS_PENDIENTES.estrellas}>
        <Icono nombre="estrella" tamano={ICONO.pequeno} color={COLORES.borde} />
        <Text style={estilos.sinValor}>{TEXTOS_PENDIENTES.estrellas}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor} accessibilityLabel={`${valor.toFixed(1)} estrellas`}>
      <Icono
        nombre="estrella"
        tamano={ICONO.pequeno}
        color={COLORES.estrella}
        relleno={COLORES.estrella}
      />
      <Text style={estilos.valor}>{valor.toFixed(1)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.xs,
  },
  valor: {
    ...TIPOGRAFIA.pequeno,
    fontFamily: FUENTES.media,
    color: COLORES.texto,
  },
  sinValor: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
