import { useState } from "react";

import {
  BanknoteArrowUp,
  CalendarDays,
  FileText,
  Plus,
  Search,
  ShoppingCart,
  Trophy,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { GetCompras } from "../../service/GetCompras";
import { FormAddCompras } from "../../components/componenteCompras/FormAddCompras";
import { ListaCompras } from "../../components/componenteCompras/ListaCompras";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Compras() {
  const [modalAddCompra, setModalAddCompra] = useState(false);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["compras"],
    queryFn: GetCompras,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const compras = data?.compras || [];
  const totalCompras = compras.length;

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1; // 1-12
  const anioActual = fechaActual.getFullYear();

  const comprasDelMes = compras.filter((compra) => {
    const [anio, mes] = compra.fecha_compra.split("-"); // "2025-10-01" => ["2025", "10", "01"]
    return parseInt(mes) === mesActual && parseInt(anio) === anioActual;
  }).length;

  const totalMontoComprasDelMes = compras
    .filter((compra) => {
      const [anio, mes] = compra.fecha_compra.split("-");
      return parseInt(mes) === mesActual && parseInt(anio) === anioActual;
    })
    .reduce((total, compra) => total + parseFloat(compra.totalPagado || 0), 0);

  const proveedorRecurrente = compras.reduce((acc, compra) => {
    const nombreProveedor = compra.proveedor?.nombre;
    if (nombreProveedor) {
      acc[nombreProveedor] = (acc[nombreProveedor] || 0) + 1;
    }
    return acc;
  }, {});
  const proveedorTop = Object.entries(proveedorRecurrente).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", 0],
  )[0];

  // Extraer compras de la data
  return (
    <div>
      <div className="grid grid-cols-12 gap-3">
        <div className="md:col-span-3 col-span-full h-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <ShoppingCart color="#ff8018" width="63px" height="63px" />
              <div className="ms-auto text-right">
                <h5 className="font-light">Compras</h5>
                <h3 className="font-bold mb-0">{totalCompras}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-span-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <CalendarDays color="#3580e4" width="63px" height="63px" />
              <div className="ms-auto text-right">
                <h5 className="font-light">Compras del Mes</h5>
                <h3 className="font-bold mb-0">{comprasDelMes}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-span-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <BanknoteArrowUp color="#e75151" width="63px" height="63px" />
              <div className="ms-auto text-right">
                <h5 className="font-light">Egresos del Mes</h5>
                <h3 className="font-bold mb-0">
                  S/. {totalMontoComprasDelMes}
                </h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-span-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <Trophy color="#ffd415" width="63px" height="63px" />
              <div className="ms-auto text-right">
                <h5 className="font-light">Proveedor TOP</h5>
                <h3 className="font-bold mb-0">{proveedorTop}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>
        <div className="col-span-full md:col-span-12 h-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 p-0 py-2 h-full">
              <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <CardTitle asChild>
                    <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                      Panel de Compras
                    </h4>
                  </CardTitle>
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Registro</span>
                </div>

                <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="relative w-full min-w-0 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar compra..."
                      className="h-9 pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Input de fecha */}
                  <input
                    type="date"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mx-1"
                    {...register("fecha", { required: false })}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    style={{ maxWidth: "180px", minWidth: "150px" }}
                  />

                  <Button size="lg"
                    type="button"
                    className="w-full gap-2 px-3 sm:w-auto"
                    onClick={() => GetReporteExcel("/reporteCompras")}
                    variant="ghostOutline"
                  >
                    <FileText size={18} />
                    Reporte
                  </Button>

                  <Button size="lg"
                    className="gap-2 px-3 w-full sm:w-auto"
                    onClick={() => setModalAddCompra(true)}
                    variant="default"
                  >
                    <Plus size={18} />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ListaCompras search={search} data={compras} />
              </CardContent>
            </Card>
          </CondicionCarga>
        </div>

        <ModalRight
          isOpen={modalAddCompra}
          setIsOpen={setModalAddCompra}
          onClose={() => setModalAddCompra(false)}
          title="Agregar Compra"
          hideFooter={true}
        >
          <CardContent className="">
            <FormAddCompras />
          </CardContent>
        </ModalRight>
      </div>
    </div>
  );
}
