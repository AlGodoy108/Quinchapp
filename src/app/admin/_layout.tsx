import { router, Stack } from 'expo-router';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import { ProveedorSesionAdmin, useSesionAdmin } from '@/hooks/useSesionAdmin';

// El panel de administración es solo para el navegador. En el celular se muestra un aviso.
export default function LayoutAdmin() {
  if (Platform.OS !== 'web') {
    return <AvisoSoloWeb />;
  }
  return (
    <ProveedorSesionAdmin>
      <NavegadorAdmin />
    </ProveedorSesionAdmin>
  );
}

// Ocultar pantallas aquí solo cambia lo que se ve: la seguridad real está en las rutas API,
// que revisan la sesión en cada petición.
function NavegadorAdmin() {
  const { admin, errorCarga } = useSesionAdmin();

  if (admin === undefined) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={COLORES.primario} size="large" />
      </View>
    );
  }

  const conSesion = admin !== null;
  return (
    <>
      {errorCarga ? (
        <View style={estilos.errorCarga}>
          <MensajeAviso tipo="error" texto={errorCarga} />
        </View>
      ) : null}
      <Stack screenOptions={{ headerShown: false, contentStyle: estilos.contenido }}>
        <Stack.Protected guard={conSesion} redirectTo="/admin/ingresar">
          <Stack.Screen name="index" />
          <Stack.Screen name="servicios/nuevo" />
          <Stack.Screen name="servicios/importar" />
        </Stack.Protected>
        <Stack.Protected guard={!conSesion} redirectTo="/admin">
          <Stack.Screen name="ingresar" />
          <Stack.Screen name="recuperar" />
        </Stack.Protected>
        {/* Se puede abrir con o sin sesión: llega desde el enlace del correo */}
        <Stack.Screen name="restablecer" />
      </Stack>
    </>
  );
}

function AvisoSoloWeb() {
  return (
    <View style={[estilos.centro, estilos.aviso]}>
      <Stack.Screen options={{ title: 'Administración' }} />
      <Text style={estilos.titulo}>Solo disponible en la web</Text>
      <Text style={estilos.descripcion}>
        El panel de administración se abre desde el navegador de un computador.
      </Text>
      <Boton texto="Volver al inicio" alPresionar={() => router.replace('/')} />
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    backgroundColor: COLORES.fondo,
  },
  errorCarga: {
    padding: ESPACIOS.l,
    backgroundColor: COLORES.fondo,
  },
  aviso: {
    gap: ESPACIOS.l,
    padding: ESPACIOS.xxl,
  },
  titulo: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
    textAlign: 'center',
  },
  descripcion: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
