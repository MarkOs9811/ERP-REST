import { useState, useCallback } from "react";
import Categorias from "../../components/componenteAlmacen/componentesAjustesAlmacen/Categorias";
import UnidadMedida from "../../components/componenteAlmacen/componentesAjustesAlmacen/UnidadMedida";

export function AjustesAlmacen() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Producto", estado: 1 },
    { id: 2, nombre: "Tecnologia", estado: 0 },
    { id: 3, nombre: "Ropa", estado: 1 },
    { id: 4, nombre: "Desechables", estado: 0 },
  ]);

  const [unidades, setUnidades] = useState([
    { id: 1, nombre: "Unidad", estado: 1 },
    { id: 2, nombre: "Docena", estado: 0 },
    { id: 3, nombre: "Caja", estado: 1 },
    { id: 4, nombre: "Sixpack", estado: 0 },
  ]);

  const toggleCategoria = useCallback((id) => {
    setCategorias((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, estado: cat.estado === 1 ? 0 : 1 } : cat
      )
    );
  }, []);

  const toggleUnidad = useCallback((id) => {
    setUnidades((prev) =>
      prev.map((unidad) =>
        unidad.id === id
          ? { ...unidad, estado: unidad.estado === 1 ? 0 : 1 }
          : unidad
      )
    );
  }, []);

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="card shadow-sm ">
            <div className="card-header border-bottom">
              <h4>Configuración de Almacén</h4>
            </div>
            <div className="card-body mb-4">
              <div className="row g-3">
                <div className="col-lg-6">
                  <Categorias
                    categorias={categorias}
                    onToggle={toggleCategoria}
                  />
                </div>
                <div className="col-lg-6">
                  <UnidadMedida unidades={unidades} onToggle={toggleUnidad} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
