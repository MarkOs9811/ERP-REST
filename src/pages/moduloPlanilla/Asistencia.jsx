import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { GraficoEstadoAsistencia } from "../../components/componentePlanillas/componentesAsistencia/GraficoEstadoAsistencia";
import { GraficoAsistenciasMensual } from "../../components/componentePlanillas/componentesAsistencia/GraficoAsistenciasMensual";
import {
  BellRing,
  CalendarCheck,
  ChartColumnBig,
  CircleCheckBig,
  Eye,
  FileText,
  Search,
} from "lucide-react";
import { useState } from "react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ListaAsistencia } from "../../components/componentePlanillas/componentesAsistencia/ListaAsistencias";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Asistencia() {
  const [listAsistencias, setModalListAsistencias] = useState(false);

  const {
    data: listUsuario = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: GetAsistencia,
    retry: (failureCount, err) => {
      return err.response?.status !== 500 && failureCount < 1;
    },
  });
  const totalEmpleados = listUsuario?.totalEmpleados;
  const empleadosAusentes = listUsuario?.empleadosAusentes;
  const empleadosATiempo = listUsuario?.empleadosATiempo;
  const empleadosTardanza = listUsuario?.empleadosTardanza;
  const listaAsistenciaHoy = listUsuario?.listaAsistenciaHoy || [];
  const asistenciaHoy = listUsuario?.asistenciaHoy || [];
  const datosPorMes = listUsuario?.datosPorMes || [];
  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "No se pudieron cargar los datos de asistencia.";

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
              src={`${row.empleado?.empleado?.usuario?.foto_url}`} // Aquí colocas la URL completa a la imagen (puede ser en 'public')
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
                apellidos,
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
    <CondicionCarga
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
    >
      <section className="asistencia-dashboard">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Card 1: Total de empleados */}
          <div className="md:col-span-3 col-sm-6">
            <Card className="card-total h-full">
              <CardContent className="flex justify-between items-center">
                <div className="text-white" style={{ fontSize: "2rem" }}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="text-end">
                  <CardTitle asChild><h6 className="text-white mb-1">
                    Total de empleados
                  </h6></CardTitle>
                  <p className="mb-0 h2 text-white">{totalEmpleados}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 2: Empleados Ausentes */}
          <div className="md:col-span-3 col-sm-6">
            <Card className="card-ausentes h-full">
              <CardContent className="flex justify-between items-center">
                <div className="text-white" style={{ fontSize: "2rem" }}>
                  <FontAwesomeIcon icon={faUserSlash} />
                </div>
                <div className="text-end">
                  <CardTitle asChild><h6 className="text-white mb-1">
                    Empleados Ausentes
                  </h6></CardTitle>
                  <p className="mb-0 h2 text-white">{empleadosAusentes}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Empleados A tiempo */}
          <div className="md:col-span-3 col-sm-6">
            <Card className="card-tiempo h-full">
              <CardContent className="flex justify-between items-center">
                <div className="text-white" style={{ fontSize: "2rem" }}>
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <div className="text-end">
                  <CardTitle asChild><h6 className="text-white mb-1">
                    Empleados A tiempo
                  </h6></CardTitle>
                  <p className="mb-0 h2 text-white">{empleadosATiempo}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 4: Empleados en tardanza */}
          <div className="md:col-span-3 col-sm-6">
            <Card className="card-tardanza h-full">
              <CardContent className="flex justify-between items-center">
                <div className="text-white" style={{ fontSize: "2rem" }}>
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="text-end">
                  <CardTitle asChild><h6 className="text-white mb-1">
                    Empleados en tardanza
                  </h6></CardTitle>
                  <p className="mb-0 h2 text-white">{empleadosTardanza}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-8 col-sm-12">
            <Card className="h-full">
              <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
                <div className="d-flex align-items-center">
                  <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                    Panel de Asistencia
                  </h4></CardTitle>
                  <span className="badge-header ms-2">Hoy</span>
                </div>
                <div className="d-flex align-items-center  gap-2 mt-3 mt-md-0">
                  <div className="header-search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar asistencia..."
                      className="form-control"
                    />
                  </div>
                  <Button
                    className="btn-generico px-3"
                    onClick={() => GetReporteExcel("/reporteAsistenciaHoy")}
                   variant="default">
                    <FileText size={18} />
                    Reporte
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TablasGenerales columns={columnas} data={listaAsistenciaHoy} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 col-sm-12">
            <Card className="h-full">
              <CardHeader className="flex justify-between items-center p-3">
                <p className="h4 mb-0">
                  <ChartColumnBig className="me-2 color-auto" />
                  Gráfico de Asistencias
                </p>
              </CardHeader>
              <CardContent className="h-full">
                <div style={{ height: "100%" }}>
                  <GraficoEstadoAsistencia asistenciaHoy={asistenciaHoy} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-12 col-sm-12">
            <Card className="h-full" style={{ minHeight: "600px" }}>
              <CardHeader className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="h4 mb-0">
                    <CalendarCheck className="me-2 color-auto" />
                    Asistencias Mensual
                  </p>
                </div>
                <div className="ms-auto">
                  <Button
                    className="btn-generico  ms-auto"
                    onClick={() => setModalListAsistencias(true)}
                   variant="default">
                    <Eye className="me-1 text-auto" />
                    Ver Asistencias
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <div style={{ height: "100%" }}>
                  <GraficoAsistenciasMensual datosPorMes={datosPorMes} />
                </div>
              </CardContent>
            </Card>
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
      </section>
    </CondicionCarga>
  );
}
