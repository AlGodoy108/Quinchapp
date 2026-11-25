import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

const TEXTO_GUIA = 'Buscar categoría o lugar';

type Props =
  | {
      // Modo botón: se ve igual que el buscador pero solo abre la pantalla de búsqueda
      alPresionar: () => void;
      valor?: never;
      alCambiar?: never;
      autoFoco?: never;
    }
  | {
      alPresionar?: never;
      valor: string;
      alCambiar: (texto: string) => void;
      // Abre el teclado apenas aparece la pantalla
      autoFoco?: boolean;
    };

export function Buscador(props: Props) {
  if (props.alPresionar) {
    return (
      <Pressable
        style={estilos.contenedor}
        onPress={props.alPresionar}
        accessibilityRole="search"
        accessibilityLabel="Buscar por categoría o nombre"
      >
        <Icono nombre="buscar" tamano={ICONO.normal - 2} color={COLORES.textoSecundario} />
        <Text style={[estilos.campo, estilos.guia]}>{TEXTO_GUIA}</Text>
      </Pressable>
    );
  }

  const { valor, alCambiar, autoFoco } = props;

  return (
    <View style={estilos.contenedor}>
      <Icono nombre="buscar" tamano={ICONO.normal - 2} color={COLORES.textoSecundario} />
      <TextInput
        style={estilos.campo}
        value={valor}
        onChangeText={alCambiar}
        autoFocus={autoFoco}
        placeholder={TEXTO_GUIA}
        placeholderTextColor={COLORES.textoSecundario}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Buscar por categoría o nombre"
      />
      {valor.length > 0 && (
        <Pressable
          onPress={() => alCambiar('')}
          hitSlop={ESPACIOS.s}
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda"
        >
          <Icono nombre="cerrar" tamano={ICONO.pequeno + 2} color={COLORES.textoSecundario} />
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
    paddingHorizontal: ESPACIOS.m,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  campo: {
    ...TIPOGRAFIA.cuerpo,
    flex: 1,
    paddingVertical: ESPACIOS.m,
    color: COLORES.texto,
  },
  guia: {
    color: COLORES.textoSecundario,
  },
});
