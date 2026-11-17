import { Image, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { IMAGEN_SIN_DATOS, PROPORCION_IMAGEN_SIN_DATOS } from '@/constantes/imagenes';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';

type Props = {
  titulo: string;
  descripcion?: string;
  textoBoton?: string;
  alPresionarBoton?: () => void;
  // Versión más chica para usar dentro de una sección (ej. el carrusel de destacados)
  compacto?: boolean;
};

// Pudú triste + mensaje. Se usa en listas vacías y cuando no hay información que mostrar.
export function EstadoVacio({
  titulo,
  descripcion,
  textoBoton,
  alPresionarBoton,
  compacto = false,
}: Props) {
  const altoImagen = compacto ? 110 : 180;

  return (
    <View style={[estilos.contenedor, compacto && estilos.compacto]}>
      <Image
        source={IMAGEN_SIN_DATOS}
        style={{ height: altoImagen, width: altoImagen * PROPORCION_IMAGEN_SIN_DATOS }}
        resizeMode="contain"
        accessibilityLabel="Pudú triste sentado"
      />
      <View style={estilos.textos}>
        <Text style={compacto ? estilos.tituloCompacto : estilos.titulo}>{titulo}</Text>
        {descripcion && <Text style={estilos.descripcion}>{descripcion}</Text>}
      </View>
      {textoBoton && alPresionarBoton && (
        <Boton texto={textoBoton} alPresionar={alPresionarBoton} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: ESPACIOS.l,
    paddingVertical: ESPACIOS.xxl,
    paddingHorizontal: ESPACIOS.l,
  },
  compacto: {
    gap: ESPACIOS.s,
    paddingVertical: ESPACIOS.m,
  },
  textos: {
    alignItems: 'center',
    gap: ESPACIOS.xs,
  },
  titulo: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
    textAlign: 'center',
  },
  tituloCompacto: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
    textAlign: 'center',
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
