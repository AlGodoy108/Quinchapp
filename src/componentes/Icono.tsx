import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { ICONOS, type NombreIcono } from '@/constantes/iconos';

type Props = {
  nombre: NombreIcono;
  tamano?: number;
  color: ColorValue;
};

export function Icono({ nombre, tamano = 24, color }: Props) {
  return <SymbolView name={ICONOS[nombre]} size={tamano} tintColor={color} />;
}
