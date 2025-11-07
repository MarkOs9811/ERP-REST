import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetHorasExtras } from "../../service/GetHorasExtras";
import { GetUsuarios } from "../../service/GetUsuarios";
import { Cargando } from "../../components/componentesReutilizables/Cargando";

import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";

import { useForm } from "react-hook-form";

import { FormularioAddHorasExtras } from "../../components/componentePlanillas/componentesHorasExtras/FormularioAddHorasExtras";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { Eye, EyeIcon, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { FormularioEditHorasExtras } from "../../components/componentePlanillas/componentesHorasExtras/FormularioEditHorasExtras";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";

export function HorasExtras() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalditHoraExtras, setModalEditHoraExtras] = useState(false);
  const [dataEditHorasExtras, setDataEditHorasExtras] = useState(false);
  const [modalEliminarHoraExtra, setModalEliminarHoraExtra] = useState(false);

  const queryClient = useQueryClient();

  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryFn: GetUsuarios,
    queryKey: ["usuarios"],
    refetchOnWindowFocus: false,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      empleados: [],
      fecha: "",
      horas_trabajadas: "",
    },
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
      empleadosSeleccionados.filter((usuario) => usuario?.id !== usuarioId)
    );
  };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/horasExtras`, data);

      // Verificar si la respuesta contiene múltiples resultados o un solo resultado
      if (Array.isArray(response.data.resultados)) {
        // Caso: Múltiples usuarios
        const errores = response.data.resultados.filter(
          (resultado) => !resultado.success
        );
        const exitosos = response.data.resultados.filter(
          (resultado) => resultado.success
        );

        if (exitosos.length > 0) {
          ToastAlert(
            "success",
            `${exitosos.length} usuarios registrados exitosamente.`
          );
        }

        if (errores.length > 0) {
          errores.forEach((error) => {
            ToastAlert(
              "error",
              `Error para el usuario ${error.usuario_id}: ${error.message}`
            );
          });
        }
        queryClient.refetchQueries(["horasExtras"]);
      } else {
        // Caso: Un solo usuario
        const resultado = response.data;
        if (resultado.success) {
          ToastAlert("success", resultado.message); // Mostrar mensaje de éxito

          queryClient.refetchQueries(["horasExtras"]);
          reset(); // Reiniciar el formulario
        } else {
          ToastAlert("error", `Error: ${resultado.message}`); // Mostrar mensaje de error
        }
      }
    } catch (error) {
      // Manejo de errores de validación (422)
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((messages) => {
            messages.forEach((message) => {
              ToastAlert("error", message); // Mostrar cada mensaje de error de validación
            });
          });
        } else {
          ToastAlert(
            "error",
            error.response.data.message || "Error de validación."
          );
        }
      } else {
        // Manejo de otros errores
        ToastAlert("error", `Error en la solicitud: ${error.message}`);
      }
    }
  };

  const {
    data: horasExtras,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: GetHorasExtras,
    queryKey: ["horasExtras"],
    refetchOnWindowFocus: false,
  });

  const handleEliminar = async (id) => {
    // try {
    //   const response = await axiosInstance.delete("/horasExtras", id);
    //   if (response.data.success) {
    //     ToastAlert("success", "Se eliminó correctamente");
    //   }
    // } catch (error) {
    //   ToastAlert("error", error);
    // }
  };

  if (isLoading) {
    return <Cargando />; // Mostrar el componente Cargando mientras se cargan los datos
  }

  if (isError) {
    return (
      <ContenedorPrincipal>
        <div className="alert alert-danger" role="alert">
          Ocurrió un error al cargar los datos: {error.message}
        </div>
      </ContenedorPrincipal>
    );
  }

  const columnas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Empleado",
      selector: (row) =>
        `${row.usuario?.empleado.persona.nombre} ${row.usuario?.empleado.persona.apellidos}`,
      sortable: true,
      cell: (row) => (
        <div className="p-2">
          <div>
            {row.usuario?.empleado.persona.nombre}{" "}
            {row.usuario?.empleado.persona.apellidos}
          </div>
          <small className="fw-bold" style={{ color: "rgb(1, 98, 110)" }}>
            {row.usuario?.empleado.persona.documento_identidad}
          </small>
        </div>
      ),
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Horas Trabajadas",
      selector: (row) => row.horas_trabajadas,
      sortable: true,
      cell: (row) => (
        <div>
          <i className="fa-regular fa-clock"></i> {row.horas_trabajadas}
        </div>
      ),
    },
    {
      name: "Pago Total",
      selector: (row) => row.pagoTotal,
      sortable: true,
      cell: (row) => (
        <div>
          <i className="fa-regular">S/.</i> {row.pagoTotal}
        </div>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.estado == 1 ? "bg-success" : "bg-warning text-dark"
          }`}
        >
          {row.estado == 1 ? (
            <>
              <i className="fas fa-check-circle"></i> Trabajado
            </>
          ) : (
            <>
              <i className="fa-regular fa-hourglass-half"></i> Pendiente
            </>
          )}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          {row.estado == 1 ? (
            <>
              <button className="btn-ver btn-sm" title="Ver detalles">
                <EyeIcon className="text-auto" size={"auto"} />
              </button>
            </>
          ) : (
            <>
              <div className="d-flex gap-2">
                <button
                  className="btn-editar"
                  title="Editar Hora extra"
                  onClick={() => {
                    setDataEditHorasExtras(row);
                    setModalEditHoraExtras(true);
                  }}
                >
                  <Pencil className="text-auto" size={"auto"} />
                </button>
                <button
                  className="btn-eliminar"
                  title="Eliminar registro"
                  onClick={() => {
                    setDataEditHorasExtras(row);
                    setModalEliminarHoraExtra(true);
                  }}
                >
                  <Trash2 className="text-auto" size={"auto"} />
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="card shadow-sm py-2">
        <div className="card-header d-flex justify-content-between align-items-center p-3">
          <h3 className=" mb-0">Horas Extras</h3>
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
          <TablasGenerales columnas={columnas} datos={horasExtras} />
        </div>
      </div>
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Agregar Horas Extras"
        submitText="Agregar"
        hideFooter={true}
      >
        <div className="modal-body p-3">
          <FormularioAddHorasExtras
            onSubmit={handleSubmit(onSubmit)}
            handleUsuarioSelect={handleUsuarioSelect}
            removeUsuario={removeUsuario}
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
        isOpen={modalditHoraExtras}
        onClose={() => {
          setModalEditHoraExtras(false);
        }}
        hideFooter={true}
        title={"Editar horas extras"}
      >
        {({ handleClose }) => (
          <FormularioEditHorasExtras
            dataHoraExtras={dataEditHorasExtras}
            onClose={handleClose}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={modalEliminarHoraExtra}
        idEliminar={dataEditHorasExtras.id}
        nombre={
          "Para " +
          dataEditHorasExtras.usuario?.empleado?.persona?.nombre +
          " " +
          dataEditHorasExtras.usuario?.empleado?.persona?.apellidos
        }
        handleEliminar={handleEliminar()}
        handleCloseModal={() => setModalEliminarHoraExtra(false)}
        tipo={"horas extras"}
      />
    </div>
  );
}
