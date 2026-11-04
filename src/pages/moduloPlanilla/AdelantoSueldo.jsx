import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { GetAdelantoSueldo } from "../../service/GetAdelantoSueldo";
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
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdelantoSueldo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenQuestion, setIsModalOpenQuestion] = useState(false);
  const [adelantoSueldoId, setAdelantoSueldoId] = useState(null);

  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useQuery({
    queryFn: GetUsuarios,
    queryKey: ["usuarios"],
    refetchOnWindowFocus: false,
  });
  const handleUsuarioSelect = (event) => {
    const usuarioId = parseInt(event.target.value);
    const usuario = usuarios?.find((u) => u.id === usuarioId);

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
      empleadosSeleccionados.filter((usuario) => usuario.id !== usuarioId),
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
              `Usuario ${error.usuario_id}: ${error.message}`,
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
            error.response.data.message || "Error de validación.",
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
        <div className="flex flex-col items-start text-center">
          <div>
            {capitalizeFirstLetter(
              row.usuario?.empleado?.persona?.nombre.toLowerCase(),
            ) +
              " " +
              capitalizeFirstLetter(
                row.usuario?.empleado?.persona?.apellidos.toLowerCase(),
              ) || ""}
          </div>
          <span
            className="font-bold text-primary mt-1 text-left"
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
          href={""}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 mx-2 mb-0"
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
            className="flex items-center justify-center h-full"
            style={{ textAlign: "center" }}
          >
            <p
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                row.estado == 1
                  ? "bg-emerald-600"
                  : "bg-amber-500 text-foreground"
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
        <div className="flex justify-center gap-2">
          {row.estado == 1 ? (
            <>
              <Button
                className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent"
                title="Ver detalles"
                onClick={() => verDetalles(row.id)}
                variant="default"
              >
                <Eye color={"auto"} />
              </Button>
              <Button
                className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10"
                title="Eliminar registro"
                onClick={() => eliminarAdelantoSueldo(row.id)}
                variant="destructive"
              >
                <Trash2 color={"auto"} />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent"
                title="Editar Adelanto de Sueldo"
                onClick={() => getEditAdelantoSueldo(row.id)}
                variant="default"
              >
                <Pencil color={"auto"} />
              </Button>
              <Button
                className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10"
                title="Eliminar registro"
                onClick={() => eliminarAdelantoSueldo(row.id)}
                variant="destructive"
              >
                <Trash2 color={"auto"} />
              </Button>
              <Button
                className="shadow btn-pagar inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-emerald-600 bg-background text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                title="Realizar el pago"
                onClick={() => confirmarPagoQuestion(row.id)}
                variant="default"
              >
                <BanknoteArrowUp color={"auto"} />
              </Button>
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
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 pb-2">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Panel de Adelantos
              </h4>
            </CardTitle>
            <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Registros
            </span>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar adelanto..."
                className="h-9 pl-9"
              />
            </div>
            <Button
              size="lg"
              className="w-full gap-2 px-3 sm:w-auto"
              title="Reporte"
              variant="ghostOutline"
            >
              <FileText size={18} />
              Reporte
            </Button>
            <Button
              size="lg"
              className="gap-2 px-3 w-full sm:w-auto"
              title="Agregar"
              onClick={() => {
                setIsModalOpen(true);
              }}
              variant="default"
            >
              <Plus size={18} />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TablasGenerales columnas={columnas} datos={adelantoSueldoList} />
        </CardContent>
      </Card>
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
        {({ handleClose }) => (
          <div className="p-3">
            <FormularioAdelantoSueldo
              onSubmit={handleSubmit(onSubmit)}
              handleUsuarioSelect={handleUsuarioSelect}
              removeUsuario={removeUsuario}
              empleadosSeleccionados={empleadosSeleccionados}
              control={control}
              errors={errors}
              usuarios={usuarios}
              isLoadingUsuarios={isLoadingUsuarios}
              onClose={handleClose}
            />
          </div>
        )}
      </ModalRight>
    </div>
  );
}
