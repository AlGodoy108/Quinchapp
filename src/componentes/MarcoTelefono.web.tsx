import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { COLORES, MARCO_WEB } from '@/constantes/tema';

// Simula el espacio de la barra de estado para que el contenido no quede pegado al borde
const MARGENES_SIMULADOS = { top: MARCO_WEB.barraEstado, right: 0, bottom: 0, left: 0 };

type Props = {
  children: ReactNode;
};

// En el navegador del computador muestra la app dentro de un marco con el tamaño de un teléfono,
// para revisar el diseño como se vería en el celular. En pantallas angostas se ve normal.
export function MarcoTelefono({ children }: Props) {
  const { width: anchoVentana } = useWindowDimensions();

  if (anchoVentana < MARCO_WEB.anchoMinimoVentana) {
    return children;
  }

  return (
    <View style={estilos.pagina}>
      <View style={estilos.marco}>
        <View style={estilos.pantalla}>
          <SafeAreaInsetsContext.Provider value={MARGENES_SIMULADOS}>
            {children}
          </SafeAreaInsetsContext.Provider>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MARCO_WEB.fondoPagina,
    padding: MARCO_WEB.grosor * 2,
  },
  marco: {
    width: MARCO_WEB.ancho + MARCO_WEB.grosor * 2,
    height: MARCO_WEB.alto + MARCO_WEB.grosor * 2,
    maxHeight: '100%',
    borderRadius: MARCO_WEB.radio,
    borderWidth: MARCO_WEB.grosor,
    borderColor: MARCO_WEB.colorMarco,
    backgroundColor: MARCO_WEB.colorMarco,
    overflow: 'hidden',
  },
  pantalla: {
    flex: 1,
    borderRadius: MARCO_WEB.radio - MARCO_WEB.grosor,
    backgroundColor: COLORES.fondo,
    overflow: 'hidden',
  },
});
