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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3 col-sm-12 h-100">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <ShoppingCart color="#ff8018" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras</h5>
                <h3 className="fw-bold mb-0">{totalCompras}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <CalendarDays color="#3580e4" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras del Mes</h5>
                <h3 className="fw-bold mb-0">{comprasDelMes}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <BanknoteArrowUp color="#e75151" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Egresos del Mes</h5>
                <h3 className="fw-bold mb-0">S/. {totalMontoComprasDelMes}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-3 flex flex-row items-center">
              <Trophy color="#ffd415" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Proveedor TOP</h5>
                <h3 className="fw-bold mb-0">{proveedorTop}</h3>
              </div>
            </Card>
          </CondicionCarga>
        </div>
        <div className="md:col-span-12 h-100">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="p-0 py-2 h-full">
              <CardHeader className="border-bottom-0 flex justify-between items-center">
                <div className="d-flex align-items-center">
                  <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                    Panel de Compras
                  </h4></CardTitle>
                  <span className="badge-header ms-2">Registro</span>
                </div>

                <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                  <div className="header-search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar compra..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Input de fecha */}
                  <input
                    type="date"
                    className="form-control mx-1"
                    {...register("fecha", { required: false })}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    style={{ maxWidth: "180px", minWidth: "150px" }}
                  />

                  <Button
                    type="button"
                    className="btn btn-outline-dark px-3"
                    onClick={() => GetReporteExcel("/reporteCompras")}
                   variant="default">
                    <FileText size={18} />
                    Reporte
                  </Button>

                  <Button
                    className="btn-principal px-4"
                    onClick={() => setModalAddCompra(true)}
                   variant="default">
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
