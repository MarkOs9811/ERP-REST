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
      <div className="row g-3">
        <div className="col-md-3 col-sm-12 h-100">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card  p-3 d-flex flex-row align-items-center">
              <ShoppingCart color="#f4a261" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras</h5>
                <h3 className="fw-bold mb-0">{totalCompras}</h3>
              </div>
            </div>
          </CondicionCarga>
        </div>

        <div className="col-md-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card  p-3 d-flex flex-row align-items-center">
              <CalendarDays color="#2a9d8f" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras del Mes</h5>
                <h3 className="fw-bold mb-0">{comprasDelMes}</h3>
              </div>
            </div>
          </CondicionCarga>
        </div>

        <div className="col-md-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card  p-3 d-flex flex-row align-items-center">
              <BanknoteArrowUp color="#e76f51" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Egresos del Mes</h5>
                <h3 className="fw-bold mb-0">S/. {totalMontoComprasDelMes}</h3>
              </div>
            </div>
          </CondicionCarga>
        </div>

        <div className="col-md-3 col-sm-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card  p-3 d-flex flex-row align-items-center">
              <Trophy color="#f4a261" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Proveedor TOP</h5>
                <h3 className="fw-bold mb-0">{proveedorTop}</h3>
              </div>
            </div>
          </CondicionCarga>
        </div>
        <div className="col-md-12 h-100">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card p-0  py-2 h-100">
              <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="card-title mb-0 titulo-card-especial">
                    Panel de Compras
                  </h4>
                  <span className="badge-header">Registro</span>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
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

                  <button
                    type="button"
                    className="btn btn-outline-dark px-3"
                    onClick={() => GetReporteExcel("/reporteCompras")}
                  >
                    <FileText size={18} />
                    Reporte
                  </button>

                  <button
                    className="btn btn-dark px-3"
                    onClick={() => setModalAddCompra(true)}
                  >
                    <Plus size={18} />
                    Agregar
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <ListaCompras search={search} data={compras} />
              </div>
            </div>
          </CondicionCarga>
        </div>

        <ModalRight
          isOpen={modalAddCompra}
          setIsOpen={setModalAddCompra}
          onClose={() => setModalAddCompra(false)}
          title="Agregar Compra"
          hideFooter={true}
        >
          <div className="card-body">
            <FormAddCompras />
          </div>
        </ModalRight>
      </div>
    </div>
  );
}
