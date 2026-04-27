import { useQuery } from "@tanstack/react-query";
import { GetPedidosAsignadosRider } from "../../service/accionesDelivery/GetPedidosAsignadosRider";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { AudioWaveformIcon } from "lucide-react";

export function ListaPedidosAsignados() {
  const {
    data: pedidosAsignados,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pedidosAsignadosRider"],
    queryFn: GetPedidosAsignadosRider,
  });
  console.log("Pedidos Asignados:", pedidosAsignados);
  // Funciones para manejar las acciones (Aquí pondrás tus llamadas a la API/Axios o abrir un Modal)
  const handleReasignar = (idPedido) => {
    console.log("Abrir modal para reasignar el pedido ID:", idPedido);
    // Lógica para cambiar de repartidor...
  };

  const handleQuitarAsignacion = (idPedido) => {
    console.log("Eliminar asignación del pedido ID:", idPedido);
    // Lógica para quitar al repartidor actual (Ej. mandarlo de vuelta a pendientes)...
  };

  const dataListaAsignados = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Código",
      selector: (row) => row.codigo_pedido,
      sortable: true,
      width: "120px", // Ajustando anchos para que no se amontone
    },
    {
      name: "Cliente",
      selector: (row) => row.nombre_cliente,
      sortable: true,
    },
    // --- NUEVAS COLUMNAS DEL RIDER ---
    {
      name: "Repartidor",
      // OJO: Asumo que desde Laravel (en tu ->with()) estás mandando los datos del rider.
      // Si solo llega el ID, usa row.idDeliveryRider. Si mandas la relación, sería algo como row.rider.nombre
      selector: (row) => row.idDeliveryRider,
      cell: (row) => (
        <span
          style={{
            fontWeight: "bold",
            color: "#333",
            textTransform: "capitalize",
          }}
        >
          {/* Cambia esto por la propiedad correcta que traiga tu backend, ej: row.rider?.nombre */}
          {row.conductor?.empleado?.persona?.nombre +
            " " +
            row.conductor?.empleado?.persona?.apellidos || "Sin Repartidor"}
        </span>
      ),
    },

    {
      name: "Estado Pedido",
      selector: (row) => row.estado_pedido,
      cell: (row) => {
        // Mapeo del estado
        const estadoTexto =
          row.estado_pedido === 54 ? "En Camino" : "Otro estado";

        // Si no es 54, le puedes cambiar el color dinámicamente
        const colorVariante =
          row.estado_pedido === 54 ? "success" : "secondary";

        return (
          <BadgeComponent
            label={estadoTexto}
            variant={colorVariante} // Pasamos "success" para que sea verde
            // OPCIÓN 1: Si usas Font Awesome en tu proyecto
            icon={<AudioWaveformIcon />}

            // OPCIÓN 2: Si usas react-icons (descomenta el import de arriba)
            // icon={<FaMotorcycle />}
          />
        );
      },
    },
    // ----------------------------------
    {
      name: "Estado Pago",
      selector: (row) => row.estado_pago,
      cell: (row) => (
        <span
          style={{
            color: row.estado_pago === "pagado" ? "#52c41a" : "#f5222d",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {row.estado_pago}
        </span>
      ),
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
      cell: (row) => `S/ ${row.total}`,
    },
    // --- COLUMNA DE ACCIONES ---
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <button
            className="btn-principal"
            onClick={() => handleReasignar(row.id)}
          >
            Cambiar
          </button>
          <button
            className="btn-ver"
            onClick={() => handleQuitarAsignacion(row.id)}
          >
            Quitar
          </button>
        </div>
      ),
      button: true, // Propiedad de react-data-table para evitar que el clic en el botón seleccione la fila
      width: "180px",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <p>Cargando pedidos...</p>
      ) : error ? (
        <p>Error al cargar los pedidos asignados.</p>
      ) : (
        <TablasGenerales
          columnas={dataListaAsignados}
          datos={pedidosAsignados ?? []}
        />
      )}
    </div>
  );
}
