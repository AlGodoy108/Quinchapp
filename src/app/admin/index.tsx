import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BarraAdmin } from '@/componentes/BarraAdmin';
import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';
import { useTituloPagina } from '@/hooks/useTituloPagina';

type Seccion = {
  titulo: string;
  descripcion: string;
  icono: NombreIcono;
  // Sin ruta: la sección todavía no está lista
  ruta?: Href;
};

const SECCIONES: Seccion[] = [
  {
    titulo: 'Agregar nuevo servicio',
    descripcion: 'Un asistente que pregunta cada dato del servicio, paso a paso.',
    icono: 'agregar',
    ruta: '/admin/servicios/nuevo',
  },
  {
    titulo: 'Importar desde Excel',
    descripcion: 'Sube el Excel de oferta turística, revisa la vista previa y confirma.',
    icono: 'planilla',
    ruta: '/admin/servicios/importar',
  },
  {
    titulo: 'Servicios y clientes',
    descripcion: 'Busca, edita o elimina los servicios cargados, por categoría.',
    icono: 'lugares',
  },
  {
    titulo: 'Imágenes',
    descripcion: 'Sube y ordena las fotos de cada servicio.',
    icono: 'imagen',
  },
];

export default function PantallaPanelAdmin() {
  const { admin } = useSesionAdmin();
  useTituloPagina('Panel · Quinchapp');

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <BarraAdmin />

      <View style={estilos.textos}>
        <Text style={estilos.etiqueta}>Panel de administración</Text>
        <Text style={estilos.titulo} accessibilityRole="header">
          Hola, {admin?.nombre.split(' ')[0]}
        </Text>
        <Text style={estilos.descripcion}>
          Desde aquí se cargan los servicios turísticos que verá la app.
        </Text>
      </View>

      <View style={estilos.grilla}>
        {SECCIONES.map((seccion) =>
          seccion.ruta ? (
            <Link key={seccion.titulo} href={seccion.ruta} asChild>
              {/* Con asChild, Link solo acepta un objeto de estilo (ni arreglos ni funciones) */}
              <Pressable style={estilos.tarjetaActiva}>
                <ContenidoTarjeta seccion={seccion} />
                <View style={estilos.abrir}>
                  <Text style={estilos.textoAbrir}>Abrir</Text>
                  <Icono nombre="flechaDerecha" tamano={ICONO.pequeno} />
                </View>
              </Pressable>
            </Link>
          ) : (
            <View key={seccion.titulo} style={estilos.tarjeta}>
              <ContenidoTarjeta seccion={seccion} />
              <Text style={estilos.pronto}>Próximamente</Text>
            </View>
          ),
        )}
      </View>
    </ScrollView>
  );
}

function ContenidoTarjeta({ seccion }: { seccion: Seccion }) {
  return (
    <>
      <ContenedorIcono nombre={seccion.icono} />
      <Text style={estilos.tituloTarjeta}>{seccion.titulo}</Text>
      <Text style={estilos.descripcion}>{seccion.descripcion}</Text>
    </>
  );
}

const ESTILO_TARJETA = {
  flexGrow: 1,
  flexBasis: 240,
  gap: ESPACIOS.s,
  padding: ESPACIOS.xl,
  borderRadius: RADIOS.tarjeta,
  borderWidth: BORDES.tarjeta,
  borderColor: COLORES.borde,
  backgroundColor: COLORES.superficie,
} as const;

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    gap: ESPACIOS.xxl,
    padding: ESPACIOS.l,
  },
  textos: {
    gap: ESPACIOS.xs,
  },
  etiqueta: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.primario,
  },
  titulo: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.l,
  },
  tarjeta: ESTILO_TARJETA,
  tarjetaActiva: {
    ...ESTILO_TARJETA,
    borderColor: COLORES.primario,
  },
  tituloTarjeta: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
  },
  abrir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.xs,
    marginTop: ESPACIOS.xs,
  },
  textoAbrir: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.primario,
  },
  pronto: {
    ...TIPOGRAFIA.etiqueta,
    alignSelf: 'flex-start',
    marginTop: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.s,
    paddingVertical: ESPACIOS.xs,
    borderRadius: RADIOS.chip,
    backgroundColor: COLORES.secundarioSuave,
    color: COLORES.sobreSecundario,
  },
});
