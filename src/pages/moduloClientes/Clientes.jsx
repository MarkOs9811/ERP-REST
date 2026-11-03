import { FileText, Plus, Search, X } from "lucide-react";
import { ListaClientes } from "../../components/componenteCliente/ListaClientes";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function Clientes() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
  });

  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: "",
      fechaHasta: "",
    });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const hayFiltrosActivos =
    busqueda || filtros.fechaDesde || filtros.fechaHasta;

  return (
    <Card className="">
      <CardHeader className="flex flex-wrap gap-3 items-center">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">Lista de clientes</h4>
          <p className="text-fw-muted mb-0">
            Aquí puedes ver y gestionar todos tus clientes.
          </p>
        </div>
        <div className="d-flex  gap-2 mt-3 mt-md-0 align-items-center ms-auto">
          <div className="header-search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              className="form-control"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <Button
                className="btn-limpiar-search"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
               variant="default">
                <X size={16} />
              </Button>
            )}
          </div>

          <Button
            className={`btn ${mostrarFiltros ? "btn-info" : "btn-outline-dark"} px-3`}
            title="Filtros de fecha de compra"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
           variant="default">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 6h18M6 12h12M9 18h6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="d-none d-sm-inline">Filtros</span>
          </Button>

          <Button
            className="btn-principal px-3"
            title="Generar Reporte Completo"
            onClick={() => GetReporteExcel("/reporteClientes")}
           variant="default">
            <FileText size={18} />
            <span className="d-none d-sm-inline">Reporte</span>
          </Button>
        </div>
      </CardHeader>

      {mostrarFiltros && (
        <CardHeader
          className="border-t"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 align-items-end">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-bold mb-2">
                Última compra desde:
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={filtros.fechaDesde}
                onChange={(e) =>
                  handleFiltroChange("fechaDesde", e.target.value)
                }
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="form-label small fw-bold mb-2">
                Última compra hasta:
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={filtros.fechaHasta}
                onChange={(e) =>
                  handleFiltroChange("fechaHasta", e.target.value)
                }
              />
            </div>

            {hayFiltrosActivos && (
              <div className="col-12">
                <Button
                  className="btn btn-sm btn-outline-danger"
                  onClick={limpiarFiltros}
                 variant="destructive">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <ListaClientes busqueda={busqueda} filtros={filtros} />
      </CardContent>
    </Card>
  );
}
