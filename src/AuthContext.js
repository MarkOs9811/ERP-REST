import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cerrarCaja } from "./redux/cajaSlice";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Verificamos si hay token en cualquiera de los dos storages al iniciar
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!(localStorage.getItem("token") || sessionStorage.getItem("token")),
  );

  // Recibe 'rememberMe' para saber dónde guardar
  const login = (token, user, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear(); // Limpiamos AMBOS por seguridad
    dispatch(cerrarCaja());
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
