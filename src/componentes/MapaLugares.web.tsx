import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilaLugar } from '@/componentes/FilaLugar';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import type { Lugar } from '@/tipos/lugar';

type Props = {
  lugares: Lugar[];
  alAbrirLugar: (lugar: Lugar) => void;
};

// react-native-maps no funciona en web: aquí solo se muestra la lista como reemplazo
export function MapaLugares({ lugares, alAbrirLugar }: Props) {
  const margenes = useSafeAreaInsets();

  return (
    <ScrollView
      style={estilos.fondo}
      contentContainerStyle={[estilos.contenido, { paddingTop: margenes.top + 72 }]}
    >
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
    gap: ESPACIOS.s,
    paddingHorizontal: ESPACIOS.l,
    paddingBottom: ESPACIOS.l,
  },
  aviso: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
