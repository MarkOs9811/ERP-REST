import React, { useEffect, useState } from "react";
import {
  LockClosedOutline,
  CashOutline,
  WalletOutline,
  BarChartOutline,
} from "react-ionicons";
import ModalAlertQuestion from "../components/componenteToast/ModalAlertQuestion";
import axiosInstance from "../api/AxiosInstance";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { handlePrecioInput, validatePrecio } from "../hooks/InputHandlers";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component"; // Asegúrate de tener este paquete instalado
import customDataTableStyles from "../css/estilosComponentesTable/DataTableStyles";
export function CerrarCaja() {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [detallesVentas, setDetallesVenta] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [montoInicial, setMontoInicial] = useState(0);

  const sumaTotal = parseFloat(
    Number(totalVentas) + Number(montoInicial)
  ).toFixed(2);

  const [openModal, setOpenModal] = useState(false);
  const [tituloModal, setTituloModal] = useState(null);
  const [idCaja, setIdCaja] = useState(null);
  const navigate = useNavigate();
  const caja = JSON.parse(localStorage.getItem("caja"));

  //   FUNCION PARA TRAER LAS VENTAS REALIZADAS
  useEffect(() => {
    const getDatosCajaClose = async () => {
      try {
        const response = await axiosInstance.get(
          `/caja/getCajaClose/${caja.id}`
        );
        if (response.data.success) {
          setDetallesVenta(response.data.detallesVenta);
          setTotalVentas(response.data.totalVenta);
          setMontoInicial(response.data.montoInicial);
        } else {
          console.log("error", "error de conexión");
        }
      } catch (error) {
        console.log("error", "error de conexión");
      }
    };
    getDatosCajaClose();
  }, []);

  const handleCerrarCaja = async (id) => {
    const sumaTotalFormatted = parseFloat(sumaTotal).toFixed(2);
    const montoDejarFormatted = parseFloat(getValues("montoDejar")).toFixed(2);
    // Verifica si los valores son números
    if (isNaN(sumaTotalFormatted) || isNaN(montoDejarFormatted)) {
      ToastAlert("error", "Los montos deben ser números válidos.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/cajas/closeCaja/${id}`, {
        sumaTotalFormatted,
        montoDejarFormatted,
      });
      if (response.data.success) {
        localStorage.removeItem("caja");
        ToastAlert("success", response.data.message);
        setTimeout(() => {
          window.location.href = "/abrirCaja";
        }, 100);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", error.message);
    }
  };

  const handleQuestionCaja = (data) => {
    setOpenModal(true);
    setTituloModal(data.nombre);
    setIdCaja(data.id);
  };

  const handleQuestionClose = () => {
    setOpenModal(false);
    setTituloModal(null);
    setIdCaja(null);
  };
  const columns = [
    {
      name: "Pedido",
      selector: (row) => row.pedido,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Metodo Pago",
      selector: (row) => row.metodoPago,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Documento",
      selector: (row) => row.documento,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaVenta,
      sortable: true,
      wrap: true,
      center: true,
    },
  ];
  return (
    <div className="card shadow-sm">
      <div className="card-header p-3 border-bottom">
        <h5 className="titulo-card-especial">Resumen Venta del día</h5>
      </div>

      <div className="card-body p-3">
        {/* Resumen de ventas */}
        <div className="row g-4 ">
          <div className="col-md-8 ">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <CashOutline
                      height="50px"
                      width="50px"
                      color="#488e98"
                      className="me-3"
                    />
                    <div className="w-100 text-end">
                      <h5 className="mb-1">Total de Ventas</h5>
                      <h4 className="card-text text-end text-truncate">
                        S/.{Number(totalVentas).toFixed(2)}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <WalletOutline
                      height="50px"
                      width="50px"
                      color="#486998"
                      className="me-3"
                    />
                    <div className="w-100 text-end">
                      <h5 className="mb-1">Dinero al Inicio</h5>
                      <h4 className="card-text text-end text-truncate">
                        S/.{montoInicial}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <BarChartOutline
                      height="50px"
                      width="50px"
                      color="#98486b"
                      className="me-3"
                    />
                    <div className="w-100 text-end">
                      <h5 className="mb-1">Dinero en Caja</h5>
                      <h4 className="card-text text-end text-truncate">
                        S/.
                        {sumaTotal}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="card border">
                  <div className="card-header">
                    <h5>Ventas Realizadas</h5>
                  </div>
                  <div className="card-body">
                    <DataTable
                      className="tablaGeneral"
                      columns={columns}
                      data={detallesVentas}
                      pagination
                      responsive
                      dense
                      fixedHeader
                      customStyles={customDataTableStyles}
                      fixedHeaderScrollHeight="500px"
                      striped={true}
                      paginationComponentOptions={{
                        rowsPerPageText: "Filas por página:",
                        rangeSeparatorText: "de",
                        selectAllRowsItem: true,
                        selectAllRowsItemText: "Todos",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 ">
            <div className="card border p-3 h-100">
              <div className="card-header p-0">
                <h5>Detalles de caja</h5>
              </div>
              <div className="card-body mt-0">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={sumaTotal}
                    {...register("montoVendido", {
                      required: "Este campo es requerido",
                      validate: validatePrecio,
                    })}
                    onInput={handlePrecioInput}
                  />
                  <label>Monto Vendido S/.</label>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    value={0}
                    {...register("montoDejar", {
                      required: "Este campo es requerido",
                      validate: validatePrecio,
                    })}
                    onInput={handlePrecioInput}
                  />
                  <label>Monto a Dejar</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer text-center">
        <button
          className="btn btn-danger px-4 py-2"
          onClick={() => handleQuestionCaja(caja)}
        >
          <LockClosedOutline color={"auto"} /> Cerrar Caja
        </button>
      </div>
      <ModalAlertQuestion
        show={openModal}
        idEliminar={idCaja}
        nombre={tituloModal}
        tipo={"Caja"}
        handleEliminar={handleCerrarCaja}
        handleCloseModal={handleQuestionClose}
      />
    </div>
  );
}
