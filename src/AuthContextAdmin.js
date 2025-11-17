import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cerrarCaja } from "./redux/cajaSlice";

const AuthContextAdmin = createContext();

export const useAuth = () => useContext(AuthContextAdmin);

// --- FUNCIÓN HELPER ---
// Para obtener el usuario de forma segura desde localStorage
const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error al parsear usuario de localStorage", error);
    localStorage.clear(); // Limpia si está corrupto
    return null;
  }
};
// ---------------------

export const AuthProviderAdmin = ({ children }) => {
  const dispatch = useDispatch();

  // --- ¡CAMBIO 1: CREA UN ESTADO PARA EL USUARIO! ---
  // Inicializa el estado leyendo de localStorage
  const [user, setUser] = useState(getInitialUser());

  // (Tu estado de 'isAuthenticated' ahora puede depender del usuario también)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") && !!user
  );

  const login = (token, userData) => {
    // Renombrado a 'userData' para evitar confusión
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // --- ¡CAMBIO 2: ACTUALIZA EL ESTADO 'user'! ---
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    dispatch(cerrarCaja());

    // --- ¡CAMBIO 3: LIMPIA EL ESTADO 'user'! ---
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Sincroniza el estado al cargar la app
    const token = localStorage.getItem("token");
    const storedUser = getInitialUser();

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    } else {
      // Si falta el token o el usuario, fuerza el logout
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // --- ¡CAMBIO 4: AÑADE 'user' AL VALUE DEL PROVIDER! ---
  return (
    <AuthContextAdmin.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContextAdmin.Provider>
  );
};
