import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Buscador } from '@/componentes/Buscador';
import { CirculoCategoria } from '@/componentes/CirculoCategoria';
import { EncabezadoSeccion } from '@/componentes/EncabezadoSeccion';
import { Icono } from '@/componentes/Icono';
import { TarjetaLugar } from '@/componentes/TarjetaLugar';
import { CATEGORIAS } from '@/constantes/categorias';
import { COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { obtenerLugaresDestacados } from '@/servicios/lugares';

export default function PantallaInicio() {
  const margenes = useSafeAreaInsets();

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={[estilos.contenido, { paddingTop: margenes.top + ESPACIOS.m }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[estilos.bloque, estilos.encabezado]}>
        <Image
          source={require('../../../assets/imagenes/logo-municipalidad-horizontal.png')}
          style={estilos.logo}
          resizeMode="contain"
          accessibilityLabel="Logo de la Municipalidad de Quinchao"
        />
        <View style={estilos.textosEncabezado}>
          <Text style={estilos.subtitulo}>Mi Comuna</Text>
          <Text style={estilos.titulo}>Quinchao</Text>
        </View>
      </View>

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
          <Text style={estilos.etiquetaBanner}>Cerca de ti</Text>
          <Text style={estilos.tituloBanner}>¿A dónde ir en Quinchao?</Text>
          <View style={estilos.botonBanner}>
            <Text style={estilos.textoBotonBanner}>Ver el mapa</Text>
            <Icono
              nombre="flechaDerecha"
              tamano={ICONO.pequeno + 2}
              color={COLORES.sobreSecundario}
            />
          </View>
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
    paddingBottom: ESPACIOS.xxl,
  },
  bloque: {
    paddingHorizontal: ESPACIOS.xxl,
    marginBottom: ESPACIOS.xl,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ESPACIOS.m,
  },
  logo: {
    // Proporción del logo horizontal (600 × 197)
    width: 158,
    height: 52,
  },
  textosEncabezado: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  subtitulo: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'right',
  },
  titulo: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.primario,
    textAlign: 'right',
  },
  banner: {
    gap: ESPACIOS.s,
    padding: ESPACIOS.xl,
    borderRadius: RADIOS.tarjeta,
    backgroundColor: COLORES.primario,
  },
  etiquetaBanner: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.sobrePrimario,
  },
  tituloBanner: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.sobrePrimario,
  },
  botonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ESPACIOS.s,
    marginTop: ESPACIOS.s,
    paddingHorizontal: ESPACIOS.l,
    paddingVertical: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    backgroundColor: COLORES.secundario,
  },
  textoBotonBanner: {
    ...TIPOGRAFIA.boton,
    color: COLORES.sobreSecundario,
  },
  separacion: {
    marginBottom: ESPACIOS.xxl,
  },
  carrusel: {
    gap: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.l,
  },
  carruselTarjetas: {
    gap: ESPACIOS.m,
    paddingHorizontal: ESPACIOS.xxl,
  },
});
