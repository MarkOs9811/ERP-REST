
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { useDispatch, useSelector } from "react-redux";
import { setEstadoCategoria } from "../../../redux/categoriaPlatosSlice";
import { useQuery } from "@tanstack/react-query";

import { GetCategoriasPlatosTrue } from "../../../service/accionesVender/GetCategoriasPlatosTrue";
import { GetCategoria } from "../../../service/GetCategoria";
import { Button } from "../../ui/button";

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
    <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1">
      {isLoading && (
        <p className="mb-0 shrink-0 text-xs text-muted-foreground">
          Cargando categorías...
        </p>
      )}
      {isError && !isLoading && (
        <p className="mb-0 shrink-0 text-xs text-destructive">
          No se pudieron cargar las categorías
        </p>
      )}
      <Button
        type="button"
        size="sm"
        variant={estadoCategoria === "todo" ? "default" : "ghost"}
        className={`h-7 shrink-0 rounded-lg px-3 ${
          estadoCategoria === "todo"
            ? ""
            : "text-muted-foreground hover:bg-background hover:text-foreground"
        }`}
        aria-pressed={estadoCategoria === "todo"}
        onClick={() => handleFiltrarCategoria(`todo`)}
      >
        Todo
      </Button>

      {categorias.map((categoria) => (
        <Button
          key={categoria.id}
          type="button"
          size="sm"
          variant={
            estadoCategoria === categoria.nombre ? "default" : "ghost"
          }
          className={`h-7 shrink-0 rounded-lg px-3 ${
            estadoCategoria === categoria.nombre
              ? ""
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          }`}
          aria-pressed={estadoCategoria === categoria.nombre}
          onClick={() => handleFiltrarCategoria(`${categoria.nombre}`)}
        >
          {capitalizeFirstLetter(categoria.nombre)}
        </Button>
      ))}

      {!isLoading && !isError && categorias.length === 0 && (
        <p className="mb-0 text-muted-foreground">No hay categorías.</p>
      )}
    </div>
  );
}
