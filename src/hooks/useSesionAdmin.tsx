import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  cerrarSesionAdmin,
  iniciarSesionAdmin,
  obtenerSesionAdmin,
  type AdminSesion,
} from '@/servicios/admin';

type ValorSesionAdmin = {
  // undefined mientras se consulta al servidor; null si no hay sesión
  admin: AdminSesion | null | undefined;
  errorCarga: string | null;
  ingresar: (correo: string, contrasena: string) => Promise<void>;
  salir: () => Promise<void>;
  // Para cuando el servidor responde 401 en otra pantalla (la sesión venció)
  sesionVencida: () => void;
};

const ContextoSesionAdmin = createContext<ValorSesionAdmin | null>(null);

export function ProveedorSesionAdmin({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSesion | null | undefined>(undefined);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  useEffect(() => {
    obtenerSesionAdmin()
      .then(setAdmin)
      .catch((error: Error) => {
        setErrorCarga(error.message);
        setAdmin(null);
      });
  }, []);

  const ingresar = useCallback(async (correo: string, contrasena: string) => {
    setAdmin(await iniciarSesionAdmin(correo, contrasena));
  }, []);

  const salir = useCallback(async () => {
    try {
      await cerrarSesionAdmin();
    } finally {
      setAdmin(null);
    }
  }, []);

  const sesionVencida = useCallback(() => setAdmin(null), []);

  return (
    <ContextoSesionAdmin.Provider value={{ admin, errorCarga, ingresar, salir, sesionVencida }}>
      {children}
    </ContextoSesionAdmin.Provider>
  );
}

export function useSesionAdmin() {
  const valor = useContext(ContextoSesionAdmin);
  if (!valor) {
    throw new Error('useSesionAdmin debe usarse dentro de ProveedorSesionAdmin');
  }
  return valor;
}
