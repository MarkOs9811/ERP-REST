import { FileText, Plus, Search, X } from "lucide-react";
import { ListaClientes } from "../../components/componenteCliente/ListaClientes";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { useState } from "react";

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
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-3 align-items-center">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">Lista de clientes</h4>
          <p className="text-fw-muted mb-0">
            Aquí puedes ver y gestionar todos tus clientes.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
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
              <button
                className="btn-limpiar-search"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className={`btn ${mostrarFiltros ? "btn-outline-primary" : "btn-outline-dark"} px-3`}
            title="Filtros de fecha de compra"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
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
          </button>

          <button
            className="btn btn-outline-dark px-3"
            title="Generar Reporte Completo"
            onClick={() => GetReporteExcel("/reporteClientes")}
          >
            <FileText size={18} />
            <span className="d-none d-sm-inline">Reporte</span>
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div
          className="card-header border-top"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="row g-3 align-items-end">
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
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card-body p-0">
        <ListaClientes busqueda={busqueda} filtros={filtros} />
      </div>
    </div>
  );
}
