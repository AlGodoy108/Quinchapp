import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Estrellas } from '@/componentes/Estrellas';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
import { obtenerLugarPorId } from '@/servicios/lugares';

export default function PantallaDetalleLugar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lugar = obtenerLugarPorId(id);

  if (!lugar) {
    return (
      <View style={estilos.noEncontrado}>
        <Text style={estilos.descripcion}>No encontramos este lugar.</Text>
      </View>
    );
  }

  const categoria = obtenerCategoria(lugar.categoriaId);

  return (
    <ScrollView style={estilos.pantalla}>
      <Stack.Screen options={{ title: lugar.nombre }} />
      <View style={[estilos.imagen, { backgroundColor: categoria?.color }]}>
        {categoria && <Icono nombre={categoria.icono} tamano={64} color="#FFFFFF" />}
      </View>
      <View style={estilos.contenido}>
        <Text style={estilos.nombre}>{lugar.nombre}</Text>
        <Text style={estilos.categoria}>{categoria?.nombre}</Text>
        <Estrellas valor={lugar.estrellas} />
        <View style={estilos.dato}>
          <Icono nombre="horario" tamano={18} color={COLORES.textoSuave} />
          <Text style={estilos.descripcion}>{lugar.horario}</Text>
        </View>
        <Text style={estilos.descripcion}>{lugar.descripcion}</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  noEncontrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
  imagen: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    gap: 8,
    padding: 16,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORES.texto,
  },
  categoria: {
    fontSize: 15,
    color: COLORES.textoSuave,
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descripcion: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORES.texto,
  },
});
