import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetVacaciones } from "../../service/GetVacaciones";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormularioVacaciones } from "../../components/componentePlanillas/componenteVacaciones/FormularioVacaciones";
import { GetUsuarios } from "../../service/GetUsuarios";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FileText, Pencil, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { FormularioVenderDias } from "../../components/componentePlanillas/componenteVacaciones/FormularioVenderDias";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";

export function Vacaciones() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVender, setModalVender] = useState(false);
  const [vacacionesId, setVacacionesId] = useState([]); // Estado para almacenar el ID de las vacaciones seleccionadas
  const {
    data: vacacionesList,
    onLoading,
    onError,
  } = useQuery({
    queryKey: ["vacaciones"],
    queryFn: GetVacaciones,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    control: controlAgregar, // Renombrado
    handleSubmit: handleSubmitAgregar, // Renombrado
    setValue: setValueAgregar,
    watch: watchAgregar,
    reset: resetAgregar,
    formState: { errors: errorsAgregar }, // Renombrado
  } = useForm({
    defaultValues: {
      empleados: [],
      fechaInicio: "",
      fechaFin: "",
      diasTotales: "",
      observaciones: "",
      // ¡Ya no hay 'diasVender' aquí!
    },
  });

  // --- useForm para VENDER VACACIONES ---
  const {
    handleSubmit: handleSubmitVender, // Renombrado
    register: registerVender, // Renombrado
    reset: resetVender, // Renombrado
    formState: { errors: errorsVender }, // Renombrado
  } = useForm({
    defaultValues: {
      diasVender: "",
      // ¡Solo los campos de este formulario!
    },
  });

  const datosFiltradosVacaciones = useMemo(() => {
    if (!vacacionesList) {
      return [];
    }
    const termino = filtro.toLowerCase();
    if (termino === "") {
      return vacacionesList;
    }

    return vacacionesList.filter((datoVac) => {
      const nombre = (
        datoVac?.usuario?.empleado?.persona?.nombre || ""
      ).toLowerCase();
      const apellidos = (
        datoVac?.usuario?.empleado?.persona?.apellidos || ""
      ).toLowerCase();

      const documento = (
        datoVac?.usuario?.empelado?.persona?.documento_identidad || ""
      ).toLowerCase();

      const fechaInicio = (datoVac.fecha_inicio || "").toLowerCase();
      const fechaFin = (datoVac.fecha_fin || "").toLowerCase();
      return (
        nombre.includes(termino) ||
        apellidos.includes(termino) ||
        documento.includes(termino) ||
        fechaInicio.includes(termino) ||
        fechaFin.includes(termino)
      );
    });
  }, [vacacionesList, filtro]);

  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryFn: GetUsuarios,
    queryKey: ["usuarios"],
    refetchOnWindowFocus: false,
  });

  const empleadosSeleccionados = watchAgregar("empleados");
  const handleUsuarioSelect = (event) => {
    const usuarioId = parseInt(event.target.value);
    const usuario = usuarios.find((u) => u.id === usuarioId);

    // Verificar si el usuario ya está en la lista
    if (!empleadosSeleccionados.some((u) => u.id === usuarioId)) {
      setValueAgregar("empleados", [...empleadosSeleccionados, usuario]); // Agregar el usuario al array
    }
  };
  const removeUsuario = (usuarioId) => {
    console.log("Antes de eliminar:", empleadosSeleccionados);
    setValueAgregar(
      "empleados",
      empleadosSeleccionados.filter((usuario) => usuario.id !== usuarioId)
    );
  };

  const calcularDiasTotales = () => {
    const fechaInicio = new Date(watchAgregar("fechaInicio"));
    const fechaFin = new Date(watchAgregar("fechaFin"));

    if (fechaInicio && fechaFin && fechaFin >= fechaInicio) {
      const diferencia = Math.ceil(
        (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
      );
      setValueAgregar("diasTotales", diferencia + 1); // Incluye el día de inicio
    } else {
      setValueAgregar("diasTotales", 0);
    }
  };

  const onSubmitStoreVacaciones = async (data) => {
    try {
      const payload = {
        empleados: data.empleados.map((empleado) => empleado.id), // Solo enviar los IDs de los empleados
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        diasTotales: data.diasTotales,
        observaciones: data.observaciones,
      };
      // Enviar la solicitud POST
      const response = await axiosInstance.post("/vacaciones", payload);

      // Manejo de la respuesta
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["vacaciones"]); // Refrescar los datos
        resetAgregar(); // Reiniciar el formulario
        setIsModalOpen(false); // Cerrar el modal
      }
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || // Mensaje de la API (ej. "Errores de validación")
          error.message || // Mensaje de red (ej. "Network Error")
          "Ocurrió un error inesperado" // Mensaje por defecto
      );
    }
  };

  const onSubmitVenderDias = async (data) => {
    try {
      const payload = {
        id: vacacionesId.id, // ID de las vacaciones seleccionadas
        diasVender: data.diasVender, // Días a vender
      };
      const response = await axiosInstance.post(
        "/vacaciones/venderDias",
        payload
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["vacaciones"]); // Refrescar los datos
        setModalVender(false); // Cerrar el modal
        resetVender();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", `Error en la solicitud: ${error.message}`);
    }
  };

  if (onLoading) {
    return (
      <div>
        <Cargando />
      </div>
    );
  }

  if (onError) {
    return <div>Error al cargar los datos</div>;
  }

  const eliminarVacaciones = (id) => {
    console.log(`Eliminar vacaciones con ID: ${id}`);
  };

  const columnas = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "80px", // Un poco más angosto, 100px es mucho para un ID
      sortable: true,
      grow: 0, // No debe crecer
      center: true,
    },
    {
      name: "Empleado",
      cell: (row) => (
        <div className="d-flex flex-column align-items-start text-left py-2">
          <div>
            {capitalizeFirstLetter(
              row.usuario?.empleado?.persona?.nombre.toLowerCase()
            ) +
              " " +
              capitalizeFirstLetter(
                row.usuario?.empleado?.persona?.apellidos.toLowerCase()
              ) || ""}
          </div>
          <span
            className="fw-bold text-primary mt-1 text-left text-start"
            style={{ fontSize: "0.8rem" }}
          >
            {row.usuario?.empleado?.persona?.documento_identidad || ""}
          </span>
        </div>
      ),
      sortable: true,
      grow: 1, // ¡La clave! Esta columna crecerá el doble que las demás (si hubiera otra)
      minWidth: "150px", // Un ancho mínimo para que no se aplaste
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio,
      sortable: true,
      width: "120px", // Ancho fijo, ideal para fechas
      grow: 0,
      center: true,
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.fecha_fin,
      sortable: true,
      width: "120px", // Ancho fijo, ideal para fechas
      grow: 0,
      center: true,
    },
    {
      name: "Dias total",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_totales}</span>
      ),
      width: "120px", // Ancho suficiente para el TÍTULO
      grow: 0,
      center: true, // Centramos el número
    },
    {
      name: "Dias consumidos",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_utilizados}</span>
      ),
      width: "150px", // Ancho suficiente para el TÍTULO
      grow: 0,
      center: true,
    },
    {
      name: "Dias vendidos",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_vendidos}</span>
      ),
      width: "130px", // Ancho suficiente para el TÍTULO
      grow: 0,
      center: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`badge rounded-pill text-bg-${
            row.estado === 1 ? "success" : "danger"
          }`}
        >
          {row.estado === 1 ? "Completado" : "Pendiente"}
        </span>
      ),
      sortable: true,
      width: "130px", // Ancho fijo para el badge
      grow: 0,
      center: true,
    },
    {
      name: "Progreso",
      width: "150px", // Más de 100px para que la barra se aprecie
      grow: 0,
      cell: (row) => {
        const totalDias = row.dias_totales;
        const progreso =
          totalDias > 0
            ? ((row.dias_vendidos + row.dias_utilizados) / totalDias) * 100
            : 100;

        return (
          <div className="w-100">
            <div className="progress">
              <div
                className="progress-bar bg-primary progress-bar-striped"
                role="progressbar"
                style={{ width: `${progreso}%` }}
                aria-valuenow={progreso}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      name: "Acciones",
      width: "150px", // Ancho fijo para que quepan los 3 botones
      grow: 0,
      center: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          {/* Botón Editar */}
          <button
            className="btn-editar btn-sm"
            title="Editar vacaciones"
            disabled={row.estado == 1}
          >
            <Pencil className="text-auto" size={"auto"} />
          </button>

          {/* Botón Eliminar */}
          <button
            className="btn-eliminar btn-sm"
            title="Eliminar"
            disabled={row.estado === 1}
            onClick={() => eliminarVacaciones(row.id)}
          >
            <Trash2 className="text-auto" size={"auto"} />
          </button>

          {/* Botón Vender Días */}
          <button
            className="btn-principal btn-sm"
            title="Vender Días"
            disabled={row.estado == 1}
            onClick={() => {
              setModalVender(true);
              setVacacionesId(row);
            }}
          >
            <ShoppingBag cclassName="text-auto" size={"auto"} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center p-3">
          <h3 className=" mb-0">Vacaciones</h3>
          <div className="d-flex ms-auto mx-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <button
            className="btn btn-sm btn-outline-dark btn-sm"
            title="Reporte"
            onClick={() => GetReporteExcel("/reporteVacaciones")}
          >
            <FileText className="me-1 text-auto" />
            Reporte
          </button>
          <button
            className="btn btn-sm btn-outline-dark btn-sm mx-2"
            title="Agregar"
            onClick={() => {
              setIsModalOpen(true); // Abrir el modal
            }}
          >
            <Plus className="me-1 text-auto" />
            Agregar
          </button>
        </div>
        <div className="card-body p-0">
          <TablasGenerales
            columnas={columnas}
            datos={datosFiltradosVacaciones}
          />
        </div>
      </div>

      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Agregar Vacaciones"
        submitText="Guardar"
        hideFooter={true}
      >
        {({ handleClose }) => (
          <div className="modal-body p-3">
            <FormularioVacaciones
              onSubmitVaca={handleSubmitAgregar(onSubmitStoreVacaciones)}
              handleUsuarioSelect={handleUsuarioSelect}
              removeUsuario={removeUsuario}
              calcularDiasTotales={calcularDiasTotales}
              empleadosSeleccionados={empleadosSeleccionados}
              control={controlAgregar}
              errors={errorsAgregar}
              usuarios={usuarios}
              isLoadingUsuarios={isLoadingUsuarios}
              BASE_URL={BASE_URL}
              onClose={handleClose}
            />
          </div>
        )}
      </ModalRight>
      <ModalRight
        isOpen={modalVender}
        onClose={() => {
          setModalVender(false);
        }}
        title="Vender Vacaciones"
        submitText="Vender"
        hideFooter={true}
      >
        <div className="modal-body p-3">
          <FormularioVenderDias
            handleSubmit={handleSubmitVender}
            vacacionesId={vacacionesId}
            errors={errorsVender}
            register={registerVender}
            onSubmitVender={onSubmitVenderDias}
          />
        </div>
      </ModalRight>
    </div>
  );
}
