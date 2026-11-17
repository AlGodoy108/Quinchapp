import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { Icono } from '@/componentes/Icono';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import type { Contacto } from '@/tipos/lugar';
import { TEXTOS_PENDIENTES, contactoDisponible } from '@/utilidades/datosLugar';

function abrir(enlace: string | undefined) {
  if (enlace) {
    Linking.openURL(enlace).catch(() => {});
  }
}

// "Contacto comercial" del Figma. Si falta el dato, los botones quedan deshabilitados
// y se avisa que el contacto está pendiente de confirmar.
export function TarjetaContacto({ contacto }: { contacto?: Contacto }) {
  const datos = contactoDisponible(contacto);

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.encabezado}>
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>Contacto comercial</Text>
          {!datos.hayAlguno && <Text style={estilos.pendiente}>{TEXTOS_PENDIENTES.contacto}</Text>}
          {datos.telefono && <Text style={estilos.pendiente}>{datos.telefono}</Text>}
        </View>
        {!datos.hayAlguno && (
          <Icono nombre="informacion" tamano={ICONO.normal} color={COLORES.textoSecundario} />
        )}
      </View>

      <View style={estilos.botones}>
        <View style={estilos.boton}>
          <Boton
            texto="Llamar"
            icono="telefono"
            variante="secundario"
            deshabilitado={!datos.enlaceLlamar}
            alPresionar={() => abrir(datos.enlaceLlamar)}
          />
        </View>
        <View style={estilos.boton}>
          <Boton
            texto="WhatsApp"
            icono="whatsapp"
            variante="secundario"
            deshabilitado={!datos.enlaceWhatsapp}
            alPresionar={() => abrir(datos.enlaceWhatsapp)}
          />
        </View>
      </View>

      {datos.email && (
        <FilaEnlace
          icono="correo"
          texto={datos.email}
          alPresionar={() => abrir(datos.enlaceEmail)}
        />
      )}
      {datos.sitioWeb && (
        <FilaEnlace
          icono="sitioWeb"
          texto={datos.sitioWeb}
          alPresionar={() => abrir(datos.enlaceSitioWeb)}
        />
      )}
    </View>
  );
}

function FilaEnlace({
  icono,
  texto,
  alPresionar,
}: {
  icono: NombreIcono;
  texto: string;
  alPresionar: () => void;
}) {
  return (
    <Pressable style={estilos.filaEnlace} onPress={alPresionar} accessibilityRole="link">
      <Icono nombre={icono} tamano={ICONO.pequeno + 2} />
      <Text style={estilos.textoEnlace} numberOfLines={1}>
        {texto}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: ESPACIOS.m,
    padding: ESPACIOS.l,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.m,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  pendiente: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
  botones: {
    flexDirection: 'row',
    gap: ESPACIOS.m,
  },
  boton: {
    flex: 1,
  },
  filaEnlace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.s,
  },
  textoEnlace: {
    ...TIPOGRAFIA.cuerpo,
    flex: 1,
    color: COLORES.primario,
  },
});
