import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { useQuery } from "@tanstack/react-query";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { GetCuentasPorPagar } from "../../service/serviceFinanzas/GetCuentasPorPagar";
import { ArrowRightIcon, Coins, File, List } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { DetallesCuotasPagar } from "../../components/componentesFinanzas/cuotasPorPagar/DetallesCuotasPagar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            className="inline-flex items-center rounded-full text-xs font-semibold transition-colors p-2"
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
            className="inline-flex items-center rounded-full text-xs font-semibold transition-colors p-2"
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
        <Button
          className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent"
          onClick={() => {
            setModalCuotasPagar(true);
            setDataCuotasPagar(row);
          }}
          variant="default"
        >
          <List
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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <Card className="py-2">
            <CardHeader className="border-b-0 flex flex-col md:flex-row justify-between items-center gap-2 p-3">
              <div className="flex items-center">
                <Coins
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <CardTitle asChild>
                  <h4 className="mb-0 titulo-card-especial">
                    Cuentas por Pagar
                  </h4>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && (
                <div className="text-center">
                  <Cargando />
                </div>
              )}
              <TablasGenerales columnas={columnas} datos={datos} />
            </CardContent>
          </Card>
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
    </div>
  );
}
