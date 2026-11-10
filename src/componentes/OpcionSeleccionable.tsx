import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  texto: string;
  seleccionada: boolean;
  alPresionar: () => void;
  icono?: NombreIcono;
  descripcion?: string;
  // chip: pequeña y en línea (sugerencias); tarjeta: grande, para elegir una opción principal
  forma?: 'chip' | 'tarjeta';
};

// Opción que se marca al presionarla (categorías, sugerencias, estado de verificación)
export function OpcionSeleccionable({
  texto,
  seleccionada,
  alPresionar,
  icono,
  descripcion,
  forma = 'chip',
}: Props) {
  const tarjeta = forma === 'tarjeta';
  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole={tarjeta ? 'radio' : 'button'}
      accessibilityState={{ selected: seleccionada, checked: seleccionada }}
      style={({ pressed }) => [
        tarjeta ? estilos.tarjeta : estilos.chip,
        seleccionada && estilos.seleccionada,
        pressed && estilos.presionada,
      ]}
    >
      {icono ? <ContenedorIcono nombre={icono} tamano={tarjeta ? ICONO.contenedor : 28} /> : null}
      <View style={estilos.textos}>
        <Text
          style={[
            tarjeta ? estilos.textoTarjeta : estilos.textoChip,
            seleccionada && estilos.textoSeleccionado,
          ]}
        >
          {texto}
        </Text>
        {descripcion ? <Text style={estilos.descripcion}>{descripcion}</Text> : null}
      </View>
      {seleccionada && tarjeta ? <Icono nombre="listo" tamano={ICONO.pequeno + 4} /> : null}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
    paddingHorizontal: ESPACIOS.m,
    paddingVertical: ESPACIOS.s,
    borderRadius: RADIOS.chip,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  tarjeta: {
    flexGrow: 1,
    flexBasis: 220,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.m,
    padding: ESPACIOS.m,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  seleccionada: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioSuave,
  },
  presionada: {
    opacity: 0.85,
  },
  textos: {
    flexShrink: 1,
    flexGrow: 1,
    gap: 2,
  },
  textoChip: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.texto,
  },
  textoTarjeta: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  textoSeleccionado: {
    color: COLORES.primario,
  },
  descripcion: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
