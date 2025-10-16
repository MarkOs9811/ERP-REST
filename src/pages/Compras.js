import React, { useState } from "react";

import { ListaCompras } from "../components/componenteCompras/ListaCompras";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import {
  BanknoteArrowUp,
  CalendarDays,
  FileChartColumnIncreasing,
  PlusIcon,
  ShoppingCart,
  Trophy,
} from "lucide-react";
import { GetReporteExcel } from "../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../components/componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";
import { FormAddCompras } from "../components/componenteCompras/FormAddCompras";
import { useQuery } from "@tanstack/react-query";
import { GetCompras } from "../service/GetCompras";
export function Compras() {
  const [modalAddCompra, setModalAddCompra] = useState(false);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, isLoading, error } = useQuery({
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
    ["", 0]
  )[0];

  if (isLoading) return <p>Cargando compras...</p>;
  if (error) return <p>Error al obtener las compras</p>;

  // Extraer compras de la data
  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <ShoppingCart color="#f4a261" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Compras</h5>
              <h3 className="fw-bold mb-0">{totalCompras}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <CalendarDays color="#2a9d8f" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Compras del Mes</h5>
              <h3 className="fw-bold mb-0">{comprasDelMes}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <BanknoteArrowUp color="#e76f51" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Egresos del Mes</h5>
              <h3 className="fw-bold mb-0">S/. {totalMontoComprasDelMes}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <Trophy color="#f4a261" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Proveedor TOP</h5>
              <h3 className="fw-bold mb-0">{proveedorTop}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card p-0 shadow-sm h-100">
            <div className="card-header d-flex justify-content-between">
              <h3 className="texto-principal">Compras</h3>
              <div className="d-flex">
                {/* Input de texto */}
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Input de fecha */}
                <input
                  type="date"
                  className="form-control mx-3"
                  {...register("fecha", { required: false })}
                  onChange={(e) => {
                    // cuando seleccionas una fecha, se refleja en el input de texto
                    setSearch(e.target.value);
                  }}
                />
                <button
                  className="btn mx-3 btn-outline-dark"
                  onClick={() => setModalAddCompra(true)}
                  title="Agregar Compra"
                >
                  <PlusIcon className="text-auto" />
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => GetReporteExcel("/reporteCompras")}
                  title="Descargar Reporte de proveedores"
                >
                  <FileChartColumnIncreasing className="text-auto" />
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <ListaCompras search={search} data={compras} />
            </div>
          </div>
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
    </ContenedorPrincipal>
  );
}
