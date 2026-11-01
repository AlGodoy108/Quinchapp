import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LayoutRaiz() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lugar/[id]" options={{ title: 'Detalle', headerBackTitle: 'Volver' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
