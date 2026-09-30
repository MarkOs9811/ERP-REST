import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosAsignadosRider } from "../../service/accionesDelivery/GetPedidosAsignadosRider";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { Bike, CheckCircle, Eye, UserCheck } from "lucide-react";
import { useRef, useState } from "react";
import ModalGenerales from "../componentesReutilizables/ModalGenerales";
import { FormAsignarRider } from "./FormAsignarider";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { PutData } from "../../service/CRUD/PutData";
import ModalRight from "../componentesReutilizables/ModalRight";
import { DetallesEntregas } from "./entregas/DetallesEntregas";

export function ListaPedidosAsignados() {
  const formRiderRef = useRef(null);
  const [modalQuestion, setModalQuestion] = useState();

  const [modalDetallesVenta, setModalDetallesVenta] = useState();
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
        // 1. Definimos las variables vacías
        let estadoTexto = "";
        let colorVariante = "";
        let IconoBadge = null;

        // 2. Evaluamos los 3 estados posibles
        if (row.estado_pedido === 54) {
          estadoTexto = "Asignado";
          colorVariante = "warning";
          IconoBadge = <UserCheck size={16} />;
        } else if (row.estado_pedido === 55) {
          estadoTexto = "En ruta";
          colorVariante = "primary"; // Sugiero primary para en ruta y success para entregado
          IconoBadge = <Bike size={16} />;
        } else if (row.estado_pedido === 6) {
          estadoTexto = "Entregado";
          colorVariante = "success";
          IconoBadge = <CheckCircle size={16} />;
        }

        return (
          <BadgeComponent
            label={estadoTexto}
            variant={colorVariante}
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
          {/* Condición 1: Estado 54 (Asignado) -> Muestra Cambiar y Quitar */}
          {row.estado_pedido === 54 && (
            <>
              <button
                className="btn btn-outline-dark my-2 me-2" // Añadí 'me-2' para separar los botones si están en la misma línea
                onClick={() => {
                  setDataPedido(row);
                  setModalAsignarRider(true);
                }}
              >
                Cambiar
              </button>
              <button
                className="btn-eliminar px-3"
                onClick={() => {
                  setModalQuestion(true);
                  setDataPedido(row);
                }}
              >
                Quitar
              </button>
            </>
          )}

          {/* Condición 2: Estado 55 (En ruta) -> Bloqueado */}
          {row.estado_pedido === 55 && (
            <span className="text-muted">No disponible</span>
          )}

          {/* Condición 3: Estado 6 (Entregado) -> Ver detalles */}
          {row.estado_pedido === 6 && (
            <button
              className="btn-ver my-2 d-flex align-items-center gap-1"
              onClick={() => {
                setDataPedido(row);
                setModalDetallesVenta(true);
              }}
            >
              <Eye size={16} /> Detalles
            </button>
          )}
        </div>
      ),
      button: true,
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
      <ModalRight
        isOpen={modalDetallesVenta}
        onClose={() => setModalDetallesVenta(false)}
        title="Detalles de la Venta"
        submitText="Imprimir"
        cancelText="Cerrar"
        hideFooter={true}
      >
        <DetallesEntregas dataVentas={dataPedido} />
      </ModalRight>
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
