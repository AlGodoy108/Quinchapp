import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { COLORES, TIPOGRAFIA } from '@/constantes/tema';

SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fuentesCargadas, errorFuentes] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fuentesCargadas || errorFuentes) {
      SplashScreen.hideAsync();
    }
  }, [fuentesCargadas, errorFuentes]);

  if (!fuentesCargadas && !errorFuentes) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORES.fondo },
          headerTintColor: COLORES.primario,
          headerTitleStyle: { ...TIPOGRAFIA.titulo3, color: COLORES.texto },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: COLORES.fondo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lugar/[id]" options={{ title: 'Detalle', headerBackTitle: 'Volver' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
