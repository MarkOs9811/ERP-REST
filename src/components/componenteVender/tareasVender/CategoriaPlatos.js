import "../../../css/estilosComponentesCategoriaPlatos/estilosCategoriaPlatos.css";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { useDispatch, useSelector } from "react-redux";
import { setEstadoCategoria } from "../../../redux/categoriaPlatosSlice";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriasPlatosTrue } from "../../../service/accionesVender/GetCategoriasPlatosTrue";

export function CategoriaPlatos() {
  const dispatch = useDispatch();
  const estadoCategoria = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );

  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoriasPlatos"],
    queryFn: GetCategoriasPlatosTrue,
    retry: 1,
    refetchOnWindowFocus: false,
  });
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
          className={`rounded-pill border p-1 mx-2 px-3  ${
            estadoCategoria == categoria.nombre ? "categoriaSelect" : ""
          }`}
          onClick={() => handleFiltrarCategoria(`${categoria.nombre}`)}
        >
          {capitalizeFirstLetter(categoria.nombre)}
        </button>
      ))}
      <button
        className={`rounded-pill border p-1 mx-2 px-3  ${
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
