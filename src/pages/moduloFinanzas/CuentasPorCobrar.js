import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { useQuery } from "@tanstack/react-query";
import { GetCuentasPorCobrar } from "../../service/serviceFinanzas/GetCuentasPorCobrar";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import {
  ArrowRight,
  ArrowRightIcon,
  Coins,
  List,
  ListCheck,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { DetallesCuotasCliente } from "../../components/componentesFinanzas/cuotasPorCobrar/DetallesCuotasCliente";

export function CuentasPorCobrar() {
  const [modalDetalleCuotas, setModalDetalleCuotas] = useState(false);
  const [dataCuotasCobrar, setDataCuotasCobrar] = useState([]);
  const {
    data: cuentasPorCobrar,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cuentasPorCobrar"],
    queryFn: () => GetCuentasPorCobrar(),
    refetchOnWindowFocus: false,
    retry: false,
  });
  useEffect(() => {
    if (
      modalDetalleCuotas &&
      dataCuotasCobrar?.id &&
      cuentasPorCobrar?.cuentas_por_cobrar
    ) {
      const cuentaActualizada = cuentasPorCobrar.cuentas_por_cobrar.find(
        (c) => c.id === dataCuotasCobrar.id
      );
      if (cuentaActualizada) {
        setDataCuotasCobrar(cuentaActualizada);
      }
    }
  }, [cuentasPorCobrar, modalDetalleCuotas, dataCuotasCobrar?.id]);

  const datos = cuentasPorCobrar?.cuentas_por_cobrar || [];
  const columnas = [
    { name: "ID", selector: (row) => <small>{row.id}</small>, sortable: true },
    {
      name: "Cliente",
      selector: (row) => {
        if (row.cliente?.persona) {
          return (
            <div>
              <span
                style={{ borderLeft: "3px solid #1665a2", paddingLeft: 10 }}
              >
                {`${row.cliente.persona.nombre} ${row.cliente.persona.apellidos}`}
              </span>
              <br />
              <small
                className="badge"
                style={{ color: "#696969", background: "#e0e0e0" }}
              >
                {row.cliente.persona.documento_identidad}
              </small>
            </div>
          );
        } else if (row.cliente?.empresa) {
          return (
            <div>
              <span
                style={{ borderLeft: "3px solid #a1d323", paddingLeft: 10 }}
              >
                {row.cliente.empresa.nombre}
              </span>
              <br />
              <small
                className="badge"
                style={{ color: "#696969", background: "#e7e7e7" }}
              >
                {row.cliente.empresa.ruc}
              </small>
            </div>
          );
        } else {
          return <span className="badge">Sin cliente</span>;
        }
      },
      sortable: true,
    },
    {
      name: "Cuotas",
      selector: (row) => (
        <div>
          <small>Cuotas: {row.cuotas}</small>
          <br />
          <small>Pagadas: {row.cuotas_pagadas}</small>
          <br />
          <small>Por pagar: {row.cuotas - row.cuotas_pagadas}</small>
        </div>
      ),
      sortable: false,
    },
    {
      name: "Monto",
      selector: (row) => <small>S/. {row.monto}</small>,
      sortable: true,
    },
    {
      name: "Monto Pagado",
      selector: (row) => <small>S/. {row.monto_pagado}</small>,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => (
        <small className="d-flex flex-column">
          <span className="text-primary fw-bold">{row.fecha_inicio}</span>
          <span className="text-success fw-bold">{row.fecha_fin}</span>
        </small>
      ),
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
      name: "Contrato",
      selector: (row) =>
        row.comprobante ? (
          <a
            href={row.comprobante}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver documento"
          >
            <i className="fas fa-file-invoice h3"></i>
          </a>
        ) : (
          <span>No disponible</span>
        ),
      sortable: false,
      center: true,
    },
    {
      name: "Ver cuotas",
      selector: (row) => (
        <button
          className="btn btn-outline-dark"
          onClick={() => {
            setModalDetalleCuotas(true);
            setDataCuotasCobrar(row);
          }}
        >
          <ListCheck
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
        {/* Header */}
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header p-3 d-flex align-items-center">
              <Coins color={"#ea4f4f"} height="45px" width="45px" />
              <p className="h4 card-title ms-2 mb-0">Cuentas por Cobrar</p>
            </div>
            <div className="card-body p-0">
              {isLoading && (
                <div className="text-center">
                  <Cargando />
                </div>
              )}
              {isError && (
                <div className="text-center">
                  <h5 className="text-danger">Error al cargar los datos</h5>
                </div>
              )}
              <TablasGenerales columnas={columnas} datos={datos} />
            </div>
          </div>
        </div>
        {/* Modales */}
        <ModalRight
          isOpen={modalDetalleCuotas}
          onClose={() => setModalDetalleCuotas(false)}
          title={"Detalle de Cuotas"}
          width="70%"
          hideFooter={true}
        >
          <DetallesCuotasCliente
            data={dataCuotasCobrar}
            refetch={refetch}
            estadoModal={setModalDetalleCuotas}
          />
        </ModalRight>
      </div>
    </ContenedorPrincipal>
  );
}
