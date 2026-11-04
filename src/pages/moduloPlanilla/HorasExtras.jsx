import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetHorasExtras } from "../../service/GetHorasExtras";
import { GetUsuarios } from "../../service/GetUsuarios";
import { Cargando } from "../../components/componentesReutilizables/Cargando";

import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import { FormularioAddHorasExtras } from "../../components/componentePlanillas/componentesHorasExtras/FormularioAddHorasExtras";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import {
  Eye,
  EyeIcon,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { FormularioEditHorasExtras } from "../../components/componentePlanillas/componentesHorasExtras/FormularioEditHorasExtras";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HorasExtras() {
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState(""); // Valor inmediato del input
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
      empleadosSeleccionados.filter((usuario) => usuario?.id !== usuarioId),
    );
  };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/horasExtras`, data);

      // Verificar si la respuesta contiene múltiples resultados o un solo resultado
      if (Array.isArray(response.data.resultados)) {
        // Caso: Múltiples usuarios
        const errores = response.data.resultados.filter(
          (resultado) => !resultado.success,
        );
        const exitosos = response.data.resultados.filter(
          (resultado) => resultado.success,
        );

        if (exitosos.length > 0) {
          ToastAlert(
            "success",
            `${exitosos.length} usuarios registrados exitosamente.`,
          );
        }

        if (errores.length > 0) {
          errores.forEach((error) => {
            ToastAlert(
              "error",
              `Error para el usuario ${error.usuario_id}: ${error.message}`,
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
            error.response.data.message || "Error de validación.",
          );
        }
      } else {
        // Manejo de otros errores
        ToastAlert("error", `Error en la solicitud: ${error.message}`);
      }
    }
  };

  const {
    data: horasExtras = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: GetHorasExtras,
    queryKey: ["horasExtras"],
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const datosFiltrados = useMemo(() => {
    if (!horasExtras) {
      return [];
    }
    const termino = filtro.toLowerCase();
    if (termino === "") {
      return horasExtras;
    }
    return horasExtras.filter((dato) => {
      const nombre = (
        dato.usuario?.empleado?.persona?.nombre || ""
      ).toLowerCase();
      const apellidos = (
        dato.usuario?.empleado?.persona?.apellidos || ""
      ).toLowerCase();

      const doc_indetidad = (
        dato.usuario?.empleado?.persona?.documento_identidad || ""
      ).toString();

      const fecha = (dato.fecha || "").toLowerCase();

      return (
        nombre.includes(termino) ||
        apellidos.includes(termino) ||
        doc_indetidad.includes(termino) ||
        fecha.includes(termino)
      );
    });
  }, [horasExtras, filtro]); // Dependencias: recalcula si esto cambia

  const handleEliminar = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/horasExtras/${id}`);

      if (response.data.success) {
        ToastAlert("success", "Se eliminó correctamente");
        queryClient.invalidateQueries(["horasExtras"]);
      }
      // Ya no necesitas setLoading(false) aquí
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || error.message || "Error al eliminar",
      );
      // Ya no necesitas setLoading(false) aquí
    } finally {
      setLoading(false); // 2. Desactiva el loading al final, pase lo que pase
    }
  };

  if (isLoading) {
    return <Cargando />; // Mostrar el componente Cargando mientras se cargan los datos
  }

  if (isError) {
    return (
      <ContenedorPrincipal>
        <div
          className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive"
          role="alert"
        >
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
          <small className="font-bold" style={{ color: "rgb(1, 98, 110)" }}>
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
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
            row.estado == 1 ? "bg-emerald-600" : "bg-amber-500 text-foreground"
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
              <Button
                className="btn-ver inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
                title="Ver detalles"
                variant="outline"
              >
                <EyeIcon className="text-auto" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  className="btn-editar"
                  title="Editar Hora extra"
                  onClick={() => {
                    setDataEditHorasExtras(row);
                    setModalEditHoraExtras(true);
                  }}
                  variant="secondary"
                >
                  <Pencil className="text-auto" />
                </Button>
                <Button
                  className="btn-eliminar"
                  title="Eliminar registro"
                  disabled={loading}
                  onClick={() => {
                    setDataEditHorasExtras(row);
                    setModalEliminarHoraExtra(true);
                  }}
                  variant="destructive"
                >
                  {loading ? (
                    <span className="loading text-foreground"></span>
                  ) : (
                    <Trash2 className="text-auto" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 pb-2">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Panel de Horas Extras
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
                placeholder="Buscar horas extras..."
                className="h-9 pl-9"
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="w-full gap-2 px-3 sm:w-auto"
              title="Reporte"
              onClick={() => GetReporteExcel("/reporteHorasExtras")}
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
          <TablasGenerales columnas={columnas} datos={datosFiltrados} />
        </CardContent>
      </Card>
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Agregar Horas Extras"
        submitText="Agregar"
        hideFooter={true}
      >
        <div className="p-3">
          <FormularioAddHorasExtras
            onSubmit={handleSubmit(onSubmit)}
            handleUsuarioSelect={handleUsuarioSelect}
            removeUsuario={removeUsuario}
            empleadosSeleccionados={empleadosSeleccionados}
            control={control}
            errors={errors}
            usuarios={usuarios}
            isLoadingUsuarios={isLoadingUsuarios}
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
        handleEliminar={handleEliminar}
        handleCloseModal={() => setModalEliminarHoraExtra(false)}
        tipo={"horas extras"}
      />
    </div>
  );
}
