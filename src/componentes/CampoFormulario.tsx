import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  ayuda?: string;
};

// Campo de texto con su etiqueta arriba y un texto de ayuda opcional abajo
export function CampoFormulario({ etiqueta, valor, alCambiar, ayuda, ...props }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={estilos.campo}
        value={valor}
        onChangeText={alCambiar}
        placeholderTextColor={COLORES.textoSecundario}
        accessibilityLabel={etiqueta}
        {...props}
      />
      {ayuda ? <Text style={estilos.ayuda}>{ayuda}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: ESPACIOS.xs,
  },
  etiqueta: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  campo: {
    ...TIPOGRAFIA.cuerpo,
    minHeight: 48,
    paddingHorizontal: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    color: COLORES.texto,
  },
  ayuda: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
