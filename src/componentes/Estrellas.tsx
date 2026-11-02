import { StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { COLORES, ESPACIOS, FUENTES, ICONO, TIPOGRAFIA } from '@/constantes/tema';

export function Estrellas({ valor }: { valor: number }) {
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
});
