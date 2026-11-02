// TEMA CENTRAL DE LA APP
// Todos los colores, tipografías, bordes, espacios e íconos salen de este archivo.
// Los valores vienen de las variables del Figma "Pizarra-Principal"
// (Paleta · Logo Quinchao y la pantalla de muestra · Inicio).
// Si cambia el diseño, se cambia aquí y se actualiza toda la app.

import type { TextStyle } from 'react-native';

// Escalas generadas desde los 5 colores del logo. El tono 500 es el color exacto del logo.
export const PALETA = {
  azul: {
    50: '#ECF4F9',
    100: '#D4E5F3',
    200: '#A9CCE6',
    300: '#79AFD8',
    400: '#458FC9',
    500: '#1070BA',
    600: '#0E5F9E',
    700: '#0B4C7E',
    800: '#08385D',
    900: '#05263F',
  },
  amarillo: {
    50: '#FFFAEC',
    100: '#FEF3D4',
    200: '#FEE7A9',
    300: '#FDDA79',
    400: '#FDCC45',
    500: '#FCBD10',
    600: '#D6A10E',
    700: '#AB810B',
    800: '#7E5F08',
    900: '#564005',
  },
  celeste: {
    50: '#F0F8FD',
    100: '#DDF0FA',
    200: '#BBE1F5',
    300: '#95D0EF',
    400: '#6CBDE8',
    500: '#42ABE2',
    600: '#3891C0',
    700: '#2D749A',
    800: '#215671',
    900: '#163A4D',
  },
  magenta: {
    50: '#FDEDF4',
    100: '#FBD8E7',
    200: '#F7B0CF',
    300: '#F284B5',
    400: '#ED5497',
    500: '#E8247A',
    600: '#C51F68',
    700: '#9E1853',
    800: '#74123D',
    900: '#4F0C29',
  },
  verde: {
    50: '#F1F9F0',
    100: '#E0F1DE',
    200: '#C1E2BC',
    300: '#9FD297',
    400: '#7AC16F',
    500: '#54AF46',
    600: '#47953C',
    700: '#397730',
    800: '#2A5823',
    900: '#1D3B18',
  },
  neutro: {
    0: '#FFFFFF',
    50: '#F4F7FA',
    100: '#E8EEF4',
    200: '#D5DEE7',
    300: '#B4C1CE',
    400: '#8D9CAC',
    500: '#6A7A8B',
    600: '#536273',
    700: '#3E4B5A',
    800: '#283442',
    900: '#13202E',
  },
};

// Uso de cada color en la app (modo "Logo oficial" del Figma).
// En las pantallas usa siempre COLORES, no PALETA directamente.
export const COLORES = {
  primario: PALETA.azul[500],
  primarioSuave: PALETA.azul[50],
  sobrePrimario: PALETA.neutro[0],
  secundario: PALETA.amarillo[500],
  secundarioSuave: PALETA.amarillo[50],
  sobreSecundario: PALETA.amarillo[900],
  acento: PALETA.verde[700],
  acentoSuave: PALETA.verde[50],
  emergencia: PALETA.magenta[600],
  emergenciaSuave: PALETA.magenta[50],
  fondo: PALETA.neutro[50],
  superficie: PALETA.neutro[0],
  borde: PALETA.neutro[200],
  texto: PALETA.neutro[900],
  textoSecundario: PALETA.neutro[600],
  iconoTrazo: PALETA.azul[500],
  iconoFondo: PALETA.azul[50],
  estrella: PALETA.amarillo[500],
};

// Poppins en sus tres pesos. Cada peso es una familia distinta: no uses fontWeight.
export const FUENTES = {
  regular: 'Poppins_400Regular',
  media: 'Poppins_500Medium',
  seminegrita: 'Poppins_600SemiBold',
};

// Estilos de texto del Figma (Quinchao/Título 1, Cuerpo, etc.)
export const TIPOGRAFIA = {
  titulo1: { fontFamily: FUENTES.seminegrita, fontSize: 26, lineHeight: 31 },
  titulo2: { fontFamily: FUENTES.seminegrita, fontSize: 19, lineHeight: 24 },
  titulo3: { fontFamily: FUENTES.media, fontSize: 15, lineHeight: 20 },
  cuerpo: { fontFamily: FUENTES.regular, fontSize: 14, lineHeight: 20 },
  pequeno: { fontFamily: FUENTES.regular, fontSize: 12, lineHeight: 17 },
  etiqueta: {
    fontFamily: FUENTES.media,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  boton: { fontFamily: FUENTES.media, fontSize: 14, lineHeight: 17 },
} satisfies Record<string, TextStyle>;

export const RADIOS = {
  tarjeta: 12,
  boton: 8,
  chip: 8,
  icono: 8,
  circulo: 999,
};

export const BORDES = {
  tarjeta: 1,
};

export const ESPACIOS = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
};

// Íconos de línea (Lucide), igual que en el Figma
export const ICONO = {
  trazo: 2,
  pequeno: 16,
  normal: 22,
  grande: 40,
  // Cuadrado de fondo de los íconos de categoría
  contenedor: 40,
};
