import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetVacaciones } from "../../service/GetVacaciones";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormularioVacaciones } from "../../components/componentePlanillas/componenteVacaciones/FormularioVacaciones";
import { GetUsuarios } from "../../service/GetUsuarios";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FileText, Pencil, Plus, ShoppingBag, Trash2 } from "lucide-react";

export function Vacaciones() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const queryClient = useQueryClient();
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
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      empleados: [], // Inicializa empleados como un array vacío
      fechaInicio: "",
      fechaFin: "",
      diasTotales: "",
      observaciones: "",
      diasVender: "",
    },
  });
  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryFn: GetUsuarios,
    queryKey: ["usuarios"],
    refetchOnWindowFocus: false,
  });

  const empleadosSeleccionados = watch("empleados");
  const handleUsuarioSelect = (event) => {
    const usuarioId = parseInt(event.target.value);
    const usuario = usuarios.find((u) => u.id === usuarioId);

    // Verificar si el usuario ya está en la lista
    if (!empleadosSeleccionados.some((u) => u.id === usuarioId)) {
      setValue("empleados", [...empleadosSeleccionados, usuario]); // Agregar el usuario al array
    }
  };
  const removeUsuario = (usuarioId) => {
    console.log("Antes de eliminar:", empleadosSeleccionados);
    setValue(
      "empleados",
      empleadosSeleccionados.filter((usuario) => usuario.id !== usuarioId)
    );
  };

  const calcularDiasTotales = () => {
    const fechaInicio = new Date(watch("fechaInicio"));
    const fechaFin = new Date(watch("fechaFin"));

    if (fechaInicio && fechaFin && fechaFin >= fechaInicio) {
      const diferencia = Math.ceil(
        (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
      );
      setValue("diasTotales", diferencia + 1); // Incluye el día de inicio
    } else {
      setValue("diasTotales", 0);
    }
  };

  const onSubmit = async (data) => {
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
        reset(); // Reiniciar el formulario
        setIsModalOpen(false); // Cerrar el modal
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((messages) => {
            messages.forEach((message) => {
              ToastAlert("error", message);
            });
          });
        } else {
          ToastAlert(
            "error",
            error.response.data.message || "Error de validación."
          );
        }
      } else {
        ToastAlert("error", `Error en la solicitud: ${error.message}`);
      }
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
    { name: "ID", selector: (row) => row.id, sortable: true, grow: 0 },
    {
      name: "Empleado",
      cell: (row) => (
        <div className="d-flex flex-column align-items-start text-left">
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
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio,
      sortable: true,
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.fecha_fin,
      sortable: true,
    },
    {
      name: "Dias total",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_totales}</span>
      ),
    },
    {
      name: "Dias consumidos",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_utilizados}</span>
      ),
    },
    {
      name: "Dias vendidos",
      cell: (row) => (
        <span className="text-primary fw-bold">{row.dias_vendidos}</span>
      ),
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
    },
    {
      name: "Progreso",
      cell: (row) => {
        const totalDias = row.dias_totales; // Total de días disponibles
        const progreso =
          totalDias > 0
            ? ((row.dias_vendidos + row.dias_utilizados) / totalDias) * 100
            : 100; // Si no hay días totales, el progreso es 100%

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
      cell: (row) => (
        <div className="d-flex gap-2">
          {/* Botón Editar */}
          <button
            className="btn btn-warning btn-sm"
            title="Editar vacaciones"
            disabled={row.estado === 1}
          >
            <Pencil color={"#fff"} />
          </button>

          {/* Botón Eliminar */}
          <button
            className="btn btn-danger btn-sm"
            title="Eliminar"
            disabled={row.estado === 1}
            onClick={() => eliminarVacaciones(row.id)}
          >
            <Trash2 color={"#fff"} />
          </button>

          {/* Botón Vender Días */}
          <button
            className="btn btn-info btn-sm"
            title="Vender Días"
            disabled={row.estado === 1}
            onClick={() => {
              setModalVender(true);
              setVacacionesId(row);
            }}
          >
            <ShoppingBag color={"#fff"} />
          </button>
        </div>
      ),
      grow: 0,
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
            />
          </div>
          <button
            className="btn btn-sm btn-outline-dark btn-sm"
            title="Reporte"
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
          <TablasGenerales columnas={columnas} datos={vacacionesList} />
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
        <div className="modal-body p-3">
          <FormularioVacaciones
            onSubmit={handleSubmit(onSubmit)}
            handleUsuarioSelect={handleUsuarioSelect}
            removeUsuario={removeUsuario}
            calcularDiasTotales={calcularDiasTotales}
            empleadosSeleccionados={empleadosSeleccionados}
            control={control}
            errors={errors}
            usuarios={usuarios}
            isLoadingUsuarios={isLoadingUsuarios}
            BASE_URL={BASE_URL}
          />
        </div>
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
          <form
            onSubmit={handleSubmit(async (data) => {
              try {
                const payload = {
                  id: vacacionesId.id, // ID de las vacaciones seleccionadas
                  diasVender: data.diasVender, // Días a vender
                };
                console.log(payload);
                const response = await axiosInstance.post(
                  "/vacaciones/venderDias",
                  payload
                );

                if (response.data.success) {
                  ToastAlert("success", response.data.message);
                  queryClient.invalidateQueries(["vacaciones"]); // Refrescar los datos
                  setModalVender(false); // Cerrar el modal
                  reset();
                } else {
                  ToastAlert("error", response.data.message);
                }
              } catch (error) {
                ToastAlert("error", `Error en la solicitud: ${error.message}`);
              }
            })}
          >
            {/* Mostrar la imagen del usuario */}
            <div className="card d-flex flex-row align-items-center p-3 border mb-3">
              {/* Imagen del usuario */}
              <div className="me-3">
                {vacacionesId.usuario?.fotoPerfil ? (
                  <img
                    src={`${BASE_URL}/storage/${vacacionesId.usuario.fotoPerfil}`}
                    alt="Foto de perfil"
                    className="rounded-circle"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "4px solid rgb(194, 194, 194)",
                      boxShadow: "0 0 5px rgba(13, 15, 17, 0.5)",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <p className="text-white mb-0">Sin Foto</p>
                  </div>
                )}
              </div>

              {/* Nombre y apellidos */}
              <div className="text-center flex-grow-1">
                <h5 className="mb-1">
                  {vacacionesId.usuario?.empleado?.persona?.nombre
                    ? capitalizeFirstLetter(
                        vacacionesId.usuario.empleado.persona.nombre.toLowerCase()
                      )
                    : "Nombre no disponible"}
                </h5>
                <h6 className="text-muted">
                  {vacacionesId.usuario?.empleado?.persona?.apellidos
                    ? capitalizeFirstLetter(
                        vacacionesId.usuario.empleado.persona.apellidos.toLowerCase()
                      )
                    : "Apellidos no disponibles"}
                </h6>
                <small className="text-primary fw-bold">
                  {vacacionesId.usuario?.empleado?.cargo?.nombre
                    ? capitalizeFirstLetter(
                        vacacionesId.usuario.empleado.cargo.nombre.toLowerCase()
                      )
                    : "Cargo no disponible"}
                </small>
              </div>
            </div>
            <div className="card border p-3 mb-3">
              <div className="flex-grow-1">
                <h6 className="text-muted">
                  <span> Dias Totales </span>
                  {vacacionesId.dias_totales ? (
                    <p className="fw-bold">{vacacionesId.dias_totales}</p>
                  ) : (
                    "Dias totales no disponibles"
                  )}
                </h6>
                <h6 className="text-muted">
                  <span> Dias Utilizados </span>
                  {vacacionesId.dias_utilizados ? (
                    <p className="fw-bold">{vacacionesId.dias_utilizados}</p>
                  ) : (
                    "Dias totales no disponibles"
                  )}
                </h6>
                <h6 className="text-muted">
                  <span> Dias Disponibles a vender </span>

                  <p className="fw-bold">
                    {vacacionesId.dias_totales - vacacionesId.dias_utilizados}
                  </p>

                  {vacacionesId.dias_totales - vacacionesId.dias_utilizados < 0
                    ? "Dias totales no disponibles"
                    : ""}
                </h6>
              </div>
            </div>

            {/* Input para los días a vender */}
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="diasVender"
                placeholder="Días a vender"
                {...register("diasVender", {
                  required: "Debe ingresar los días a vender",
                  min: { value: 1, message: "Debe vender al menos 1 día" },
                })}
              />
              <label htmlFor="diasVender">Días a vender</label>
              {errors.diasVender && (
                <div className="invalid-feedback">
                  {errors.diasVender.message}
                </div>
              )}
              <small className="text-muted">
                Los dias a vender no deben superar los dias Totales
              </small>
            </div>

            {/* Botón para confirmar */}
            <button type="submit" className="btn btn-primary p-3 w-100">
              Confirmar Venta
            </button>
          </form>
        </div>
      </ModalRight>
    </div>
  );
}
