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
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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
        (c) => c.id === dataCuotasCobrar.id,
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
                style={{
                  borderLeft: "3px solid var(--fw-emerald)",
                  paddingLeft: 10,
                }}
              >
                {`${row.cliente.persona.nombre} ${row.cliente.persona.apellidos}`}
              </span>
              <br />
              <small
                className="badge"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--fw-muetd)",
                }}
              >
                {row.cliente.persona.documento_identidad}
              </small>
            </div>
          );
        } else if (row.cliente?.empresa) {
          return (
            <div>
              <span
                style={{
                  borderLeft: "3px solid var(--fw-emerald)",
                  paddingLeft: 10,
                }}
              >
                {row.cliente.empresa.nombre}
              </span>
              <br />
              <small
                className="badge"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--fw-muetd)",
                }}
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
            style={{
              color: "var(--fw-saffron)",
              background: "var(--bg-saffron-soft)",
            }}
          >
            <small>
              {row.estado.charAt(0).toUpperCase() + row.estado.slice(1)}
            </small>
          </span>
        ) : (
          <span
            className="badge p-2"
            style={{
              color: "var(--fw-emerald)",
              background: "var(--bg-emerald-soft)",
            }}
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
        <Button
          className="btn btn-outline-dark"
          onClick={() => {
            setModalDetalleCuotas(true);
            setDataCuotasCobrar(row);
          }}
         variant="default">
          <ListCheck
            className="text-auto"
            height="20px"
            width="20px"
            style={{ verticalAlign: "middle" }}
          />
        </Button>
      ),
      sortable: false,
      center: true,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Header */}
        <div className="md:col-span-12">
          <Card className="py-2">
            <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
              <div className="d-flex align-items-center">
                <Coins
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                  Cuentas por Cobrar
                </h4></CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
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
    </div>
  );
}
