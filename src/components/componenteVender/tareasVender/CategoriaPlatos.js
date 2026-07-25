import "../../../css/estilosComponentesCategoriaPlatos/estilosCategoriaPlatos.css";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { useDispatch, useSelector } from "react-redux";
import { setEstadoCategoria } from "../../../redux/categoriaPlatosSlice";
import { useQuery } from "@tanstack/react-query";

// Importamos ambos servicios
import { GetCategoriasPlatosTrue } from "../../../service/accionesVender/GetCategoriasPlatosTrue";
import { GetCategoria } from "../../../service/GetCategoria"; // 👉 Ajusta esta ruta a donde tengas tu servicio de tienda

export function CategoriaPlatos({ claveVenta }) {
  const dispatch = useDispatch();
  const estadoCategoria = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  // Validamos qué tipo de configuración es
  const esComida = claveVenta === "restaurante";

  // Hacemos la consulta condicional
  const {
    data: respuestaCategorias = [], // Le llamamos respuesta porque podría ser un objeto o un array
    isLoading,
    isError,
  } = useQuery({
    queryKey: esComida ? ["categoriasPlatos"] : ["categoriasInventario"],
    queryFn: esComida ? GetCategoriasPlatosTrue : GetCategoria,
    enabled: !!claveVenta, // 👉 No consultamos hasta saber qué tipo de venta es
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // 👉 MAGIA: Normalizamos la data
  // Como GetCategoria devuelve { success: true, data: [...] }, extraemos el array real
  const categorias = Array.isArray(respuestaCategorias)
    ? respuestaCategorias
    : respuestaCategorias.data || [];

  const handleFiltrarCategoria = (nombreCategoria) => {
    dispatch(setEstadoCategoria(nombreCategoria));
  };

  return (
    <div className="g-2">
      {/* Mensaje de carga */}
      {isLoading && <p>Cargando categorías...</p>}

      {/* Mensaje de error */}
      {isError && !isLoading && <p className="error-message">{isError}</p>}

      {/* Mostrar las categorías */}
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          className={`rounded-pill border-0 p-1 mx-2 px-3  ${
            estadoCategoria == categoria.nombre ? "categoriaSelect" : ""
          }`}
          onClick={() => handleFiltrarCategoria(`${categoria.nombre}`)}
        >
          {capitalizeFirstLetter(categoria.nombre)}
        </button>
      ))}

      <button
        className={`rounded-pill border-0 p-1 mx-2 px-3  ${
          estadoCategoria == "todo" ? "categoriaSelect" : ""
        }`}
        onClick={() => handleFiltrarCategoria(`todo`)}
      >
        <span>Todo</span>
      </button>

      {/* Mensaje cuando no hay categorías */}
      {!isLoading && !isError && categorias.length === 0 && (
        <p>No se encontraron categorías disponibles.</p>
      )}
    </div>
  );
}
