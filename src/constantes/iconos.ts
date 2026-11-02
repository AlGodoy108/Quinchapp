import {
  ArrowRight,
  BedDouble,
  ChevronRight,
  Clock3,
  House,
  Landmark,
  LayoutGrid,
  List,
  Map,
  Mountain,
  Sailboat,
  Sandwich,
  Search,
  Star,
  Trees,
  Utensils,
  X,
} from 'lucide-react-native';

// Íconos Lucide: el mismo set que usa el Figma (Ícono/gastronomia = Utensils, etc.)
export const ICONOS = {
  inicio: House,
  mapa: Map,
  categorias: LayoutGrid,
  lugares: List,
  buscar: Search,
  cerrar: X,
  flecha: ChevronRight,
  flechaDerecha: ArrowRight,
  estrella: Star,
  horario: Clock3,
  restaurantes: Utensils,
  comidaRapida: Sandwich,
  hoteleria: BedDouble,
  parques: Trees,
  museos: Landmark,
  navegaciones: Sailboat,
  actividades: Mountain,
};

export type NombreIcono = keyof typeof ICONOS;
