import { useEffect } from 'react';
import { Platform } from 'react-native';

// Pone el título de la pestaña del navegador. En el celular no hace nada.
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = titulo;
    }
  }, [titulo]);
}
