import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// En el celular la app ocupa toda la pantalla: no hace falta marco.
// La versión web está en MarcoTelefono.web.tsx.
export function MarcoTelefono({ children }: Props) {
  return children;
}
