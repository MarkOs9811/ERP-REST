import "../../../css/estilosComponentesCategoriaPlatos/estilosCategoriaPlatos.css";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { useDispatch, useSelector } from "react-redux";
import { setEstadoCategoria } from "../../../redux/categoriaPlatosSlice";
import { useQuery } from "@tanstack/react-query";

import { GetCategoriasPlatosTrue } from "../../../service/accionesVender/GetCategoriasPlatosTrue";
import { GetCategoria } from "../../../service/GetCategoria";

export function CategoriaPlatos({ claveVenta = "", clearSearch }) {
  const dispatch = useDispatch();
  const estadoCategoria = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const esComida = claveVenta === "restaurante";

  const {
    data: respuestaCategorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: esComida ? ["categoriasPlatos"] : ["categoriasInventario"],
    queryFn: esComida ? GetCategoriasPlatosTrue : GetCategoria,
    enabled: !!claveVenta,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const categorias = Array.isArray(respuestaCategorias)
    ? respuestaCategorias
    : respuestaCategorias.data || [];

  const handleFiltrarCategoria = (nombreCategoria) => {
    clearSearch("");
    dispatch(setEstadoCategoria(nombreCategoria));
  };

  return (
    /* 🔥 CAMBIO AQUÍ: d-flex, flex-nowrap (evita saltos de línea), overflow-auto (scroll) y gap-2 (separación) */
    <div className="d-flex flex-nowrap overflow-auto gap-2 pb-2 mb-2 contenedor-categorias-scroll">
      {isLoading && <p className="mb-0 text-muted">Cargando categorías...</p>}
      {isError && !isLoading && <p className="error-message mb-0">{isError}</p>}

      {/* Botón TODO al inicio (usualmente es mejor UX tenerlo primero) */}
      <button
        className={`rounded-pill border-0 py-1 px-3 text-nowrap flex-shrink-0 ${
          estadoCategoria == "todo" ? "categoriaSelect" : "bg-light text-dark"
        }`}
        onClick={() => handleFiltrarCategoria(`todo`)}
      >
        Todo
      </button>

      {/* Mostrar las categorías */}
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          /* 🔥 CAMBIO AQUÍ: text-nowrap (el texto no se rompe) y flex-shrink-0 (el botón no se aplasta) */
          className={`rounded-pill border-0 py-1 px-3 text-nowrap flex-shrink-0 ${
            estadoCategoria == categoria.nombre
              ? "categoriaSelect"
              : "bg-light text-dark"
          }`}
          onClick={() => handleFiltrarCategoria(`${categoria.nombre}`)}
        >
          {capitalizeFirstLetter(categoria.nombre)}
        </button>
      ))}

      {!isLoading && !isError && categorias.length === 0 && (
        <p className="mb-0 text-muted">No hay categorías.</p>
      )}
    </div>
  );
}
