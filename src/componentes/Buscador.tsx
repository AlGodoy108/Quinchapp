import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  alBuscar: (texto: string) => void;
};

export function Buscador({ alBuscar }: Props) {
  const [texto, setTexto] = useState('');

  return (
    <View style={estilos.contenedor}>
      <Icono nombre="buscar" tamano={ICONO.normal - 2} color={COLORES.textoSecundario} />
      <TextInput
        style={estilos.campo}
        value={texto}
        onChangeText={setTexto}
        onSubmitEditing={() => alBuscar(texto.trim())}
        placeholder="Buscar categoría o lugar"
        placeholderTextColor={COLORES.textoSecundario}
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
});
