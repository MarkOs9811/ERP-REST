import { useState } from "react";
import DataTable from "react-data-table-component"; // <--- IMPORTANTE
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import {
  FileChartColumnIncreasing,
  MessageCircleQuestionMark,
  UserRoundCheck,
  CalendarDays,
  DollarSign,
  Users,
  AlertCircle,
  FileText, // Icono para ver boleta
  Search,
  Eye,
  CheckCircle,
  Clock, // Icono lupa
} from "lucide-react";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
import ModalGeneral from "../../components/componenteToast/ModalGeneral";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ValidarNomina } from "../../components/componentePlanillas/componentesAjustesPlanilla/ValidarNomina";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { GetNomina } from "../../service/accionesPlanilla/GetNomina";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { BadgeComponent } from "../../components/componentesReutilizables/BadgeComponent";

// ... (Aquí pegas la constante 'columns' que definimos arriba)

export function Nomina() {
  const [modalQuestionPagar, setModalQuestionPagar] = useState(false);
  const [ModalValidarNomina, setModalValidarNomina] = useState(false);
  const [filterText, setFilterText] = useState(""); // Filtro local para la tabla
  const navigate = useNavigate();
  // Periodo actual
  const [periodo, setPeriodo] = useState(new Date().toISOString().slice(0, 7));

  const {
    data: nominaData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["nomina", periodo],
    queryFn: () => GetNomina(periodo),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Lógica de filtrado local para la tabla
  const filteredItems =
    nominaData?.detalles?.filter(
      (item) =>
        item.nombre_completo &&
        item.nombre_completo.toLowerCase().includes(filterText.toLowerCase())
    ) || [];

  const generarPago = async () => {
    try {
      const response = await axiosInstance.post("/nomina/generarPago", {
        periodo,
      });
      if (response.data.success) {
        ToastAlert("success", "El pago se ha generado correctamente.");
        setModalQuestionPagar(false);
        refetch();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Error al generar el pago";
      ToastAlert("error", msg);
    }
  };
  // Definición de columnas para la tabla de nómina
  const columns = [
    {
      name: "Colaborador",
      selector: (row) => row.nombre_completo,
      sortable: true,
      wrap: true,
      grow: 2,
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.nombre_completo}</div>
          <small className="text-muted">{row.cargo}</small>
        </div>
      ),
    },
    {
      name: "Sueldo Base",
      selector: (row) => row.sueldo_base,
      sortable: true,
      right: true, // Alinear números a la derecha
      cell: (row) => <span>S/ {parseFloat(row.sueldo_base).toFixed(2)}</span>,
    },
    {
      name: "Bonif. / Extras",
      selector: (row) => row.total_bonificaciones,
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="text-success">
          + S/ {parseFloat(row.total_bonificaciones || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Descuentos",
      selector: (row) => row.total_descuentos,
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="text-danger">
          - S/ {parseFloat(row.total_descuentos || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Neto a Pagar",
      selector: (row) => row.neto_pagar,
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="fw-bold text-dark">
          S/ {parseFloat(row.neto_pagar).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Estado",
      center: true,
      cell: (row) => {
        return (
          <BadgeComponent
            label={row.estado_pago || "Pendiente"}
            // Opcional: Si quieres iconos dinámicos
            icon={row.estado_pago === "PAGADO" ? <CheckCircle /> : <Clock />}
          />
        );
      },
    },
    {
      name: "Acciones",
      button: true,
      cell: (row) => (
        <button
          className="btn-principal"
          title="Ver Boleta de Pago"
          onClick={() => console.log("Ver boleta de:", row.id)} // Aquí iría tu función para abrir modal de boleta
        >
          <FileText size={18} />
        </button>
      ),
    },
  ];
  return (
    <div>
      {/* Contenedor principal sin padding extra para alinearse con el layout */}
      <div className="d-flex flex-column gap-3">
        {/* HEADER Y TARJETAS (Resumen Macro) */}
        <div className="card p-3 shadow-sm border-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="titulo-card-especial mb-1">Gestión de Nómina</h4>
              <p className="text-muted small mb-0">
                Periodo: <span className="fw-bold text-dark">{periodo}</span>
              </p>
            </div>

            {/* Selector de Fecha */}
            <div className="d-flex gap-2">
              <div className="d-flex gap-2 align-items-center bg-white px-3 rounded border">
                <CalendarDays size={20} className="text-danger" />
                <input
                  type="month"
                  className="form-control border-0 p-1 bg-transparent"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    cursor: "pointer",
                  }}
                />
              </div>
              <button
                className="btn-principal"
                onClick={() => navigate("/rrhh/ajustes")}
              >
                <Eye size={16} className="mx-2" /> Ver todos los periodos
              </button>
            </div>
          </div>

          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="row g-3">
              {/* Tarjetas de Resumen (Usan nominaData?.resumen) */}
              <div className="col-md-4">
                <div className="card  border h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="bg-white p-3 rounded-circle text-danger me-3 shadow-sm">
                      <Users size={24} />
                    </div>
                    <div>
                      <h6 className="text-muted small mb-1">Empleados</h6>
                      <h3 className="mb-0 fw-bold">
                        {nominaData?.resumen?.totalEmpleados || 0}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card  border h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="bg-white p-3 rounded-circle text-dark me-3 shadow-sm">
                      <span className="h5 fw-bold">S/. </span>
                    </div>
                    <div>
                      <h6 className="text-muted small mb-1">Total Nómina</h6>
                      <h3 className="mb-0 fw-bold">
                        S/ {nominaData?.resumen?.totalPagar || "0.00"}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className={`card border-0 h-100 ${
                    nominaData?.resumen?.estado === "PAGADO"
                      ? "bg-success text-white"
                      : "bg-warning bg-opacity-10"
                  }`}
                >
                  <div className="card-body d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3 bg-white bg-opacity-25">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h6 className="small mb-1 opacity-75">Estado</h6>
                      <span className="mb-0 fw-bold h3">
                        {nominaData?.resumen?.estado || "PENDIENTE"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CondicionCarga>
        </div>

        {/* TABLA DE DETALLE (Vista Micro) */}
        <div className="card p-0 shadow-sm border-0 py-2">
          {/* Cabecera de la tabla con Buscador y Botones */}
          <div className="card-header d-flex justify-content-between align-items-center mb-3">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar empleado..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <BotonMotionGeneral
                text="Reporte"
                onClick={() =>
                  GetReporteExcel(`/reporteNomina?periodo=${periodo}`)
                }
                icon={<FileChartColumnIncreasing size={16} />}
                classDefault=" text-center align-items-center gap-1 p-2 w-auto rounded-3 border shadow-sm ms-auto"
              />

              {/* Botones de acción principales */}
              <BotonMotionGeneral
                text="Validar periodo"
                onClick={() => setModalValidarNomina(true)}
                icon={<UserRoundCheck size={16} />}
                classDefault=" text-center align-items-center gap-1 p-2 w-auto rounded-3 border shadow-sm ms-auto"
              />
            </div>
          </div>
          <div className="card-body p-0">
            {/* Tabla React Data Table */}
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <TablasGenerales columnas={columns} datos={filteredItems} />
            </CondicionCarga>
          </div>
        </div>

        {/* --- MODALES (Igual que antes) --- */}
        <ModalRight
          isOpen={ModalValidarNomina}
          onClose={() => setModalValidarNomina(false)}
          title={"Validación de Nómina"}
          subtitulo={`Revisión de incidencias para ${periodo}`}
          hideFooter={true}
          width="60%"
        >
          {({ handleClose }) => (
            <ValidarNomina onClose={handleClose} periodo={periodo} />
          )}
        </ModalRight>

        <ModalGeneral
          show={modalQuestionPagar}
          handleCloseModal={() => setModalQuestionPagar(false)}
          mensaje={`¿Confirmar pago de planilla del periodo ${periodo}?`}
          handleAccion={generarPago}
          titulo="Confirmar Procesamiento"
        >
          {/* Contenido del modal igual que antes... */}
          <div className="text-center py-3">
            <p>Esta acción cerrará el mes y generará boletas.</p>
          </div>
        </ModalGeneral>
      </div>
    </div>
  );
}
