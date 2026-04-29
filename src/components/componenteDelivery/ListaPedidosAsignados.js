import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosAsignadosRider } from "../../service/accionesDelivery/GetPedidosAsignadosRider";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { Bike, UserCheck } from "lucide-react";
import { useRef, useState } from "react";
import ModalGenerales from "../componentesReutilizables/ModalGenerales";
import { FormAsignarRider } from "./FormAsignarider";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { PutData } from "../../service/CRUD/PutData";

export function ListaPedidosAsignados() {
  const formRiderRef = useRef(null);
  const [modalQuestion, setModalQuestion] = useState();

  const [modalAsignarRider, setModalAsignarRider] = useState(false);
  const [dataPedido, setDataPedido] = useState([]);

  const queryClient = useQueryClient();
  const {
    data: pedidosAsignados,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pedidosAsignadosRider"],
    queryFn: GetPedidosAsignadosRider,
  });

  const handleQuitarRider = async (idEliminar) => {
    const response = await PutData("delivery/quitarRider", idEliminar);
    if (response) {
      queryClient.invalidateQueries(["pedidosAsignadosRider"]);
    }
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
        // 1. Evaluamos en qué estado está
        const isAsignado = row.estado_pedido === 54;

        // 2. Asignamos Texto, Color e Icono dinámicamente
        const estadoTexto = isAsignado ? "Asignado" : "En ruta";
        const colorVariante = isAsignado ? "warning" : "success";
        const IconoBadge = isAsignado ? <UserCheck /> : <Bike />;

        return (
          <BadgeComponent
            label={estadoTexto}
            variant={colorVariante} // Forzamos la variante para no depender del mapa de texto
            icon={IconoBadge}
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
          {/* Condición: Solo renderiza los botones si el estado no es 55 */}
          {row.estado_pedido !== 55 && (
            <>
              <button
                className="btn-principal my-2"
                onClick={() => {
                  setDataPedido(row);
                  setModalAsignarRider(true);
                }}
              >
                Cambiar
              </button>
              <button
                className="btn-ver my-2"
                onClick={() => {
                  setModalQuestion(true);
                  setDataPedido(row);
                }}
              >
                Quitar
              </button>
            </>
          )}

          {/* Opcional: Si quieres mostrar un mensaje cuando es 55, descomenta lo siguiente */}
          {row.estado_pedido === 55 && (
            <span className="text-muted">No disponible</span>
          )}
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
      <ModalGenerales
        show={modalAsignarRider}
        handleCloseModal={() => setModalAsignarRider(false)}
        handleAccion={() => formRiderRef.current?.submitForm()}
        title="Cambiar Repartidor"
        width="600px"
      >
        {/* Aquí iría el componente FormAsignarRider, pasándole dataPedido como prop */}
        <FormAsignarRider
          ref={formRiderRef}
          idPedido={dataPedido.id}
          dataPedido={dataPedido}
          handleCloseModal={() => setModalAsignarRider(false)}
        />
      </ModalGenerales>

      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={dataPedido.id}
        nombre={dataPedido.id}
        handleEliminar={() => handleQuitarRider(dataPedido.id)}
        handleCloseModal={() => setModalQuestion(false)}
        tipo={"Pedido"}
        pregunta={"¿Estás seguro de quitar al rider del "}
      />
    </div>
  );
}
