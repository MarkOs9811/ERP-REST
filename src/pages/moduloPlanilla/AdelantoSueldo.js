import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { GetAdelantoSueldo } from "../../service/GetAdelantoSueldo";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { GetUsuarios } from "../../service/GetUsuarios";
import { useForm } from "react-hook-form";
import { FormularioAdelantoSueldo } from "../../components/componentePlanillas/componentesAdelantoSueldo/FormularioAdelantoSueldo";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import ModalGeneral from "../../components/componenteToast/ModalGeneral";
import {
  BanknoteArrowUp,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export function AdelantoSueldo() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenQuestion, setIsModalOpenQuestion] = useState(false);
  const [adelantoSueldoId, setAdelantoSueldoId] = useState(null);

  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryFn: GetUsuarios,
    queryKey: ["usuarios"],
    refetchOnWindowFocus: false,
  });
  const handleUsuarioSelect = (event) => {
    const usuarioId = parseInt(event.target.value);
    const usuario = usuarios.find((u) => u.id === usuarioId);

    // Verificar si el usuario ya está en la lista
    if (!empleadosSeleccionados.some((u) => u.id === usuarioId)) {
      setValue("empleados", [...empleadosSeleccionados, usuario]); // Agregar el usuario al array
    }
  };
  const queryClient = useQueryClient();
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
      monto: "",
      descripcion: "",
      documento: "",
    },
  });
  const empleadosSeleccionados = watch("empleados");

  const removeUsuario = (usuarioId) => {
    console.log("Antes de eliminar:", empleadosSeleccionados);
    setValue(
      "empleados",
      empleadosSeleccionados.filter((usuario) => usuario.id !== usuarioId)
    );
  };

  // get adelantoSueldo
  const {
    data: adelantoSueldoList,
    onLoading,
    onError,
  } = useQuery({
    queryKey: ["adelantoSueldo"],
    queryFn: GetAdelantoSueldo,
    refetchOnWindowFocus: false,
  });

  //   FUNCION PARA REGISTRAR EL ADELANTO DE SUELDO
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      formData.append("fecha", data.fecha);
      formData.append("monto", data.monto);
      formData.append("descripcion", data.descripcion);

      // Verificar si se seleccionó un archivo y agregarlo al FormData
      if (data.documento && data.documento.length > 0) {
        formData.append("documento", data.documento[0]);
      }

      // Agregar los empleados seleccionados al FormData
      data.empleados.forEach((empleado, index) => {
        formData.append(`empleados[${index}]`, empleado.id);
      });

      // Enviar la solicitud con axios
      const response = await axiosInstance.post("/adelantoSueldo", formData);

      // Manejo de la respuesta
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["adelantoSueldo"]);
        reset(); // Reiniciar el formulario
      } else {
        if (response.data.errors) {
          response.data.errors.forEach((error) => {
            ToastAlert(
              "error",
              `Usuario ${error.usuario_id}: ${error.message}`
            );
          });
        } else {
          ToastAlert("error", response.data.message);
        }
      }
    } catch (error) {
      // Manejo de errores
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          validationErrors.forEach((error) => {
            ToastAlert("error", error.message);
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

  const confirmarPago = async (id) => {
    try {
      const response = await axiosInstance.post("/adelantoSueldo/pagar", {
        id: id,
      });

      if (response.data.success) {
        ToastAlert("success", "Pago realizado correctamente.");
        queryClient.invalidateQueries(["adelantoSueldo"]);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", `Error en la solicitud: ${error.message}`);
    }
  };
  const confirmarPagoQuestion = (id) => {
    setAdelantoSueldoId(id);
    setIsModalOpenQuestion(true);
  };

  const verDetalles = (id) => {};
  const eliminarAdelantoSueldo = (id) => {};
  const getEditAdelantoSueldo = (id) => {};
  const columnas = [
    { name: "ID", selector: (row) => row.id, sortable: true, grow: true },
    {
      name: "Empleado",
      cell: (row) => (
        <div className="d-flex flex-column align-items-start text-center">
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
    { name: "Monto", selector: (row) => "S/." + row.monto, sortable: true },
    { name: "Fecha", selector: (row) => row.fecha, sortable: true },
    {
      name: "Documento",
      selector: (row) => (
        <a
          href={`${BASE_URL}/storage/${row.justificacion}`}
          target="_blank"
          rel="noopener noreferrer"
          className=" btn mx-2 mb-0"
        >
          <FileText color={"#1591c6"} width="30px" height="30px" />
        </a>
      ),
      sortable: true,
    },
    {
      name: "Estado",
      center: true,
      cell: (row) => {
        return (
          <div
            className="d-flex align-items-center justify-content-center h-100"
            style={{ textAlign: "center" }}
          >
            <p
              className={`badge ${
                row.estado == 1 ? "bg-success" : "bg-warning text-dark"
              }`}
              style={{ margin: 0 }}
            >
              {row.estado == 1 ? "Aprobado" : "Pendiente"}
            </p>
          </div>
        );
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex justify-content-center gap-2">
          {row.estado == 1 ? (
            <>
              <button
                className="btn btn-outline-dark"
                title="Ver detalles"
                onClick={() => verDetalles(row.id)}
              >
                <Eye color={"auto"} />
              </button>
              <button
                className="btn btn-outline-danger"
                title="Eliminar registro"
                onClick={() => eliminarAdelantoSueldo(row.id)}
              >
                <Trash2 color={"auto"} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-dark"
                title="Editar Adelanto de Sueldo"
                onClick={() => getEditAdelantoSueldo(row.id)}
                data-bs-target="#adelantodeSueldoEditar"
                data-bs-toggle="modal"
              >
                <Pencil color={"auto"} />
              </button>
              <button
                className="btn btn-outline-danger"
                title="Eliminar registro"
                onClick={() => eliminarAdelantoSueldo(row.id)}
              >
                <Trash2 color={"auto"} />
              </button>
              <button
                className="btn btn-pagar btn-outline-success"
                title="Realizar el pago"
                onClick={() => confirmarPagoQuestion(row.id)}
              >
                <BanknoteArrowUp color={"auto"} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
  if (onLoading)
    return (
      <div>
        <Cargando />
      </div>
    );
  if (onError) return <div>Error: {onError.message}</div>;

  return (
    <ContenedorPrincipal>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center p-3">
          <h3 className=" mb-0">Adelanto Sueldo</h3>
          <div className="d-flex ms-auto mx-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
            />
          </div>
          <button className="btn btn-sm btn-outline-dark" title="Reporte">
            <FileText className="me-1" color={"auto"} />
            Reporte
          </button>
          <button
            className="btn btn-sm btn-outline-dark mx-2"
            title="Agregar"
            onClick={() => {
              setIsModalOpen(true); // Abrir el modal
            }}
          >
            <Plus className="me-1" color={"auto"} />
            Agregar
          </button>
        </div>
        <div className="card-body p-0">
          <TablasGenerales columnas={columnas} datos={adelantoSueldoList} />
        </div>
      </div>
      <ModalGeneral
        idProceso={adelantoSueldoId}
        show={isModalOpenQuestion}
        mensaje={"¿Está seguro de realizar el pago? "}
        handleCloseModal={() => {
          setIsModalOpenQuestion(false);
        }}
        handleAccion={confirmarPago}
      />

      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Adelantar Sueldo"
        submitText="Guardar"
        hideFooter={true}
      >
        <div className="modal-body p-3">
          <FormularioAdelantoSueldo
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
    </ContenedorPrincipal>
  );
}
