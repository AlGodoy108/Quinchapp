import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewInstance,
} from 'react-native';

import { BarraAdmin } from '@/componentes/BarraAdmin';
import { Boton } from '@/componentes/Boton';
import { CampoFormulario } from '@/componentes/CampoFormulario';
import { ContenedorIcono } from '@/componentes/ContenedorIcono';
import { Icono } from '@/componentes/Icono';
import { ListaEtiquetas } from '@/componentes/ListaEtiquetas';
import { MensajeAviso } from '@/componentes/MensajeAviso';
import { OpcionSeleccionable } from '@/componentes/OpcionSeleccionable';
import { ProgresoPasos } from '@/componentes/ProgresoPasos';
import {
  CATEGORIAS_SERVICIO,
  COMUNA_POR_DEFECTO,
  LOCALIDADES_QUINCHAO,
  obtenerCategoriaServicio,
  REGION_POR_DEFECTO,
  TEXTO_CONSULTAR,
  TEXTO_SIN_DIRECCION,
} from '@/constantes/categoriasServicio';
import type { NombreIcono } from '@/constantes/iconos';
import { BORDES, COLORES, ESPACIOS, ICONO, RADIOS, TIPOGRAFIA } from '@/constantes/tema';
import { useSesionAdmin } from '@/hooks/useSesionAdmin';
import { useTituloPagina } from '@/hooks/useTituloPagina';
import { crearServicio, ErrorSesion, ErrorValidacion } from '@/servicios/admin';
import { ESTADOS_VERIFICACION, type DatosServicio, type Servicio } from '@/tipos/servicio';
import {
  separarCoordenadas,
  validarServicio,
  type ErroresServicio,
} from '@/utilidades/validarServicio';

// Lo que se escribe en el formulario: todo texto, salvo la lista de servicios
type Formulario = Omit<DatosServicio, 'latitud' | 'longitud' | 'estadoVerificacion'> & {
  latitud: string;
  longitud: string;
  estadoVerificacion: string;
};

type Campo = keyof DatosServicio;

function formularioInicial(): Formulario {
  return {
    categoria: '',
    subcategoria: '',
    nombre: '',
    descripcion: '',
    direccion: '',
    localidad: '',
    comuna: COMUNA_POR_DEFECTO,
    region: REGION_POR_DEFECTO,
    latitud: '',
    longitud: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    redesSociales: '',
    horario: '',
    precioReferencia: '',
    servicios: [],
    capacidad: '',
    estadoVerificacion: '',
  };
}

type Paso = {
  titulo: string;
  pregunta: string;
  ayuda: string;
  icono: NombreIcono;
  campos: Campo[];
};

// Un paso por cada tema de las columnas de la hoja "Datos" del Excel
const PASOS: Paso[] = [
  {
    titulo: 'Categoría',
    pregunta: '¿Qué tipo de servicio es?',
    ayuda: 'Elige la categoría y luego la subcategoría que mejor lo describe.',
    icono: 'categorias',
    campos: ['categoria', 'subcategoria'],
  },
  {
    titulo: 'Nombre',
    pregunta: '¿Cómo se llama y qué ofrece?',
    ayuda: 'Así lo verán los turistas en la app.',
    icono: 'texto',
    campos: ['nombre', 'descripcion'],
  },
  {
    titulo: 'Ubicación',
    pregunta: '¿Dónde está?',
    ayuda: 'Las coordenadas son opcionales, pero sin ellas no aparece en el mapa.',
    icono: 'ubicacion',
    campos: ['direccion', 'localidad', 'comuna', 'region', 'latitud', 'longitud'],
  },
  {
    titulo: 'Contacto',
    pregunta: '¿Cómo se puede contactar?',
    ayuda: 'Todos los datos de contacto son opcionales. Completa los que tengas.',
    icono: 'contacto',
    campos: ['telefono', 'email', 'sitioWeb', 'redesSociales'],
  },
  {
    titulo: 'Horario y precio',
    pregunta: '¿Cuándo atiende y cuánto cuesta?',
    ayuda: 'Si no hay información publicada, marca "Consultar".',
    icono: 'horario',
    campos: ['horario', 'precioReferencia', 'capacidad'],
  },
  {
    titulo: 'Servicios',
    pregunta: '¿Qué servicios o comodidades ofrece?',
    ayuda: 'Por ejemplo: Wifi, Estacionamiento, Desayuno. Es opcional.',
    icono: 'etiqueta',
    campos: ['servicios'],
  },
  {
    titulo: 'Verificación',
    pregunta: '¿Qué tan confiable es esta información?',
    ayuda: 'Ayuda al equipo a saber qué datos hay que confirmar antes de publicar.',
    icono: 'verificado',
    campos: ['estadoVerificacion'],
  },
  {
    titulo: 'Revisar',
    pregunta: 'Revisa antes de guardar',
    ayuda: 'Si algo está mal, presiona "Editar" en esa sección.',
    icono: 'revisar',
    campos: [],
  },
];

