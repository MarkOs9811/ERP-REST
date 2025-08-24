import { AlmacenList } from "../../components/componenteAlmacen/AlmacenList";

import "../../css/EstilosAlmacen.css";
import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { Plus } from "lucide-react";
import { useState } from "react";
export function Almacen() {
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setUpdateList((prev) => !prev);
  };
  const handleAgregar = () => {
    navigate("/almacen/registro");
  };
  return (
    <ContenedorPrincipal>
      <div className="card shadow-sm my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0 rounded">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <div className="m-2">
            <h4 className="card-title mb-0 titulo-card-especial">Almacen</h4>
          </div>

          <div className="d-flex align-items-center">
            <div className="d-flex">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn ms-2 btn-outline-dark"
                onClick={() => handleAgregar()}
              >
                <Plus className="color-auto" />
              </button>
            </div>
          </div>
        </div>
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <AlmacenList search={search} updateList={updateList} />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
