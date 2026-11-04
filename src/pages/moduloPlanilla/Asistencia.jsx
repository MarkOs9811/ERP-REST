import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faIdCard,
  faUserCheck,
  faUsers,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useQuery } from "@tanstack/react-query";
import { GetAsistencia } from "../../service/GetAsistencia";
// import DataTable from "react-data-table-component";
// import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
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
import { Input } from "@/components/ui/input";

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
            <span className="font-bold" style={{ color: "#444f53" }}>
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
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-colors bg-success-gradient font-bold">
              <CircleCheckBig /> A tiempo
            </div>
          );
        } else if (row?.estadoAsistencia === "tardanza") {
          return (
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-colors bg-danger-gradient font-bold">
              {" "}
              <BellRing /> Tardanza
            </div>
          );
        } else {
          return (
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary-gradient">
              Sin registro
            </div>
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
        <div className="grid grid-cols-12 gap-3">
          {/* Card 1: Total de empleados */}
          <div className="col-span-full md:col-span-3 sm:col-span-6">
            <Card className="h-full border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-card text-indigo-900 shadow-lg shadow-indigo-500/10 ring-1 ring-inset ring-indigo-500/10 dark:from-indigo-500/20 dark:via-sky-500/10 dark:text-indigo-100">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-2xl text-indigo-700 dark:text-indigo-300">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="text-right">
                  <CardTitle asChild>
                    <h6 className="mb-1 text-sm font-medium text-indigo-800 dark:text-indigo-200">
                      Total de empleados
                    </h6>
                  </CardTitle>
                  <p className="mb-0 text-2xl font-semibold text-indigo-950 dark:text-indigo-100">
                    {totalEmpleados}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 2: Empleados Ausentes */}
          <div className="col-span-full md:col-span-3 sm:col-span-6">
            <Card className="h-full border-rose-500/20 bg-gradient-to-br from-rose-500/15 via-orange-400/10 to-card text-rose-900 shadow-lg shadow-rose-500/10 ring-1 ring-inset ring-rose-500/10 dark:from-rose-500/20 dark:via-orange-400/10 dark:text-rose-100">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-2xl text-rose-700 dark:text-rose-300">
                  <FontAwesomeIcon icon={faUserSlash} />
                </div>
                <div className="text-right">
                  <CardTitle asChild>
                    <h6 className="mb-1 text-sm font-medium text-rose-800 dark:text-rose-200">
                      Empleados Ausentes
                    </h6>
                  </CardTitle>
                  <p className="mb-0 text-2xl font-semibold text-rose-950 dark:text-rose-100">
                    {empleadosAusentes}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Empleados A tiempo */}
          <div className="col-span-full md:col-span-3 sm:col-span-6">
            <Card className="h-full border-teal-500/20 bg-gradient-to-br from-teal-500/15 via-emerald-400/10 to-card text-teal-900 shadow-lg shadow-teal-500/10 ring-1 ring-inset ring-teal-500/10 dark:from-teal-500/20 dark:via-emerald-400/10 dark:text-teal-100">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-2xl text-teal-700 dark:text-teal-300">
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <div className="text-right">
                  <CardTitle asChild>
                    <h6 className="mb-1 text-sm font-medium text-teal-800 dark:text-teal-200">
                      Empleados A tiempo
                    </h6>
                  </CardTitle>
                  <p className="mb-0 text-2xl font-semibold text-teal-950 dark:text-teal-100">
                    {empleadosATiempo}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card 4: Empleados en tardanza */}
          <div className="col-span-full md:col-span-3 sm:col-span-6">
            <Card className="h-full border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-fuchsia-400/10 to-card text-violet-900 shadow-lg shadow-violet-500/10 ring-1 ring-inset ring-violet-500/10 dark:from-violet-500/20 dark:via-fuchsia-400/10 dark:text-violet-100">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-2xl text-violet-700 dark:text-violet-300">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="text-right">
                  <CardTitle asChild>
                    <h6 className="mb-1 text-sm font-medium text-violet-800 dark:text-violet-200">
                      Empleados en tardanza
                    </h6>
                  </CardTitle>
                  <p className="mb-0 text-2xl font-semibold text-violet-950 dark:text-violet-100">
                    {empleadosTardanza}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-8 col-span-full">
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 h-full">
              <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <CardTitle asChild>
                    <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                      Panel de Asistencia
                    </h4>
                  </CardTitle>
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Hoy</span>
                </div>
                <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="relative w-full min-w-0 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar asistencia..."
                      className="h-9 pl-9"
                    />
                  </div>
                  <Button
                    size="lg"
                    variant="ghostOutline"
                    className="w-full gap-2 px-3 sm:w-auto"
                    onClick={() => GetReporteExcel("/reporteAsistenciaHoy")}
                  >
                    <FileText size={18} />
                    Reporte
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TablasGenerales
                  columnas={columnas}
                  datos={listaAsistenciaHoy}
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 col-span-full">
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

          <div className="md:col-span-12 col-span-full">
            <Card className="h-full" style={{ minHeight: "600px" }}>
              <CardHeader className="p-3">
                <div className="flex justify-between items-center">
                  <p className="h4 mb-0">
                    <CalendarCheck className="me-2 color-auto" />
                    Asistencias Mensual
                  </p>
                </div>
                <div className="ms-auto">
                  <Button
                    className="btn-generico ms-auto"
                    onClick={() => setModalListAsistencias(true)}
                    variant="default"
                  >
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