const ETIQUETAS: Record<Campo, string> = {
  categoria: 'Categoría',
  subcategoria: 'Subcategoría',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  direccion: 'Dirección',
  localidad: 'Localidad',
  comuna: 'Comuna',
  region: 'Región',
  latitud: 'Latitud',
  longitud: 'Longitud',
  telefono: 'Teléfono',
  email: 'Correo',
  sitioWeb: 'Sitio web',
  redesSociales: 'Redes sociales',
  horario: 'Horario',
  precioReferencia: 'Precio de referencia',
  servicios: 'Servicios',
  capacidad: 'Capacidad',
  estadoVerificacion: 'Estado de verificación',
};

export default function PantallaNuevoServicio() {
  const { sesionVencida } = useSesionAdmin();
  const [formulario, setFormulario] = useState<Formulario>(formularioInicial);
  const [indicePaso, setIndicePaso] = useState(0);
  const [errores, setErrores] = useState<ErroresServicio>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState<Servicio | null>(null);
  const desplazamiento = useRef<ScrollViewInstance>(null);
  useTituloPagina('Agregar servicio · Panel Quinchapp');

  const paso = PASOS[indicePaso];
  const esUltimo = indicePaso === PASOS.length - 1;
  const hayCambios = JSON.stringify(formulario) !== JSON.stringify(formularioInicial());

  // Avisa antes de cerrar o recargar la pestaña con datos sin guardar
  useEffect(() => {
    if (Platform.OS !== 'web' || !hayCambios || guardado) {
      return;
    }
    const avisar = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [hayCambios, guardado]);

  useEffect(() => {
    desplazamiento.current?.scrollTo({ y: 0, animated: false });
  }, [indicePaso, guardado]);

  function cambiar<C extends keyof Formulario>(campo: C, valor: Formulario[C]) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErrores((anteriores) => ({ ...anteriores, [campo]: undefined }));
  }

  function erroresDelPaso(campos: Campo[]) {
    const resultado = validarServicio(formulario);
    if (resultado.ok) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(resultado.errores).filter(([campo]) => campos.includes(campo as Campo)),
    ) as ErroresServicio;
  }

  function irAPaso(indice: number) {
    setErrores({});
    setErrorGeneral(null);
    setIndicePaso(indice);
  }

  function siguiente() {
    const encontrados = erroresDelPaso(paso.campos);
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      return;
    }
    irAPaso(Math.min(indicePaso + 1, PASOS.length - 1));
  }

  async function guardar() {
    if (guardando) {
      return;
    }
    setGuardando(true);
    setErrorGeneral(null);
    try {
      setGuardado(await crearServicio(formulario));
    } catch (error) {
      if (error instanceof ErrorSesion) {
        sesionVencida();
        return;
      }
      if (error instanceof ErrorValidacion) {
        // Vuelve al primer paso que tiene un campo con problemas
        const indice = PASOS.findIndex((p) => p.campos.some((c) => error.errores[c]));
        if (indice >= 0) {
          setIndicePaso(indice);
          setErrores(error.errores);
        }
      }
      setErrorGeneral((error as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  function empezarOtro() {
    setFormulario(formularioInicial());
    setGuardado(null);
    irAPaso(0);
  }

  return (
    <ScrollView
      ref={desplazamiento}
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <BarraAdmin />

      <Pressable
        onPress={() => router.replace('/admin')}
        style={estilos.volver}
        accessibilityRole="link"
      >
        <Icono nombre="volver" tamano={ICONO.pequeno} />
        <Text style={estilos.textoVolver}>Volver al panel</Text>
      </Pressable>

      {guardado ? (
        <View style={estilos.tarjeta}>
          <ContenedorIcono nombre="listo" tamano={56} redondo />
          <Text style={estilos.pregunta}>Servicio guardado</Text>
          <MensajeAviso
            tipo="exito"
            texto={`"${guardado.nombre}" quedó guardado con el código ${guardado.id}.`}
          />
          <View style={estilos.botones}>
            <Boton
              texto="Volver al panel"
              alPresionar={() => router.replace('/admin')}
              variante="secundario"
            />
            <Boton texto="Agregar otro servicio" alPresionar={empezarOtro} />
          </View>
        </View>
      ) : (
        <>
          <ProgresoPasos actual={indicePaso + 1} total={PASOS.length} titulo={paso.titulo} />

          <View style={estilos.tarjeta}>
            <View style={estilos.encabezadoPaso}>
              <ContenedorIcono nombre={paso.icono} />
              <View style={estilos.textosPaso}>
                <Text style={estilos.pregunta} accessibilityRole="header">
                  {paso.pregunta}
                </Text>
                <Text style={estilos.ayuda}>{paso.ayuda}</Text>
              </View>
            </View>

            {errorGeneral ? <MensajeAviso tipo="error" texto={errorGeneral} /> : null}

            <ContenidoPaso
              indice={indicePaso}
              formulario={formulario}
              errores={errores}
              cambiar={cambiar}
              siguiente={siguiente}
              irAPaso={irAPaso}
            />

            <View style={estilos.botones}>
              {indicePaso > 0 ? (
                <Boton
                  texto="Atrás"
                  alPresionar={() => irAPaso(indicePaso - 1)}
                  variante="secundario"
                />
              ) : null}
              {esUltimo ? (
                <Boton
                  texto={guardando ? 'Guardando…' : 'Guardar servicio'}
                  alPresionar={guardar}
                  desactivado={guardando}
                />
              ) : (
                <Boton texto="Siguiente" alPresionar={siguiente} />
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

type PropsContenido = {
  indice: number;
  formulario: Formulario;
  errores: ErroresServicio;
  cambiar: <C extends keyof Formulario>(campo: C, valor: Formulario[C]) => void;
  siguiente: () => void;
  irAPaso: (indice: number) => void;
};

function ContenidoPaso({
  indice,
  formulario: f,
  errores,
  cambiar,
  siguiente,
  irAPaso,
}: PropsContenido) {
  // Propiedades comunes de cada campo de texto: valor, error y Enter para avanzar
  function campo(nombre: Exclude<keyof Formulario, 'servicios'>) {
    return {
      etiqueta: ETIQUETAS[nombre],
      valor: f[nombre],
      alCambiar: (texto: string) => cambiar(nombre, texto),
      error: errores[nombre],
      onSubmitEditing: siguiente,
    };
  }

  switch (PASOS[indice].titulo) {
    case 'Categoría': {
      const categoria = obtenerCategoriaServicio(f.categoria);
      return (
        <>
          <Grupo etiqueta="Categoría" error={errores.categoria}>
            <View style={estilos.opcionesTarjeta}>
              {CATEGORIAS_SERVICIO.map((c) => (
                <OpcionSeleccionable
                  key={c.codigo}
                  forma="tarjeta"
                  icono={c.icono}
                  texto={c.nombre}
                  seleccionada={f.categoria === c.nombre}
                  alPresionar={() => {
                    // Si la subcategoría era una sugerencia de la categoría anterior, se borra
                    if (categoria?.subcategorias.includes(f.subcategoria)) {
                      cambiar('subcategoria', '');
                    }
                    cambiar('categoria', c.nombre);
                  }}
                />
              ))}
            </View>
          </Grupo>
          {categoria ? (
            <>
              <CampoFormulario
                {...campo('subcategoria')}
                placeholder="Elige una sugerencia o escribe otra"
              />
              <Sugerencias
                opciones={categoria.subcategorias}
                valor={f.subcategoria}
                alElegir={(texto) => cambiar('subcategoria', texto)}
              />
            </>
          ) : null}
        </>
      );
    }

    case 'Nombre':
      return (
        <>
          <CampoFormulario {...campo('nombre')} placeholder="Ej: Cabañas Bruma Azul" />
          <CampoFormulario
            {...campo('descripcion')}
            onSubmitEditing={undefined}
            multiline
            placeholder="Ej: Cabañas de madera nativa equipadas, a tres cuadras de la plaza."
            ayuda={`${f.descripcion.trim().length} de 1000 caracteres. Una o dos frases bastan.`}
          />
        </>
      );

    case 'Ubicación':
      return (
        <>
          <CampoFormulario {...campo('direccion')} placeholder="Ej: Calle Serrano 123" />
          <Sugerencias
            opciones={[TEXTO_SIN_DIRECCION]}
            valor={f.direccion}
            alElegir={(texto) => cambiar('direccion', texto)}
          />
          <CampoFormulario {...campo('localidad')} placeholder="Ej: Achao" />
          <Sugerencias
            opciones={LOCALIDADES_QUINCHAO}
            valor={f.localidad}
            alElegir={(texto) => cambiar('localidad', texto)}
          />
          <View style={estilos.fila}>
            <View style={estilos.columna}>
              <CampoFormulario {...campo('comuna')} />
            </View>
            <View style={estilos.columna}>
              <CampoFormulario {...campo('region')} />
            </View>
          </View>
          <View style={estilos.fila}>
            <View style={estilos.columna}>
              <CampoFormulario
                {...campo('latitud')}
                opcional
                placeholder="-42.4718"
                alCambiar={(texto) => {
                  // Si se pegan las dos coordenadas juntas, se reparten en los dos campos
                  const par = separarCoordenadas(texto);
                  cambiar('latitud', par ? par.latitud : texto);
                  if (par) {
                    cambiar('longitud', par.longitud);
                  }
                }}
              />
            </View>
            <View style={estilos.columna}>
              <CampoFormulario {...campo('longitud')} opcional placeholder="-73.4892" />
            </View>
          </View>
          <Text style={estilos.ayuda}>
            En Google Maps: clic derecho sobre el lugar y luego clic en las coordenadas para
            copiarlas. Puedes pegarlas juntas en Latitud.
          </Text>
        </>
      );

    case 'Contacto':
      return (
        <>
          <CampoFormulario
            {...campo('telefono')}
            opcional
            placeholder="Ej: +56 9 1234 5678"
            ayuda='Si hay más de uno, sepáralos con " / ".'
            keyboardType="phone-pad"
          />
          <CampoFormulario
            {...campo('email')}
            opcional
            placeholder="Ej: contacto@negocio.cl"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CampoFormulario
            {...campo('sitioWeb')}
            opcional
            placeholder="Ej: www.negocio.cl"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CampoFormulario
            {...campo('redesSociales')}
            opcional
            placeholder="Ej: instagram.com/negocio / facebook.com/negocio"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </>
      );

    case 'Horario y precio':
      return (
        <>
          <CampoFormulario {...campo('horario')} placeholder="Ej: Lun a Sáb 12:00 - 22:00" />
          <Sugerencias
            opciones={[TEXTO_CONSULTAR, 'Temporada estival (consultar)', 'Libre acceso']}
            valor={f.horario}
            alElegir={(texto) => cambiar('horario', texto)}
          />
          <CampoFormulario
            {...campo('precioReferencia')}
            placeholder="Ej: $45.000 por noche (referencial)"
          />
          <Sugerencias
            opciones={[TEXTO_CONSULTAR, 'Gratis', 'Entrada liberada']}
            valor={f.precioReferencia}
            alElegir={(texto) => cambiar('precioReferencia', texto)}
          />
          <CampoFormulario
            {...campo('capacidad')}
            opcional
            placeholder="Ej: Hasta 5 personas por cabaña"
          />
          <Sugerencias
            opciones={[TEXTO_CONSULTAR]}
            valor={f.capacidad}
            alElegir={(texto) => cambiar('capacidad', texto)}
          />
        </>
      );

    case 'Servicios':
      return (
        <Grupo etiqueta="" error={errores.servicios}>
          <ListaEtiquetas
            etiqueta="Servicios que ofrece"
            valores={f.servicios}
            alCambiar={(valores) => cambiar('servicios', valores)}
            placeholder="Escribe uno y presiona Enter"
          />
        </Grupo>
      );

    case 'Verificación':
      return (
        <>
          <Grupo etiqueta="Estado de la información" error={errores.estadoVerificacion}>
            <View style={estilos.opcionesTarjeta}>
              <OpcionSeleccionable
                forma="tarjeta"
                icono="verificado"
                texto="Verificado"
                descripcion="Los datos están al día o los confirmaste con el establecimiento."
                seleccionada={f.estadoVerificacion === ESTADOS_VERIFICACION[0]}
                alPresionar={() => cambiar('estadoVerificacion', ESTADOS_VERIFICACION[0])}
              />
              <OpcionSeleccionable
                forma="tarjeta"
                icono="buscar"
                texto="Por verificar"
                descripcion="Los datos pueden estar desactualizados o incompletos. Hay que confirmarlos antes de publicar."
                seleccionada={f.estadoVerificacion === ESTADOS_VERIFICACION[1]}
                alPresionar={() => cambiar('estadoVerificacion', ESTADOS_VERIFICACION[1])}
              />
            </View>
          </Grupo>
        </>
      );

    default:
      return <Resumen formulario={f} irAPaso={irAPaso} />;
  }
}

function Resumen({
  formulario,
  irAPaso,
}: {
  formulario: Formulario;
  irAPaso: (i: number) => void;
}) {
  return (
    <View style={estilos.resumen}>
      {PASOS.slice(0, -1).map((paso, indice) => (
        <View key={paso.titulo} style={estilos.seccionResumen}>
          <View style={estilos.encabezadoResumen}>
            <Text style={estilos.tituloResumen}>{paso.titulo}</Text>
            <Pressable onPress={() => irAPaso(indice)} accessibilityRole="button" hitSlop={8}>
              <Text style={estilos.editar}>Editar</Text>
            </Pressable>
          </View>
          {paso.campos.map((c) => {
            const valor = formulario[c];
            const texto = Array.isArray(valor) ? valor.join('; ') : valor.trim();
            return (
              <View key={c} style={estilos.filaResumen}>
                <Text style={estilos.etiquetaResumen}>{ETIQUETAS[c]}</Text>
                <Text style={[estilos.valorResumen, !texto && estilos.vacio]}>{texto || '—'}</Text>
              </View>
            );
          })}
        </View>
      ))}
      <View style={estilos.seccionResumen}>
        <Text style={estilos.tituloResumen}>Imágenes</Text>
        <Text style={estilos.ayuda}>
          Podrás agregar fotos a este servicio cuando esté lista la sección Imágenes.
        </Text>
      </View>
    </View>
  );
}

// Fila de chips: al presionar uno se copia su texto al campo
function Sugerencias({
  opciones,
  valor,
  alElegir,
}: {
  opciones: string[];
  valor: string;
  alElegir: (texto: string) => void;
}) {
  return (
    <View style={estilos.sugerencias}>
      {opciones.map((opcion) => (
        <OpcionSeleccionable
          key={opcion}
          texto={opcion}
          seleccionada={valor === opcion}
          alPresionar={() => alElegir(opcion)}
        />
      ))}
    </View>
  );
}

// Agrupa opciones que no son un campo de texto, con su etiqueta y su error
function Grupo({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={estilos.grupo} accessibilityRole={etiqueta ? 'radiogroup' : undefined}>
      {etiqueta ? <Text style={estilos.etiquetaGrupo}>{etiqueta}</Text> : null}
      {children}
      {error ? <Text style={estilos.error}>{error}</Text> : null}
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
  encabezadoPaso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACIOS.m,
  },
  textosPaso: {
    flex: 1,
    gap: ESPACIOS.xs,
  },
  pregunta: {
    ...TIPOGRAFIA.titulo1,
    color: COLORES.texto,
  },
  ayuda: {
    ...TIPOGRAFIA.cuerpo,
    color: COLORES.textoSecundario,
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
  opcionesTarjeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.m,
  },
  sugerencias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.s,
    marginTop: -ESPACIOS.s,
  },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.l,
  },
  columna: {
    flexGrow: 1,
    flexBasis: 220,
  },
  grupo: {
    gap: ESPACIOS.s,
  },
  etiquetaGrupo: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.texto,
  },
  error: {
    ...TIPOGRAFIA.pequeno,
    color: COLORES.emergencia,
  },
  resumen: {
    gap: ESPACIOS.l,
  },
  seccionResumen: {
    gap: ESPACIOS.s,
    padding: ESPACIOS.l,
    borderRadius: RADIOS.tarjeta,
    backgroundColor: COLORES.fondo,
  },
  encabezadoResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloResumen: {
    ...TIPOGRAFIA.titulo2,
    color: COLORES.texto,
  },
  editar: {
    ...TIPOGRAFIA.titulo3,
    color: COLORES.primario,
  },
  filaResumen: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIOS.s,
  },
  etiquetaResumen: {
    ...TIPOGRAFIA.cuerpo,
    width: 180,
    color: COLORES.textoSecundario,
  },
  valorResumen: {
    ...TIPOGRAFIA.cuerpo,
    flex: 1,
    minWidth: 200,
    color: COLORES.texto,
  },
  vacio: {
    color: COLORES.textoSecundario,
  },
});
