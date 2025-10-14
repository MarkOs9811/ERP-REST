import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { useQuery } from "@tanstack/react-query";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { GetCuentasPorPagar } from "../../service/serviceFinanzas/GetCuentasPorPagar";
import { ArrowRightIcon, Coins, File, List } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { DetallesCuotasPagar } from "../../components/componentesFinanzas/cuotasPorPagar/DetallesCuotasPagar";

export function CuentasPorPagar() {
  const [modalCuotasPagar, setModalCuotasPagar] = useState(false);
  const [dataCuotasPagar, setDataCuotasPagar] = useState([]);

  const {
    data: cuentasPorPagar,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cuentasPorPagar"],
    queryFn: () => GetCuentasPorPagar(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const datos = cuentasPorPagar?.cuentas_por_pagar || [];

  console.log(datos);

  const columnas = [
    { name: "ID", selector: (row) => <small>{row.id}</small>, sortable: true },
    {
      name: "Proveedor",
      selector: (row) => <small>{row?.proveedor?.nombre}</small>,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => <small>{row.descripcion}</small>,
      sortable: true,
    },
    {
      name: "Cuotas",
      selector: (row) => <small>{row.cuotas}</small>,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row) => <small>S/. {row.monto}</small>,
      sortable: true,
    },
    {
      name: "Monto Pagado",
      selector: (row) => <small>{row.monto_pagado}</small>,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => <small>{row.fecha_pago}</small>,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) =>
        row.estado === "pendiente" ? (
          <span
            className="badge p-2"
            style={{ color: "#a07417", background: "#f5d888" }}
          >
            <small>
              {row.estado.charAt(0).toUpperCase() + row.estado.slice(1)}
            </small>
          </span>
        ) : (
          <span
            className="badge p-2"
            style={{ color: "#1f6e43", background: "#87e7a7" }}
          >
            <small>
              {row.estado.charAt(0).toUpperCase() + row.estado.slice(1)}
            </small>
          </span>
        ),
      sortable: true,
    },
    {
      name: "Factura",
      selector: (row) =>
        row.comprobante ? (
          <a href={row.comprobante} target="_blank" title="Ver documento">
            <File color={"auto"} />
          </a>
        ) : (
          <span>No disponible</span>
        ),
      sortable: false,
      center: true,
    },
    {
      name: "Ver Cuotas",
      selector: (row) => (
        <button
          className="btn btn-outline-dark"
          onClick={() => {
            setModalCuotasPagar(true);
            setDataCuotasPagar(row);
          }}
        >
          <List
            className="text-auto"
            height="20px"
            width="20px"
            style={{ verticalAlign: "middle" }}
          />
          <ArrowRightIcon
            className="text-auto"
            height="20px"
            width="20px"
            style={{ verticalAlign: "middle", marginLeft: 4 }}
          />
        </button>
      ),
      sortable: false,
      center: true,
    },
  ];

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header p-3 d-flex align-items-center">
              <Coins color={"#ea4f4f"} height="45px" width="45px" />
              <p className="h4 card-title ms-2 mb-0">Cuentas por Pagar</p>
            </div>
            <div className="card-body">
              {isLoading && (
                <div className="text-center">
                  <Cargando />
                </div>
              )}
              <TablasGenerales columnas={columnas} datos={datos} />
            </div>
          </div>
        </div>
        {/* Modales */}
        <ModalRight
          isOpen={modalCuotasPagar}
          onClose={() => setModalCuotasPagar(false)}
          title={"Detalle de Cuotas"}
          width="70%"
          hideFooter={true}
        >
          <DetallesCuotasPagar
            data={dataCuotasPagar}
            refetch={refetch}
            estadoModal={setModalCuotasPagar}
          />
        </ModalRight>
      </div>
    </ContenedorPrincipal>
  );
}
