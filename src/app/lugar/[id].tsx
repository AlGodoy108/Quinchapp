import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Estrellas } from '@/componentes/Estrellas';
import { Icono } from '@/componentes/Icono';
import { obtenerCategoria } from '@/constantes/categorias';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
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
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: lugar.nombre }} />
      <View style={estilos.portada}>
        {categoria && <ContenedorIcono nombre={categoria.icono} tamano={96} redondo />}
      </View>
      <View style={estilos.tarjeta}>
        {categoria && <Text style={estilos.categoria}>{categoria.nombre}</Text>}
        <Text style={estilos.nombre}>{lugar.nombre}</Text>
        <Estrellas valor={lugar.estrellas} />
        <View style={estilos.dato}>
          <Icono nombre="horario" tamano={ICONO.pequeno + 2} color={COLORES.textoSecundario} />
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
  contenido: {
    gap: ESPACIOS.l,
    padding: ESPACIOS.l,
  },
  noEncontrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
  portada: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIOS.tarjeta,
    backgroundColor: COLORES.superficie,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
  },
  tarjeta: {
    gap: ESPACIOS.s,
    padding: ESPACIOS.l,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  categoria: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.primario,
  },
  nombre: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.texto,
  },
});
