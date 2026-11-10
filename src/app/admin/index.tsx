import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';
import { useTituloPagina } from '@/hooks/useTituloPagina';

type Seccion = {
  titulo: string;
  descripcion: string;
  icono: NombreIcono;
};

// Se irán activando a medida que se construyan
const SECCIONES: Seccion[] = [
  {
    titulo: 'Agregar nuevo servicio',
    descripcion: 'Un asistente que pregunta cada dato del servicio, paso a paso.',
    icono: 'agregar',
  },
  {
    titulo: 'Importar desde Excel',
    descripcion: 'Sube la planilla de oferta turística, revisa la vista previa y confirma.',
    icono: 'planilla',
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
  const { admin, salir } = useSesionAdmin();
  const [saliendo, setSaliendo] = useState(false);
  useTituloPagina('Panel · Quinchapp');

  async function cerrarSesion() {
    setSaliendo(true);
    await salir();
  }

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.barra}>
        <Image
          source={require('../../../assets/Base/LOGO ORIGINAL HORIZONTAL TRANSPARENCIA.png')}
          style={estilos.logo}
          resizeMode="contain"
          accessibilityLabel="Municipalidad de Quinchao"
        />
        <View style={estilos.usuario}>
          <View>
            <Text style={estilos.nombre}>{admin?.nombre}</Text>
            <Text style={estilos.correo}>{admin?.correo}</Text>
          </View>
          <Boton
            texto={saliendo ? 'Cerrando…' : 'Cerrar sesión'}
            alPresionar={cerrarSesion}
            variante="secundario"
            desactivado={saliendo}
          />
        </View>
      </View>

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
        {SECCIONES.map((seccion) => (
          <View key={seccion.titulo} style={estilos.tarjeta}>
            <View style={estilos.icono}>
              <Icono nombre={seccion.icono} />
            </View>
            <Text style={estilos.tituloTarjeta}>{seccion.titulo}</Text>
            <Text style={estilos.descripcion}>{seccion.descripcion}</Text>
            <Text style={estilos.pronto}>Próximamente</Text>
          </View>
        ))}
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
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    gap: ESPACIOS.xxl,
    padding: ESPACIOS.l,
  },
  barra: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ESPACIOS.l,
    paddingBottom: ESPACIOS.l,
    borderBottomWidth: BORDES.tarjeta,
    borderBottomColor: COLORES.borde,
  },
  logo: {
    width: 180,
    height: 60,
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.l,
  },
  nombre: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  correo: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
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
  tarjeta: {
    flexGrow: 1,
    flexBasis: 240,
    gap: ESPACIOS.s,
    padding: ESPACIOS.xl,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  icono: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: RADIOS.icono,
    backgroundColor: COLORES.iconoFondo,
  },
  tituloTarjeta: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
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
