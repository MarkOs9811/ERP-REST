import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cerrarCaja } from "./redux/cajaSlice";
import { UseEventosGlobales } from "./hooks/UseEventosGlobal";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // 1. Centralizamos el estado del usuario leyendo desde el Storage inicial
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!(localStorage.getItem("token") || sessionStorage.getItem("token")),
  );

  // 2. Usamos el ID directamente del estado en lugar de hacer JSON.parse en cada render
  UseEventosGlobales(user?.id);

  const login = (token, userData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(userData));

    setIsAuthenticated(true);
    setUser(userData); // Actualizamos el estado del usuario activo
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(cerrarCaja());
    setIsAuthenticated(false);
    setUser(null); // Limpiamos el usuario en memoria
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    // 🔥 3. LA CLAVE ESTÁ AQUÍ: Ahora exportamos 'user' para que CajaProtectedRoute pueda usarlo
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
