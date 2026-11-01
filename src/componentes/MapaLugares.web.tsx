import { ScrollView, StyleSheet, Text } from 'react-native';

import { FilaLugar } from '@/componentes/FilaLugar';
import { COLORES } from '@/constantes/colores';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugares: Lugar[];
  alAbrirLugar: (lugar: Lugar) => void;
};

// react-native-maps no funciona en web: aquí solo se muestra la lista como reemplazo
export function MapaLugares({ lugares, alAbrirLugar }: Props) {
  return (
    <ScrollView style={estilos.fondo} contentContainerStyle={estilos.contenido}>
      <Text style={estilos.aviso}>El mapa solo se ve en el celular con Expo Go.</Text>
      {lugares.map((lugar) => (
        <FilaLugar key={lugar.id} lugar={lugar} alPresionar={() => alAbrirLugar(lugar)} />
      ))}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    gap: 8,
    paddingTop: 72,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  aviso: {
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
});
