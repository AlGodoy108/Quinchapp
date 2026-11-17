import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EstadoVacio } from '@/componentes/EstadoVacio';
import { FiltroCategorias } from '@/componentes/FiltroCategorias';
import { Icono } from '@/componentes/Icono';
import { MapaLugares } from '@/componentes/MapaLugares';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { obtenerLugares } from '@/servicios/lugares';
import type { IdCategoria } from '@/tipos/lugar';
import { tieneUbicacion } from '@/utilidades/datosLugar';

export default function PantallaMapa() {
  const margenes = useSafeAreaInsets();
  const [categoria, setCategoria] = useState<IdCategoria | null>(null);

  const lugares = obtenerLugares({ categoriaId: categoria ?? undefined });
  const cantidadSinUbicacion = lugares.filter((lugar) => !tieneUbicacion(lugar)).length;
  // En web el mapa se reemplaza por una lista, que sí muestra los lugares sin ubicación
  const esMapaReal = Platform.OS !== 'web';
  const mapaVacio = esMapaReal && lugares.length === cantidadSinUbicacion;

  return (
    <View style={estilos.pantalla}>
      <MapaLugares
        lugares={lugares}
        alAbrirLugar={(lugar) => router.push({ pathname: '/lugar/[id]', params: { id: lugar.id } })}
      />
      <View style={[estilos.filtro, { top: margenes.top + ESPACIOS.s }]}>
        <FiltroCategorias seleccionada={categoria} alSeleccionar={setCategoria} />
      </View>

      {mapaVacio && (
        <View style={estilos.capaVacia} pointerEvents="box-none">
          <View style={estilos.tarjetaVacia}>
            <EstadoVacio
              compacto
              titulo="No hay lugares para mostrar aquí"
              descripcion={
                lugares.length === 0
                  ? 'Todavía no hay lugares registrados en esta categoría.'
                  : 'Los lugares de esta categoría aún no tienen ubicación confirmada.'
              }
              textoBoton={lugares.length > 0 ? 'Verlos en la lista' : undefined}
              alPresionarBoton={() =>
                router.navigate({
                  pathname: '/lugares',
                  params: { categoria: categoria ?? '', busqueda: '' },
                })
              }
            />
          </View>
        </View>
      )}

      {esMapaReal && !mapaVacio && cantidadSinUbicacion > 0 && (
        <View style={estilos.aviso}>
          <Icono nombre="sinUbicacion" tamano={ICONO.pequeno} color={COLORES.textoSecundario} />
          <Text style={estilos.textoAviso}>
            {cantidadSinUbicacion === 1
              ? '1 lugar aún no tiene ubicación y no aparece en el mapa.'
              : `${cantidadSinUbicacion} lugares aún no tienen ubicación y no aparecen en el mapa.`}
          </Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  filtro: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  capaVacia: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIOS.xxl,
  },
  tarjetaVacia: {
    width: '100%',
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  aviso: {
    position: 'absolute',
    bottom: ESPACIOS.l,
    left: ESPACIOS.l,
    right: ESPACIOS.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
    padding: ESPACIOS.m,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  textoAviso: {
    ...TIPOGRAFIA.pequeno,
    flex: 1,
    color: COLORES.textoSecundario,
  },
});
