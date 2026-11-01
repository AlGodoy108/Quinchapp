import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Buscador } from '@/componentes/Buscador';
import { CirculoCategoria } from '@/componentes/CirculoCategoria';
import { EncabezadoSeccion } from '@/componentes/EncabezadoSeccion';
import { Icono } from '@/componentes/Icono';
import { TarjetaLugar } from '@/componentes/TarjetaLugar';
import { CATEGORIAS } from '@/constantes/categorias';
import { COLORES } from '@/constantes/colores';
import { obtenerLugaresDestacados } from '@/servicios/lugares';

export default function PantallaInicio() {
  const margenes = useSafeAreaInsets();

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={[estilos.contenido, { paddingTop: margenes.top + 16 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={estilos.bloque}>
        <Buscador
          alBuscar={(busqueda) =>
            router.navigate({ pathname: '/lugares', params: { busqueda, categoria: '' } })
          }
        />
      </View>

      <View style={estilos.bloque}>
        <Pressable
          style={estilos.banner}
          onPress={() => router.navigate('/mapa')}
          accessibilityRole="button"
        >
          <View style={estilos.textoBanner}>
            <Text style={estilos.tituloBanner}>¿A dónde ir en Quinchao?</Text>
            <Text style={estilos.detalleBanner}>Mira todas las opciones en el mapa</Text>
          </View>
          <Icono nombre="mapa" tamano={32} color="#FFFFFF" />
        </Pressable>
      </View>

      <EncabezadoSeccion
        titulo="Categorías"
        textoAccion="Ver todas"
        alPresionarAccion={() => router.navigate('/categorias')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.carrusel}
        style={estilos.separacion}
      >
        {CATEGORIAS.map((categoria) => (
          <CirculoCategoria
            key={categoria.id}
            categoria={categoria}
            alPresionar={() =>
              router.navigate({
                pathname: '/lugares',
                params: { categoria: categoria.id, busqueda: '' },
              })
            }
          />
        ))}
      </ScrollView>

      <EncabezadoSeccion
        titulo="Destacados"
        textoAccion="Ver más"
        alPresionarAccion={() =>
          router.navigate({ pathname: '/lugares', params: { categoria: '', busqueda: '' } })
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.carruselTarjetas}
      >
        {obtenerLugaresDestacados().map((lugar) => (
          <TarjetaLugar
            key={lugar.id}
            lugar={lugar}
            alPresionar={() => router.push({ pathname: '/lugar/[id]', params: { id: lugar.id } })}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    paddingBottom: 24,
  },
  bloque: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 14,
    backgroundColor: COLORES.primario,
  },
  textoBanner: {
    flex: 1,
    gap: 4,
  },
  tituloBanner: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detalleBanner: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  separacion: {
    marginBottom: 24,
  },
  carrusel: {
    gap: 4,
    paddingHorizontal: 12,
  },
  carruselTarjetas: {
    gap: 12,
    paddingHorizontal: 16,
  },
});
