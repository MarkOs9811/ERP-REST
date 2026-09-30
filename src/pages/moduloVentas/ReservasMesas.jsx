import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../css/estilosVentas/EstilosReservas.css";
import axiosInstance from "../../api/AxiosInstance";
import { CardReservas } from "../../components/componentesVentas/reservasMesas/CardReservas";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import FormAddReservarMesa from "../../components/componentesVentas/reservasMesas/FormAddReservarMesa";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";

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
    <div className="card overflow-hidden">
      {vistaReserva === "lista" ? (
        <>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Reservas de mesas</h4>
            <div className="d-flex gap-2">
              <div className="input-group input-group-sm">
                <input
                  type="date"
                  className="form-control border-start-0 ps-3 bg-light"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </div>
              <button
                className="btn-principal d-flex align-items-center gap-1"
                onClick={() => {
                  setReservaEdit(null); // Limpiamos edición = "Nueva Reserva"
                  setVistaReserva("formulario"); // Cambiamos la vista
                }}
              >
                <Plus size={16} />
                Nuevo
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            {reservasFiltradas.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted h-100">
                <CalendarDays size={40} className="mb-2 opacity-50" />
                <p className="mb-0">
                  No hay reservas programadas para esta fecha.
                </p>
              </div>
            ) : (
              <div className="row g-3 p-3">
                {reservasFiltradas.map((reserva) => (
                  <div key={reserva.id} className="col-md-3 col-sm-6 col-lg-3">
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
          </div>
        </>
      ) : (
        /* ✅ Integración del Formulario */
        <div className="card-body p-0">
          {/* Se le da una altura para que el overflow-auto del formulario funcione bien */}
          <FormAddReservarMesa
            reservaToEdit={reservaEdit}
            todasLasMesas={mesas}
            volverALista={() => {
              setVistaReserva("lista");
              setReservaEdit(null);
            }}
          />
        </div>
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
    </div>
  );
}
