import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { EstadoVacio } from '@/componentes/EstadoVacio';
import { Estrellas } from '@/componentes/Estrellas';
import { Icono } from '@/componentes/Icono';
import { ImagenLugar } from '@/componentes/ImagenLugar';
import { MapaLugar } from '@/componentes/MapaLugar';
import { TarjetaContacto } from '@/componentes/TarjetaContacto';
import { obtenerCategoria } from '@/constantes/categorias';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { obtenerLugarPorId } from '@/servicios/lugares';
import { TEXTOS_PENDIENTES, textoONada, tieneUbicacion } from '@/utilidades/datosLugar';

export default function PantallaDetalleLugar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lugar = obtenerLugarPorId(id);

  if (!lugar) {
    return (
      <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.centrado}>
        <Stack.Screen options={{ title: 'Lugar no encontrado' }} />
        <EstadoVacio
          titulo="No encontramos este lugar"
          descripcion="Puede que se haya eliminado o que el enlace no sea correcto."
          textoBoton="Ver todos los lugares"
          alPresionarBoton={() =>
            router.replace({ pathname: '/lugares', params: { categoria: '', busqueda: '' } })
          }
        />
      </ScrollView>
    );
  }

  const categoria = obtenerCategoria(lugar.categoriaId);
  const descripcion = textoONada(lugar.descripcion);
  const horario = textoONada(lugar.horario);
  const direccion = textoONada(lugar.direccion);
  const precio = textoONada(lugar.precio);
  const capacidad = textoONada(lugar.capacidad);
  const servicios = (lugar.servicios ?? []).filter((servicio) => textoONada(servicio));
  const conUbicacion = tieneUbicacion(lugar);
  const ubicacionSinConfirmar = conUbicacion && lugar.ubicacionConfirmada === false;

  const abrirComoLlegar = () => {
    if (!tieneUbicacion(lugar)) {
      return;
    }
    const { latitude, longitude } = lugar.coordenadas;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    ).catch(() => {});
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: lugar.nombre }} />

      {/* 1. Información del lugar */}
      <View style={estilos.tarjeta}>
        {categoria && (
          <Text style={estilos.categoria}>
            {[categoria.nombre, lugar.subcategoria].filter(Boolean).join(' · ')}
          </Text>
        )}
        <Text style={estilos.nombre}>{lugar.nombre}</Text>
        <Estrellas valor={lugar.estrellas} />

        <Dato icono="horario" texto={horario} pendiente={TEXTOS_PENDIENTES.horario} />
        <Dato icono="precio" texto={precio} pendiente={TEXTOS_PENDIENTES.precio} />
        <Dato
          icono={conUbicacion ? 'ubicacion' : 'sinUbicacion'}
          texto={direccion}
          pendiente={conUbicacion ? TEXTOS_PENDIENTES.direccion : TEXTOS_PENDIENTES.sinUbicacion}
        />
      </View>

      {/* 2. Mapa con el punto del lugar */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Ubicación</Text>
        <MapaLugar
          coordenadas={conUbicacion ? lugar.coordenadas : undefined}
          aproximada={ubicacionSinConfirmar}
          colorPunto={categoria?.colorMapa}
          nombre={lugar.nombre}
          alPresionar={abrirComoLlegar}
        />
        {ubicacionSinConfirmar && (
          <View style={estilos.aviso}>
            <Icono nombre="aviso" tamano={ICONO.pequeno} color={COLORES.sobreSecundario} />
            <Text style={estilos.textoAviso}>
              {TEXTOS_PENDIENTES.ubicacion}: el punto en el mapa es aproximado.
            </Text>
          </View>
        )}
        <Boton
          texto={conUbicacion ? 'Cómo llegar' : 'Ubicación no disponible'}
          icono={conUbicacion ? 'ubicacion' : 'sinUbicacion'}
          deshabilitado={!conUbicacion}
          alPresionar={abrirComoLlegar}
        />
      </View>

      {/* 3. Imágenes */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Fotos</Text>
        <ImagenLugar foto={lugar.foto} nombreLugar={lugar.nombre} />
      </View>

      {/* 4. Información general */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Información general</Text>
        <View style={estilos.tarjeta}>
          <Text style={descripcion ? estilos.descripcion : estilos.textoPendiente}>
            {descripcion ?? TEXTOS_PENDIENTES.descripcion}
          </Text>
          {capacidad && <Dato icono="capacidad" texto={capacidad} pendiente="" />}
          {servicios.length > 0 && (
            <Dato icono="servicios" texto={servicios.join(' · ')} pendiente="" />
          )}
        </View>
        <TarjetaContacto contacto={lugar.contacto} />
      </View>
    </ScrollView>
  );
}

// Fila con ícono: muestra el dato o, si falta, el texto "por confirmar" en gris
function Dato({
  icono,
  texto,
  pendiente,
}: {
  icono: NombreIcono;
  texto: string | undefined;
  pendiente: string;
}) {
  return (
    <View style={estilos.dato}>
      <Icono nombre={icono} tamano={ICONO.pequeno + 2} color={COLORES.textoSecundario} />
      <Text style={texto ? estilos.descripcion : estilos.textoPendiente}>{texto ?? pendiente}</Text>
    </View>
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
    paddingBottom: ESPACIOS.xxl,
  },
  seccion: {
    gap: ESPACIOS.s,
  },
  tituloSeccion: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
  },
  centrado: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: ESPACIOS.l,
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
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
    padding: ESPACIOS.s,
    borderRadius: RADIOS.chip,
    backgroundColor: COLORES.secundarioSuave,
  },
  textoAviso: {
    ...TIPOGRAFIA.pequeno,
    flex: 1,
    color: COLORES.sobreSecundario,
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    flexShrink: 1,
    color: COLORES.texto,
  },
  textoPendiente: {
    ...TIPOGRAFIA.cuerpo,
    flexShrink: 1,
    color: COLORES.textoSecundario,
  },
});
