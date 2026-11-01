import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { COLORES } from '@/constantes/colores';

type Props = {
  alBuscar: (texto: string) => void;
};

export function Buscador({ alBuscar }: Props) {
  const [texto, setTexto] = useState('');

  return (
    <View style={estilos.contenedor}>
      <Icono nombre="buscar" tamano={20} color={COLORES.textoSuave} />
      <TextInput
        style={estilos.campo}
        value={texto}
        onChangeText={setTexto}
        onSubmitEditing={() => alBuscar(texto.trim())}
        placeholder="Buscar categoría o lugar"
        placeholderTextColor={COLORES.textoSuave}
        returnKeyType="search"
        accessibilityLabel="Buscar por categoría o nombre"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  campo: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORES.texto,
  },
});
