import { useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../api/AxiosInstance";
import { CardReservas } from "../../components/componentesVentas/reservasMesas/CardReservas";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import FormAddReservarMesa from "../../components/componentesVentas/reservasMesas/FormAddReservarMesa";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Importamos el formulario

export function ReservasMesas() {
  const [modalDelete, setModalDelete] = useState({
    show: false,
    id: null,
    nombre: "",
  });
  const queryClient = useQueryClient();

  // Estado para saber si estamos editando (null = Nuevo)
  const [reservaEdit, setReservaEdit] = useState(null);

  // Estado para controlar si vemos la lista o el formulario
  const [vistaReserva, setVistaReserva] = useState("lista");

  const [fechaFiltro, setFechaFiltro] = useState(
    new Date().toISOString().split("T")[0],
  );

  // 1. Obtener Reservas
  const { data: reservas = [] } = useQuery({
    queryKey: ["reservasActivas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/vender/reservas");
      return response.data.data;
    },
  });

  // 2. Obtener Mesas (Necesario para pasárselo al formulario)
  const {
    data: mesas = [],
    isLoading: loading,
    isError: error,
    refetch,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  // Función para anular reserva
  const handleEliminarConfirmado = async (id) => {
    try {
      const response = await axiosInstance.delete(`/vender/reservas/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Reserva anulada correctamente");
        queryClient.invalidateQueries(["reservasActivas"]);
        queryClient.invalidateQueries(["mesas"]);
        return true;
      }
      return false;
    } catch (error) {
      ToastAlert("error", "Error al cancelar la reserva");
      return false;
    }
  };

  const reservasFiltradas = reservas.filter(
    (r) => r.fecha_reserva === fechaFiltro,
  );

  return (
    <Card className="overflow-hidden">
      {vistaReserva === "lista" ? (
        <>
          <CardHeader className="flex justify-between items-center">
            <h4 className="mb-0">Reservas de mesas</h4>
            <div className="flex gap-2">
              <div className="flex w-full items-stretch">
                <input
                  type="date"
                  className="h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-s-0 ps-3 bg-muted"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </div>
              <Button
                className="btn-principal flex items-center gap-1"
                onClick={() => {
                  setReservaEdit(null); // Limpiamos edición = "Nueva Reserva"
                  setVistaReserva("formulario"); // Cambiamos la vista
                }}
                variant="default"
              >
                <Plus size={16} />
                Nuevo
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {reservasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-5 text-muted-foreground h-full">
                <CalendarDays size={40} className="mb-2 opacity-50" />
                <p className="mb-0">
                  No hay reservas programadas para esta fecha.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3">
                {reservasFiltradas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="col-span-full md:col-span-3 sm:col-span-6 lg:col-span-3"
                  >
                    <CardReservas
                      reserva={reserva}
                      setModalDelete={setModalDelete}
                      irAFormulario={(reservaSeleccionada) => {
                        setReservaEdit(reservaSeleccionada); // Cargamos la data a editar
                        setVistaReserva("formulario"); // Cambiamos la vista
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </>
      ) : (
        /* ✅ Integración del Formulario */
        <CardContent className="p-0">
          {/* Se le da una altura para que el overflow-auto del formulario funcione bien */}
          <FormAddReservarMesa
            reservaToEdit={reservaEdit}
            todasLasMesas={mesas}
            volverALista={() => {
              setVistaReserva("lista");
              setReservaEdit(null);
            }}
          />
        </CardContent>
      )}

      {/* Modal de eliminación */}
      <ModalAlertQuestion
        show={modalDelete.show}
        idEliminar={modalDelete.id}
        nombre={modalDelete.nombre}
        tipo="la reserva de"
        pregunta="¿Estás seguro de anular"
        handleEliminar={handleEliminarConfirmado}
        handleCloseModal={() =>
          setModalDelete({ show: false, id: null, nombre: "" })
        }
      />
    </Card>
  );
}
