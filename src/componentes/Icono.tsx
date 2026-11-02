import type { ColorValue } from 'react-native';

import { ICONOS, type NombreIcono } from '@/constantes/iconos';
import { COLORES, ICONO } from '@/constantes/tema';

type Props = {
  nombre: NombreIcono;
  tamano?: number;
  color?: ColorValue;
  relleno?: ColorValue;
};

export function Icono({
  nombre,
  tamano = ICONO.normal,
  color = COLORES.iconoTrazo,
  relleno = 'none',
}: Props) {
  const Componente = ICONOS[nombre];
  return (
    <Componente
      size={tamano}
      color={color as string}
      fill={relleno as string}
      strokeWidth={ICONO.trazo}
    />
  );
}
