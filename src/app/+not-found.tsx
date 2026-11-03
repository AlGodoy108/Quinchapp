import { router, Stack } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';

// Se muestra cuando se abre una ruta que no existe (error 404)
export default function PantallaNoEncontrada() {
  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />

      <View style={estilos.tarjetaImagen}>
        <Image
          source={require('../../assets/Base/Pudu-404.jpg')}
          style={estilos.imagen}
          resizeMode="contain"
          accessibilityLabel="Pudú triste sentado"
        />
      </View>

      <View style={estilos.textos}>
        <Text style={estilos.etiqueta}>Error 404</Text>
        <Text style={estilos.titulo}>¡Ups! Te perdiste</Text>
        <Text style={estilos.descripcion}>
          La página que buscas no existe o cambió de lugar. Vuelve al inicio para seguir
          descubriendo Quinchao.
        </Text>
      </View>

      <Boton texto="Volver al inicio" alPresionar={() => router.replace('/')} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: ESPACIOS.xxl,
    padding: ESPACIOS.xxl,
  },
  tarjetaImagen: {
    overflow: 'hidden',
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  imagen: {
    width: '100%',
    height: 220,
  },
  textos: {
    gap: ESPACIOS.s,
    alignItems: 'center',
  },
  etiqueta: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.primario,
  },
  titulo: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
    textAlign: 'center',
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
