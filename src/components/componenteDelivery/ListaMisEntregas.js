import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../service/CRUD/GetData";
import { Bike, CheckCircle, Eye, UserCheck } from "lucide-react";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { useState } from "react";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import { DetallesEntregas } from "./entregas/DetallesEntregas";

export function ListaMisEntregas() {
  const {
    data: misEntregas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listaMisEntregas"],
    queryFn: () => GetData("delivery/misEntregas"),
  });
  const [dataPedido, setDataPedido] = useState();
  const [modalDetallesVenta, setModalDetallesVenta] = useState();

  const dataListaMisEntregas = [
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
          <button
            className="btn-ver my-2 d-flex align-items-center gap-1"
            onClick={() => {
              setDataPedido(row);
              setModalDetallesVenta(true);
            }}
          >
            <Eye size={16} /> Detalles
          </button>
        </div>
      ),
      button: true,
      width: "180px",
    },
  ];
  return (
    <div>
      {isLoading ? (
        <div className="mx-auto text-center item-align-center p-4">
          <Cargando />
        </div>
      ) : isError ? (
        <div className="mx-auto text-center item-align-center p-4">
          <p>Error al cargar los pedidos asignados.</p>
        </div>
      ) : (
        <TablasGenerales
          columnas={dataListaMisEntregas}
          datos={misEntregas ?? []}
        />
      )}
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
    </div>
  );
}
