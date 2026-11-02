import { Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, FUENTES, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

// Ícono de pestaña con la "píldora" celeste cuando está activa, como en el Figma
function iconoPestana(nombre: NombreIcono) {
  function IconoPestana({ focused, color }: { focused: boolean; color: ColorValue }) {
    return (
      <View style={[estilos.indicador, focused && estilos.indicadorActivo]}>
        <Icono nombre={nombre} tamano={ICONO.normal} color={color} />
      </View>
    );
  }
  return IconoPestana;
}

export default function LayoutPestanas() {
  const margenes = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSecundario,
        tabBarLabelStyle: estilos.etiqueta,
        // La altura suma el margen inferior del teléfono (barra de inicio del iPhone)
        tabBarStyle: [
          estilos.barra,
          { height: 76 + margenes.bottom, paddingBottom: margenes.bottom + ESPACIOS.s },
        ],
        headerStyle: { backgroundColor: COLORES.fondo },
        headerTitleStyle: { ...TIPOGRAFIA.titulo2, color: COLORES.texto },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: COLORES.fondo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', headerShown: false, tabBarIcon: iconoPestana('inicio') }}
      />
      <Tabs.Screen
        name="mapa"
        options={{ title: 'Mapa', headerShown: false, tabBarIcon: iconoPestana('mapa') }}
      />
      <Tabs.Screen
        name="categorias"
        options={{ title: 'Categorías', tabBarIcon: iconoPestana('categorias') }}
      />
      <Tabs.Screen
        name="lugares"
        options={{ title: 'Lugares', tabBarIcon: iconoPestana('lugares') }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  barra: {
    paddingTop: ESPACIOS.s,
    borderTopWidth: BORDES.tarjeta,
    borderTopColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  etiqueta: {
    fontFamily: FUENTES.media,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  indicador: {
    width: 58,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIOS.chip,
  },
  indicadorActivo: {
    backgroundColor: COLORES.primarioSuave,
  },
});
