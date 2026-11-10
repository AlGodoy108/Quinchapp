import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/componentes/Boton';
import { BORDES, COLORES, ESPACIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';

// Barra superior del panel: logo (vuelve al inicio del panel), admin conectado y cerrar sesión
export function BarraAdmin() {
  const { admin, salir } = useSesionAdmin();
  const [saliendo, setSaliendo] = useState(false);

  async function cerrarSesion() {
    setSaliendo(true);
    await salir();
  }

  return (
    <View style={estilos.barra}>
      <Link href="/admin" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Ir al inicio del panel">
          <Image
            source={require('../../assets/Base/LOGO ORIGINAL HORIZONTAL TRANSPARENCIA.png')}
            style={estilos.logo}
            resizeMode="contain"
          />
        </Pressable>
      </Link>
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
  );
}

const estilos = StyleSheet.create({
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
});
