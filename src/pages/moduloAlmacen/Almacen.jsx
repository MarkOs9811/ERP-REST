import { AlmacenList } from "../../components/componenteAlmacen/AlmacenList";

import "../../css/EstilosAlmacen.css";
import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div>
      <Card className="flex py-2">
        <CardHeader className="border-bottom-0 flex justify-between items-center">
          <div className="module-table-toolbar">
            <div className="module-table-title-group">
              <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                Panel de Almacen
              </h4></CardTitle>
              <span className="badge-header">ítems</span>
            </div>

            <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
              <div className="header-search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar en almacen..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="module-table-buttons">
                <Button
                  type="button"
                  className="btn btn-outline-dark px-3 d-inline-flex align-items-center gap-2"
                  onClick={() => GetReporteExcel("/reporteAlmacenTodo")}
                 variant="default">
                  <FileText size={18} />
                  Reporte
                </Button>
                <Button
                  className="btn-principal px-3 d-inline-flex align-items-center gap-2"
                  onClick={() => handleAgregar()}
                 variant="default">
                  <Plus size={18} />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className="overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <AlmacenList search={search} updateList={updateList} />
        </CardContent>
      </Card>
    </div>
  );
}
