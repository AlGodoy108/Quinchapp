import { StyleSheet, Text, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { COLORES } from '@/constantes/colores';

export function Estrellas({ valor }: { valor: number }) {
  return (
    <View style={estilos.contenedor} accessibilityLabel={`${valor.toFixed(1)} estrellas`}>
      <Icono nombre="estrella" tamano={14} color={COLORES.estrella} />
      <Text style={estilos.valor}>{valor.toFixed(1)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valor: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.texto,
  },
});
