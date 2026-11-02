import { StyleSheet, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { COLORES, ICONO, RADIOS } from '@/constantes/tema';

type Props = {
  nombre: NombreIcono;
  tamano?: number;
  redondo?: boolean;
};

// Ícono azul sobre el cuadrado celeste, como en las tarjetas del Figma
export function ContenedorIcono({ nombre, tamano = ICONO.contenedor, redondo = false }: Props) {
  return (
    <View
      style={[
        estilos.contenedor,
        { width: tamano, height: tamano },
        redondo && { borderRadius: tamano / 2 },
      ]}
    >
      <Icono nombre={nombre} tamano={Math.round(tamano * 0.5)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIOS.icono,
    backgroundColor: COLORES.iconoFondo,
  },
});
