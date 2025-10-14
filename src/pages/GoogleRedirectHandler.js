import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { useDispatch } from "react-redux";
import { abrirCaja } from "../redux/cajaSlice";

export const GoogleRedirectHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      axios
        .get("http://erp-api.test/api/loginGoogle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const cajaData = {
            nombre: response.data?.caja?.caja?.nombreCaja ?? "",
            id: response.data?.caja?.caja?.id ?? null,
            estado:
              response.data?.caja?.caja?.estadoCaja == 1
                ? "abierto"
                : "cerrado",
          };
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("roles", JSON.stringify(response.data.roles));

          localStorage.setItem("caja", JSON.stringify(cajaData));

          dispatch(abrirCaja(cajaData));

          localStorage.setItem(
            "empresa",
            JSON.stringify(response.data.miEmpresa)
          );
          localStorage.setItem(
            "configuracion",
            JSON.stringify(response.data.configuracion)
          );

          ToastAlert("success", "Inicio de sesión con Google exitoso");
          navigate("/"); // Redirige al dashboard o inicio
        })
        .catch((error) => {
          ToastAlert("error", "No se pudo obtener los datos del usuario");
          navigate("/login");
        });
    } else {
      ToastAlert("error", "No se pudo iniciar sesión con Google");
      navigate("/login");
    }
  }, [navigate]);

  return <div>Cargando...</div>;
};
