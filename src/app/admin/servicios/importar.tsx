import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BarraAdmin } from '@/componentes/BarraAdmin';
import { Boton } from '@/componentes/Boton';
import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Icono } from '@/componentes/Icono';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { OpcionSeleccionable } from '@/componentes/OpcionSeleccionable';
import { ETIQUETAS_CAMPOS_SERVICIO } from '@/constantes/camposServicio';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';
import { useTituloPagina } from '@/hooks/useTituloPagina';
import { ErrorSesion, importarServicios } from '@/servicios/admin';
import type { EstadoFila, FilaPlanilla, ResultadoFila } from '@/tipos/importacion';
import type { DatosServicio } from '@/tipos/servicio';
import { HOJA_SERVICIOS, leerPlanillaServicios } from '@/utilidades/leerPlanillaServicios';

type Etapa = 'elegir' | 'revisar' | 'listo';
type Filtro = 'todas' | EstadoFila;

const ESTILO_ESTADO: Record<
  EstadoFila,
  { texto: string; icono: NombreIcono; color: string; fondo: string }
> = {
  nueva: {
    texto: 'Lista para importar',
    icono: 'correcto',
    color: COLORES.acento,
    fondo: COLORES.acentoSuave,
  },
  repetida: {
    texto: 'Ya existe',
    icono: 'repetido',
    color: COLORES.sobreSecundario,
    fondo: COLORES.secundarioSuave,
  },
  error: {
    texto: 'Con errores',
    icono: 'alerta',
    color: COLORES.emergencia,
    fondo: COLORES.emergenciaSuave,
  },
};

