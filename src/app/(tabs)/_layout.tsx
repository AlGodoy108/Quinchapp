import { Tabs } from 'expo-router';

import { Icono } from '@/componentes/Icono';
import { COLORES } from '@/constantes/colores';

export default function LayoutPestanas() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSuave,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icono nombre="inicio" tamano={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icono nombre="mapa" tamano={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, size }) => (
            <Icono nombre="categorias" tamano={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lugares"
        options={{
          title: 'Lugares',
          tabBarIcon: ({ color, size }) => <Icono nombre="lugares" tamano={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
