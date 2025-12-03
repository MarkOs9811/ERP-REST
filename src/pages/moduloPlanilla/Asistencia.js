import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import {
  faClock,
  faIdCard,
  faUserCheck,
  faUsers,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/EstilosAsistencia.css";

import { useQuery } from "@tanstack/react-query";
import { GetAsistencia } from "../../service/GetAsistencia";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { wrap } from "framer-motion";
import { GraficoEstadoAsistencia } from "../../components/componentePlanillas/componentesAsistencia/GraficoEstadoAsistencia";
import { GraficoAsistenciasMensual } from "../../components/componentePlanillas/componentesAsistencia/GraficoAsistenciasMensual";
import {
  BellRing,
  CalendarCheck,
  ChartColumnBig,
  CircleCheckBig,
  Eye,
  FileText,
} from "lucide-react";
import { useState } from "react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ListaAsistencia } from "../../components/componentePlanillas/componentesAsistencia/ListaAsistencias";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";

export function Asistencia() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados
  const [listAsistencias, setModalListAsistencias] = useState(false);

  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: (row) => {
        const index = row.id % rowColors.length; // Alterna colores según el ID
        return {
          borderLeftColor: rowColors[index],
        };
      },
    },
  ];
  const {
    data: listUsuario = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: GetAsistencia,
    retry: (failureCount, error) => {
      // Solo reintentar si no es error 500
      return error.response?.status !== 500 && failureCount < 1;
    },
    retry: 1,
  });

  const totalEmpleados = listUsuario?.totalEmpleados;
  const empleadosAusentes = listUsuario?.empleadosAusentes;
  const empleadosATiempo = listUsuario?.empleadosATiempo;
  const empleadosTardanza = listUsuario?.empleadosTardanza;
  const listaAsistenciaHoy = listUsuario?.listaAsistenciaHoy;
  const asistenciaHoy = listUsuario?.asistenciaHoy || [];
  const datosPorMes = listUsuario?.datosPorMes || [];

  const columnas = [
    {
      name: "ID",
      grow: 0,
      selector: (row) => row.id,
      wrap: true,
      center: false,
    },
    {
      name: "Foto",
      grow: 0,
      selector: (row) =>
        row.empleado?.empleado?.usuario?.fotoPerfil || "No disponible",
      sortable: true,
      wrap: true,
      center: true,
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {row.empleado?.empleado?.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row.empleado?.empleado?.usuario?.fotoPerfil}`} // Aquí colocas la URL completa a la imagen (puede ser en 'public')
              alt="Foto de perfil"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid silver",
              }} // Ajusta el tamaño y el estilo
            />
          ) : (
            <span>No disponible</span> // Si no hay foto, muestra este texto
          )}
        </div>
      ),
    },
    {
      name: "Información",

      cell: (row) => {
        const nombre = row.empleado?.nombre?.toLowerCase() || "";
        const apellidos = row.empleado?.apellidos?.toLowerCase() || "";

        return (
          <div>
            <div style={{ marginBottom: "4px" }}>
              {`${capitalizeFirstLetter(nombre)} ${capitalizeFirstLetter(
                apellidos
              )}`.trim()}
            </div>
          </div>
        );
      },
    },
    {
      name: "Documento",
      width: "160px", // Ancho fijo adecuado para documentos
      cell: (row) => {
        const documento = row.empleado?.documento_identidad || "Sin documento";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 0",
            }}
          >
            <FontAwesomeIcon
              icon={faIdCard} // Icono de documento de identidad
              style={{
                color: "#444f53",
                fontSize: "1.1em",
                opacity: 0.8,
              }}
            />
            <span className="fw-bold" style={{ color: "#444f53" }}>
              {documento}
            </span>
          </div>
        );
      },
    },
    {
      name: "Estado",
      wrap: true,
      center: true,
      cell: (row) => {
        if (row?.estadoAsistencia === "a tiempo") {
          return (
            <div className="badge bg-success-gradient fw-bold">
              <CircleCheckBig /> A tiempo
            </div>
          );
        } else if (row?.estadoAsistencia === "tardanza") {
          return (
            <div className="badge bg-danger-gradient fw-bold">
              {" "}
              <BellRing /> Tardanza
            </div>
          );
        } else {
          return (
            <div className="badge bg-secondary-gradient">Sin registro</div>
          );
        }
      },
    },
  ];
  return (
    <div>
      <div className="row g-3">
        {/* Card 1: Total de empleados */}
        <div className="col-md-3 col-sm-6 ">
          <div className="card card-total shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="text-white" style={{ fontSize: "2rem" }}>
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="text-end">
                <h6 className="card-title text-white mb-1">
                  Total de empleados
                </h6>
                <p className="mb-0 h2 text-white">{totalEmpleados}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Empleados Ausentes */}
        <div className="col-md-3 col-sm-6 ">
          <div className="card card-ausentes shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="text-white" style={{ fontSize: "2rem" }}>
                <FontAwesomeIcon icon={faUserSlash} />
              </div>
              <div className="text-end">
                <h6 className="card-title text-white mb-1">
                  Empleados Ausentes
                </h6>
                <p className="mb-0 h2 text-white">{empleadosAusentes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Empleados A tiempo */}
        <div className="col-md-3 col-sm-6 ">
          <div className="card card-tiempo shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="text-white" style={{ fontSize: "2rem" }}>
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <div className="text-end">
                <h6 className="card-title text-white mb-1">
                  Empleados A tiempo
                </h6>
                <p className="mb-0 h2 text-white">{empleadosATiempo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Empleados en tardanza */}
        <div className="col-md-3 col-sm-6 ">
          <div className="card card-tardanza shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="text-white" style={{ fontSize: "2rem" }}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="text-end">
                <h6 className="card-title text-white mb-1">
                  Empleados en tardanza
                </h6>
                <p className="mb-0 h2 text-white">{empleadosTardanza}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resto de tu código... */}
        <div className="col-md-8 col-sm-12">
          <div className="card shadow-sm h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3">
              <p className="h4 mb-0">
                <CalendarCheck className="me-2 color-auto" />
                Asistencia de hoy
              </p>
              <div className="d-flex ms-auto mx-2">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="form-control"
                />
              </div>
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => GetReporteExcel("/reporteAsistenciaHoy")}
              >
                <FileText className="me-1 text-auto" />
                Reporte
              </button>
            </div>
            <div className="card-body p-0">
              <DataTable
                className="tablaGeneral"
                columns={columnas}
                data={listaAsistenciaHoy}
                pagination
                responsive
                dense
                fixedHeader
                customStyles={customDataTableStyles}
                fixedHeaderScrollHeight="100vh"
                striped={true}
                conditionalRowStyles={conditionalRowStyles}
                //selectableRows={true} //con este se activa un check  porc ada fila selccionble
                //selectableRowsHighlight={true} //resaltar la fila selecionada

                // onRowClicked={(row) => console.log(row)} para ejecutar cuandos e hace click en cada fila
                paginationComponentOptions={{
                  rowsPerPageText: "Filas por página:",
                  rangeSeparatorText: "de",
                  selectAllRowsItem: true,
                  selectAllRowsItemText: "Todos",
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-12">
          <div className="card shadow-sm h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3">
              <p className="h4 mb-0">
                <ChartColumnBig className="me-2 color-auto" />
                Gráfico de Asistencias
              </p>
            </div>
            <div className="card-body h-100">
              <div style={{ height: "100%" }}>
                <GraficoEstadoAsistencia asistenciaHoy={asistenciaHoy} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-sm-12">
          <div className="card shadow-sm  h-100" style={{ minHeight: "600px" }}>
            <div className="card-header p-3">
              <div className="d-flex justify-content-between align-items-center">
                <p className="h4 mb-0">
                  <CalendarCheck className="me-2 color-auto" />
                  Asistencias Mensual
                </p>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setModalListAsistencias(true)}
                  >
                    <Eye className="me-1 text-auto" />
                    Ver Asistencias
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body h-100">
              <div style={{ height: "100%" }}>
                <GraficoAsistenciasMensual datosPorMes={datosPorMes} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalRight
        isOpen={listAsistencias}
        onClose={() => setModalListAsistencias(false)}
        title={"Lista de Asistencias"}
        width="70%"
        hideFooter={true}
      >
        {({ handleClose }) => <ListaAsistencia onClose={handleClose} />}
      </ModalRight>
    </div>
  );
}
