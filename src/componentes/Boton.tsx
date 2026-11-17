import { Pressable, StyleSheet, Text } from 'react-native';

import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  texto: string;
  alPresionar: () => void;
  icono?: NombreIcono;
  // 'secundario' es el botón blanco con borde (Llamar, WhatsApp en el Figma)
  variante?: 'primario' | 'secundario';
  deshabilitado?: boolean;
};

// Botón con la forma de los botones del Figma
export function Boton({
  texto,
  alPresionar,
  icono,
  variante = 'primario',
  deshabilitado = false,
}: Props) {
  const esSecundario = variante === 'secundario';
  const colorContenido = deshabilitado
    ? COLORES.textoSecundario
    : esSecundario
      ? COLORES.texto
      : COLORES.sobrePrimario;

  return (
    <Pressable
      style={({ pressed }) => [
        estilos.boton,
        esSecundario && estilos.secundario,
        deshabilitado && (esSecundario ? estilos.secundarioDeshabilitado : estilos.deshabilitado),
        pressed && !deshabilitado && estilos.presionado,
      ]}
      onPress={alPresionar}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
    >
      {icono && <Icono nombre={icono} tamano={ICONO.pequeno + 2} color={colorContenido} />}
      <Text style={[estilos.texto, { color: colorContenido }]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIOS.s,
    minHeight: 48,
    paddingHorizontal: ESPACIOS.xxl,
    paddingVertical: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    backgroundColor: COLORES.primario,
  },
  secundario: {
    paddingHorizontal: ESPACIOS.l,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  deshabilitado: {
    backgroundColor: COLORES.borde,
  },
  secundarioDeshabilitado: {
    backgroundColor: COLORES.fondo,
  },
  presionado: {
    opacity: 0.85,
  },
  texto: {
    ...TIPOGRAFIA.boton,
  },
});