export default function PantallaImportarServicios() {
  const { sesionVencida } = useSesionAdmin();
  const [etapa, setEtapa] = useState<Etapa>('elegir');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [filas, setFilas] = useState<FilaPlanilla[]>([]);
  const [resultados, setResultados] = useState<ResultadoFila[]>([]);
  const [guardados, setGuardados] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [cargando, setCargando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useTituloPagina('Importar desde Excel · Panel Quinchapp');

  const cuenta = (estado: EstadoFila) => resultados.filter((r) => r.estado === estado).length;
  const nuevas = cuenta('nueva');
  const visibles = filtro === 'todas' ? resultados : resultados.filter((r) => r.estado === filtro);

  // Corre una llamada al servidor mostrando el mensaje de carga y los errores
  async function conCarga(mensaje: string, tarea: () => Promise<void>) {
    setCargando(mensaje);
    setError(null);
    try {
      await tarea();
    } catch (e) {
      if (e instanceof ErrorSesion) {
        sesionVencida();
        return;
      }
      setError((e as Error).message);
    } finally {
      setCargando(null);
    }
  }

  async function elegirArchivo() {
    const eleccion = await DocumentPicker.getDocumentAsync({
      type: ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      multiple: false,
      copyToCacheDirectory: false,
    });
    if (eleccion.canceled) {
      return;
    }
    const archivo = eleccion.assets[0];
    await conCarga('Leyendo la planilla…', async () => {
      const contenido = archivo.file ?? (await (await fetch(archivo.uri)).blob());
      const leidas = await leerPlanillaServicios(contenido);
      const respuesta = await importarServicios(leidas, false);
      setNombreArchivo(archivo.name);
      setFilas(leidas);
      setResultados(respuesta.resultados);
      setFiltro('todas');
      setEtapa('revisar');
    });
  }

  async function confirmar() {
    await conCarga('Importando servicios…', async () => {
      const respuesta = await importarServicios(filas, true);
      setResultados(respuesta.resultados);
      setGuardados(respuesta.guardados);
      setFiltro('todas');
      setEtapa('listo');
    });
  }

  function empezarDeNuevo() {
    setEtapa('elegir');
    setFilas([]);
    setResultados([]);
    setNombreArchivo('');
    setError(null);
  }

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <BarraAdmin />

      <Pressable
        onPress={() => router.replace('/admin')}
        style={estilos.volver}
        accessibilityRole="link"
      >
        <Icono nombre="volver" tamano={ICONO.pequeno} />
        <Text style={estilos.textoVolver}>Volver al panel</Text>
      </Pressable>

      <View style={estilos.tarjeta}>
        <View style={estilos.encabezado}>
          <ContenedorIcono nombre={etapa === 'listo' ? 'listo' : 'planilla'} />
          <View style={estilos.textosEncabezado}>
            <Text style={estilos.titulo} accessibilityRole="header">
              {etapa === 'elegir'
                ? 'Importar desde Excel'
                : etapa === 'revisar'
                  ? 'Revisa antes de importar'
                  : 'Importación terminada'}
            </Text>
            <Text style={estilos.ayuda}>
              {etapa === 'elegir'
                ? `Sube la planilla de oferta turística (.xlsx). Se lee la hoja "${HOJA_SERVICIOS}", con las mismas columnas del Excel de ejemplo. Antes de guardar vas a ver qué filas están bien y cuáles hay que corregir.`
                : etapa === 'revisar'
                  ? `${nombreArchivo}: ${resultados.length} filas. Solo se importan las filas listas; las demás se ignoran.`
                  : guardados === 1
                    ? 'Se importó 1 servicio.'
                    : `Se importaron ${guardados} servicios.`}
            </Text>
          </View>
        </View>

        {error ? <MensajeAviso tipo="error" texto={error} /> : null}

        {cargando ? (
          <View style={estilos.cargando}>
            <ActivityIndicator color={COLORES.primario} />
            <Text style={estilos.ayuda}>{cargando}</Text>
          </View>
        ) : etapa === 'elegir' ? (
          <View style={estilos.notas}>
            <Nota texto="La primera fila debe tener los títulos de las columnas (categoria, nombre, horario…)." />
            <Nota texto="Los servicios que ya existen (mismo nombre y categoría) no se duplican." />
            <Nota texto="Las columnas id, fuente_url y fecha_consulta no se importan: el código se crea solo." />
          </View>
        ) : (
          <>
            {etapa === 'listo' && guardados > 0 ? (
              <MensajeAviso
                tipo="exito"
                texto="Los servicios importados ya están guardados. Cada uno recibió su código."
              />
            ) : null}
            <View style={estilos.filtros}>
              <OpcionSeleccionable
                texto={`Todas (${resultados.length})`}
                seleccionada={filtro === 'todas'}
                alPresionar={() => setFiltro('todas')}
              />
              {(Object.keys(ESTILO_ESTADO) as EstadoFila[]).map((estado) => (
                <OpcionSeleccionable
                  key={estado}
                  texto={`${etapa === 'listo' && estado === 'nueva' ? 'Importadas' : ESTILO_ESTADO[estado].texto} (${cuenta(estado)})`}
                  seleccionada={filtro === estado}
                  alPresionar={() => setFiltro(estado)}
                />
              ))}
            </View>
            <View style={estilos.lista}>
              {visibles.length === 0 ? (
                <Text style={estilos.ayuda}>No hay filas en este grupo.</Text>
              ) : (
                visibles.map((resultado) => (
                  <FilaResultado key={resultado.fila} resultado={resultado} />
                ))
              )}
            </View>
          </>
        )}

        <View style={estilos.botones}>
          {etapa === 'elegir' ? (
            <Boton
              texto="Elegir archivo .xlsx"
              alPresionar={elegirArchivo}
              desactivado={Boolean(cargando)}
            />
          ) : etapa === 'revisar' ? (
            <>
              <Boton
                texto="Elegir otro archivo"
                alPresionar={empezarDeNuevo}
                variante="secundario"
                desactivado={Boolean(cargando)}
              />
              <Boton
                texto={
                  nuevas === 0
                    ? 'No hay filas para importar'
                    : nuevas === 1
                      ? 'Importar 1 servicio'
                      : `Importar ${nuevas} servicios`
                }
                alPresionar={confirmar}
                desactivado={nuevas === 0 || Boolean(cargando)}
              />
            </>
          ) : (
            <>
              <Boton
                texto="Volver al panel"
                alPresionar={() => router.replace('/admin')}
                variante="secundario"
              />
              <Boton texto="Importar otro archivo" alPresionar={empezarDeNuevo} />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function Nota({ texto }: { texto: string }) {
  return (
    <View style={estilos.nota}>
      <Icono nombre="listo" tamano={ICONO.pequeno} />
      <Text style={estilos.textoNota}>{texto}</Text>
    </View>
  );
}

function FilaResultado({ resultado }: { resultado: ResultadoFila }) {
  const estilo = ESTILO_ESTADO[resultado.estado];
  const errores = Object.entries(resultado.errores ?? {}) as [keyof DatosServicio, string][];
  return (
    <View style={estilos.fila}>
      <View style={estilos.encabezadoFila}>
        <View style={estilos.textosFila}>
          <Text style={estilos.detalleFila}>
            Fila {resultado.fila}
            {resultado.categoria ? ` · ${resultado.categoria}` : ''}
          </Text>
          <Text style={estilos.nombreFila}>{resultado.nombre || '(sin nombre)'}</Text>
        </View>
        <View style={[estilos.estado, { backgroundColor: estilo.fondo }]}>
          <Icono nombre={estilo.icono} tamano={ICONO.pequeno} color={estilo.color} />
          <Text style={[estilos.textoEstado, { color: estilo.color }]}>
            {resultado.id ? `Importada · ${resultado.id}` : estilo.texto}
          </Text>
        </View>
      </View>
      {resultado.mensaje ? <Text style={estilos.ayuda}>{resultado.mensaje}</Text> : null}
      {errores.map(([campo, mensaje]) => (
        <Text key={campo} style={estilos.error}>
          <Text style={estilos.campoError}>{ETIQUETAS_CAMPOS_SERVICIO[campo] ?? campo}: </Text>
          {mensaje}
        </Text>
      ))}
    </View>
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
    gap: ESPACIOS.xl,
    padding: ESPACIOS.l,
  },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ESPACIOS.xs,
  },
  textoVolver: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.primario,
  },
  tarjeta: {
    gap: ESPACIOS.xl,
    padding: ESPACIOS.xxl,
    borderRadius: RADIOS.tarjeta,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACIOS.m,
  },
  textosEncabezado: {
    flex: 1,
    gap: ESPACIOS.xs,
  },
  titulo: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
  },
  ayuda: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
  },
  cargando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.m,
    paddingVertical: ESPACIOS.l,
  },
  notas: {
    gap: ESPACIOS.s,
  },
  nota: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACIOS.s,
  },
  textoNota: {
    ...TIPOGRAFIA.cuerpo,
    flex: 1,
    color: COLORES.texto,
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.s,
  },
  lista: {
    gap: ESPACIOS.s,
  },
  fila: {
    gap: ESPACIOS.xs,
    padding: ESPACIOS.m,
    borderRadius: RADIOS.boton,
    borderWidth: BORDES.tarjeta,
    borderColor: COLORES.borde,
  },
  encabezadoFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ESPACIOS.s,
  },
  textosFila: {
    flexShrink: 1,
    gap: 2,
  },
  detalleFila: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.textoSecundario,
  },
  nombreFila: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIOS.xs,
    paddingHorizontal: ESPACIOS.s,
    paddingVertical: ESPACIOS.xs,
    borderRadius: RADIOS.chip,
  },
  textoEstado: {
    ...TIPOGRAFIA.etiqueta,
  },
  error: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.emergencia,
  },
  campoError: {
    ...TIPOGRAFIA.etiqueta,
    color: COLORES.emergencia,
  },
  botones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: ESPACIOS.m,
    paddingTop: ESPACIOS.l,
    borderTopWidth: BORDES.tarjeta,
    borderTopColor: COLORES.borde,
  },
});
