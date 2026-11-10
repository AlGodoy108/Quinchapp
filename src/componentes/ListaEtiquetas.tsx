import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icono } from '@/componentes/Icono';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  etiqueta: string;
  valores: string[];
  alCambiar: (valores: string[]) => void;
  placeholder?: string;
};

// Campo para armar una lista: se escribe un elemento, Enter lo agrega y la X lo quita.
// Si se pegan varios separados por ";" (como en el Excel), se agregan todos.
export function ListaEtiquetas({ etiqueta, valores, alCambiar, placeholder }: Props) {
  const [texto, setTexto] = useState('');

  function agregar() {
    const nuevos = texto
      .split(';')
      .map((parte) => parte.trim())
      .filter((parte) => parte && !valores.includes(parte));
    if (nuevos.length > 0) {
      alCambiar([...valores, ...nuevos]);
    }
    setTexto('');
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <View style={estilos.fila}>
        <TextInput
          style={estilos.campo}
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={agregar}
          placeholder={placeholder}
          placeholderTextColor={COLORES.textoSecundario}
          accessibilityLabel={etiqueta}
          // Sin esto, Enter en la web saca el foco del campo
          submitBehavior="submit"
        />
        <Pressable
          onPress={agregar}
          style={({ pressed }) => [estilos.agregar, pressed && estilos.presionado]}
          accessibilityRole="button"
          accessibilityLabel="Agregar a la lista"
        >
          <Icono nombre="mas" tamano={ICONO.pequeno + 2} color={COLORES.sobrePrimario} />
          <Text style={estilos.textoAgregar}>Agregar</Text>
        </Pressable>
      </View>
      {valores.length > 0 ? (
        <View style={estilos.etiquetas}>
          {valores.map((valor) => (
            <View key={valor} style={estilos.chip}>
              <Text style={estilos.textoChip}>{valor}</Text>
              <Pressable
                onPress={() => alCambiar(valores.filter((v) => v !== valor))}
                accessibilityRole="button"
                accessibilityLabel={`Quitar ${valor}`}
                hitSlop={8}
              >
                <Icono nombre="cerrar" tamano={ICONO.pequeno} color={COLORES.textoSecundario} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={estilos.vacia}>Todavía no hay elementos en la lista.</Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: ESPACIOS.s,
  },
  etiqueta: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  fila: {
    flexDirection: 'row',
    gap: ESPACIOS.s,
  },
  campo: {
    ...TIPOGRAFIA.cuerpo,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    color: COLORES.texto,
  },
  agregar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.l,
    borderRadius: RADIOS.boton,
    backgroundColor: COLORES.primario,
  },
  presionado: {
    opacity: 0.85,
  },
  textoAgregar: {
    ...TIPOGRAFIA.boton,
    color: COLORES.sobrePrimario,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.s,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
    paddingLeft: ESPACIOS.m,
    paddingRight: ESPACIOS.s,
    paddingVertical: ESPACIOS.xs,
    borderRadius: RADIOS.chip,
    backgroundColor: COLORES.primarioSuave,
  },
  textoChip: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.primario,
  },
  vacia: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
});
