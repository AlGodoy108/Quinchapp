import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  ayuda?: string;
  // Si hay error se muestra en rojo en lugar de la ayuda
  error?: string;
  opcional?: boolean;
};

// Campo de texto con su etiqueta arriba y un texto de ayuda opcional abajo
export function CampoFormulario({
  etiqueta,
  valor,
  alCambiar,
  ayuda,
  error,
  opcional = false,
  multiline,
  ...props
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>
        {etiqueta}
        {opcional ? <Text style={estilos.opcional}> (opcional)</Text> : null}
      </Text>
      <TextInput
        style={[estilos.campo, multiline && estilos.multilinea, error ? estilos.campoError : null]}
        value={valor}
        onChangeText={alCambiar}
        placeholderTextColor={COLORES.textoSecundario}
        accessibilityLabel={etiqueta}
        aria-invalid={Boolean(error)}
        multiline={multiline}
        {...props}
      />
      {error ? (
        <Text style={estilos.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : ayuda ? (
        <Text style={estilos.ayuda}>{ayuda}</Text>
      ) : null}
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
  opcional: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
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
  multilinea: {
    minHeight: 120,
    paddingVertical: ESPACIOS.m,
    textAlignVertical: 'top',
  },
  campoError: {
    borderColor: COLORES.emergencia,
  },
  ayuda: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
  error: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.emergencia,
  },
});
