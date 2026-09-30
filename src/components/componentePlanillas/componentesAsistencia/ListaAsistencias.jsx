import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  Download,
  X,
  FilterX,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";

// TUS ESTILOS
import "../../../css/estilosPlanillas/EstilosListAsistencia.css";

// SERVICIOS
import { GetRegistroAsistencias } from "../../../service/accionesPlanilla/GetRegistroAsistencias";

// COMPONENTES
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { GetReporteExcel } from "../../../service/accionesReutilizables/GetReporteExcel";

// --- HELPERS ---
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export function ListaAsistencia({ onClose }) {
  // --- 1. Estados ---
  // Reemplazamos filtroFecha único por rango
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [isExporting, setIsExporting] = useState(false); // Estado para carga del botón exportar

  // --- 2. Query (Trae toda la data inicial) ---
  const {
    data: listaAsistencia = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["listaAsistencias"],
    queryFn: GetRegistroAsistencias,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // --- 3. Lógica de Filtrado Local (Para la Tabla Visual) ---
  const dataFiltrada = useMemo(() => {
    if (!Array.isArray(listaAsistencia)) return [];

    return listaAsistencia.filter((item) => {
      // A. Filtro Rango de Fechas
      let coincideFecha = true;
      if (fechaInicio && fechaFin) {
        coincideFecha =
          item.fechaEntrada >= fechaInicio && item.fechaEntrada <= fechaFin;
      } else if (fechaInicio) {
        coincideFecha = item.fechaEntrada >= fechaInicio;
      } else if (fechaFin) {
        coincideFecha = item.fechaEntrada <= fechaFin;
      }

      // B. Filtro Estado
      const estadoItem = item.estadoAsistencia
        ? item.estadoAsistencia.toLowerCase()
        : "";
      const coincideEstado =
        filtroEstado === "todos" ? true : estadoItem === filtroEstado;

      // C. Filtro Nombre
      const nombreDB = item.empleado?.nombres || item.empleado?.nombre || "";
      const apellidoDB = item.empleado?.apellidos || "";
      const nombreCompleto = `${nombreDB} ${apellidoDB}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(
        filtroNombre.toLowerCase()
      );

      return coincideFecha && coincideEstado && coincideNombre;
    });
  }, [listaAsistencia, fechaInicio, fechaFin, filtroEstado, filtroNombre]);

  // --- 4. Estadísticas ---
  const stats = useMemo(() => {
    return {
      total: dataFiltrada.length,
      puntuales: dataFiltrada.filter((i) =>
        ["asistio", "puntual"].includes(i.estadoAsistencia?.toLowerCase())
      ).length,
      tardanzas: dataFiltrada.filter(
        (i) => i.estadoAsistencia?.toLowerCase() === "tardanza"
      ).length,
      faltas: dataFiltrada.filter(
        (i) => i.estadoAsistencia?.toLowerCase() === "falta"
      ).length,
    };
  }, [dataFiltrada]);

  // --- 5. Manejador de Exportación Excel ---
  const handleExportarExcel = async () => {
    setIsExporting(true);
    try {
      const endpoint = "/reporte/AsistenciaPersonalizada";

      await GetReporteExcel(endpoint, fechaInicio, fechaFin);
    } catch (error) {
      console.error("Error exportando:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // --- 6. Limpiar Filtros ---
  const handleLimpiar = () => {
    setFechaInicio("");
    setFechaFin("");
    setFiltroEstado("todos");
    setFiltroNombre("");
  };

  // --- 7. Columnas ---
  const columnas = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "60px" },
    {
      name: "Empleado",
      selector: (row) =>
        `${row.empleado?.nombre || "Sin"} ${
          row.empleado?.apellidos || "Nombre"
        }`,
      sortable: true,
      grow: 2,
      wrap: true,
      cell: (row) => (
        <div style={{ fontWeight: 500, color: "var(--text-main)" }}>
          {row.empleado?.nombres || row.empleado?.nombre || "Sin"}{" "}
          {row.empleado?.apellidos || "Nombre"}
        </div>
      ),
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaEntrada,
      format: (row) => formatDate(row.fechaEntrada),
      sortable: true,
      width: "110px",
    },
    {
      name: "H. Entrada",
      selector: (row) => row.horaEntrada,
      sortable: true,
      center: true,
    },
    {
      name: "H. Salida",
      selector: (row) => row.horaSalida || "--:--",
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estadoAsistencia,
      sortable: true,
      center: true,
      cell: (row) => {
        const estado = row.estadoAsistencia?.toLowerCase() || "";
        let styleClass = "badge-modern-default";
        let IconComponent = null;

        if (estado === "tardanza") {
          styleClass = "badge-modern-warning";
          IconComponent = Clock;
        } else if (estado === "falta") {
          styleClass = "badge-modern-danger";
          IconComponent = AlertCircle;
        } else if (["asistio", "puntual"].includes(estado)) {
          styleClass = "badge-modern-success";
          IconComponent = CheckCircle2;
        }

        return (
          <span className={`badge-modern ${styleClass}`}>
            {IconComponent && (
              <IconComponent
                size={12}
                strokeWidth={3}
                style={{ marginRight: 4 }}
              />
            )}
            {row.estadoAsistencia
              ? row.estadoAsistencia.charAt(0).toUpperCase() +
                row.estadoAsistencia.slice(1)
              : "N/A"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="modern-card rounded-0">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center p-3 ">
        <h6 className="m-0 fw-bold d-flex align-items-center gap-2">
          <CalendarCheck size={20} /> Gestión de Asistencias
        </h6>
        <button
          className="btn-principal"
          onClick={() => refetch()}
          title="Recargar datos"
        >
          <RefreshCw size={16} className={isRefetching ? "spin-anim" : ""} />
          <span>{isRefetching ? "Cargando..." : "Actualizar"}</span>
        </button>
      </div>

      <div className="card-body p-4 border-0 ">
        {/* BARRA DE FILTROS */}
        <div className="row g-2 mb-4">
          {/* Buscador Nombre */}
          <div className="col-12 col-md-3">
            <div className="input-group">
              <span className="input-group-text input-group-text-custom">
                {" "}
                <Search size={16} />{" "}
              </span>
              <input
                type="text"
                className="form-control modern-input border-start-0 ps-0"
                placeholder="Buscar empleado..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </div>
          </div>

          {/* Rango de Fechas (Inicio - Fin) */}
          <div className="col-12 col-md-5">
            <div
              className="d-flex align-items-center gap-1 bg-white border rounded px-2 py-1"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div>
                <CalendarDays size={16} className="text-muted" />
              </div>
              <input
                type="date"
                className="form-control border-0 p-1 shadow-none"
                style={{ fontSize: "0.875rem", color: "var(--text-main)" }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                title="Fecha Inicio"
              />
              <div className="">
                <ArrowRight size={16} className="text-muted" />
              </div>
              <input
                type="date"
                className="form-control border-0 p-1 shadow-none"
                style={{ fontSize: "0.875rem", color: "var(--text-main)" }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                title="Fecha Fin"
              />
            </div>
          </div>

          {/* Filtro Estado */}
          <div className="col-6 col-md-2">
            <select
              className="form-select modern-input"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="asistio">Puntuales</option>
              <option value="tardanza">Tardanzas</option>
              <option value="falta">Faltas</option>
            </select>
          </div>

          {/* Botón Limpiar */}
          <div className="col-6 col-md-2">
            <button
              className="btn-modern btn-outline w-100"
              onClick={handleLimpiar}
            >
              <FilterX size={16} /> Limpiar
            </button>
          </div>
        </div>

        {/* DASHBOARD DE ESTADÍSTICAS */}
        {dataFiltrada.length > 0 && (
          <div className="d-flex flex-wrap gap-3 mb-4">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div
              className="stat-item"
              style={{
                background: "var(--success-bg)",
                borderColor: "transparent",
              }}
            >
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-success fw-bold">
                {stats.puntuales} Puntuales
              </span>
            </div>
            <div
              className="stat-item"
              style={{
                background: "var(--warning-bg)",
                borderColor: "transparent",
              }}
            >
              <Clock size={16} style={{ color: "#9a3412" }} />
              <span style={{ color: "#9a3412", fontWeight: "bold" }}>
                {stats.tardanzas} Tardanzas
              </span>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div className="border rounded-3 overflow-hidden shadow-sm bg-white">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <TablasGenerales
              columnas={columnas}
              datos={dataFiltrada}
              pagination
              paginationPerPage={10}
              highlightOnHover
              dense
              fixedHeader
              fixedHeaderScrollHeight="400px"
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: "var(--bg-soft)",
                    color: "var(--text-muted)",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                  },
                },
                cells: {
                  style: {
                    fontSize: "0.875rem",
                    color: "var(--text-main)",
                    padding: "12px",
                  },
                },
              }}
              noDataComponent={
                <div className="p-5 text-center text-muted d-flex flex-column align-items-center">
                  <Search size={40} className="mb-2 opacity-25" />
                  <p className="m-0">No se encontraron registros</p>
                </div>
              }
            />
          </CondicionCarga>
        </div>
      </div>

      {/* FOOTER */}
      <div className="card-footer p-3 d-flex justify-content-between align-items-center border-0 ">
        {/* BOTÓN EXCEL CONECTADO AL SERVICIO */}
        <BotonMotionGeneral
          text="Exportar Excel"
          onClick={handleExportarExcel} // <--- Llama al handler que usa GetReporteExcel
          loading={isExporting} // <--- Muestra loading mientras descarga
          icon={<Download size={18} />}
          classDefault="btn-modern btn-excel text-center align-items-center gap-1 p-2 w-auto me-auto"
        />

        <button className="btn-cerrar-modal w-auto" onClick={onClose}>
          <X size={18} /> Cerrar Vista
        </button>
      </div>
    </div>
  );
}
