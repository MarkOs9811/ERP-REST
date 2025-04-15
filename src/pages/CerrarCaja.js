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
import DataTable from "react-data-table-component";
import customDataTableStyles from "../css/estilosComponentesTable/DataTableStyles";
import { useQuery } from "@tanstack/react-query";

export const fetchCajaClose = async (cajaId) => {
  try {
    const response = await axiosInstance.get(`/caja/getCajaClose/${cajaId}`);
    if (!response.data.success) {
      throw new Error("Error en los datos de la caja");
    }

    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener caja: ${error.message}`);
  }
};

export function CerrarCaja() {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [openModal, setOpenModal] = useState(false);
  const [tituloModal, setTituloModal] = useState(null);
  const [idCaja, setIdCaja] = useState(null);
  const navigate = useNavigate();
  const caja = JSON.parse(localStorage.getItem("caja"));

  // Consulta con React Query para obtener los datos de la caja
  const {
    data: cajaData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cajaClose", caja?.id],
    queryFn: () => fetchCajaClose(caja?.id),
    enabled: !!caja?.id,
  });
  useEffect(() => {
    if (
      cajaData?.totalVenta !== undefined &&
      cajaData?.montoInicial !== undefined
    ) {
      const montoVendido = (
        Number(cajaData.totalVenta) + Number(cajaData.montoInicial)
      ).toFixed(2);
      setValue("montoVendido", montoVendido, {
        shouldValidate: true, // Opcional: valida el campo después de actualizar
        shouldDirty: true, // Opcional: marca el campo como "dirty"
      });
    }
  }, [cajaData, setValue]); // Dependencias del efecto

  // Calculamos valores derivados
  const sumaTotal = cajaData
    ? (
        parseFloat(cajaData?.totalVenta || 0) +
        parseFloat(cajaData?.montoInicial || 0)
      ).toFixed(2)
    : "0.00";

  const handleCerrarCaja = async (id) => {
    const sumaTotalFormatted = parseFloat(sumaTotal).toFixed(2);
    const montoDejarFormatted = parseFloat(getValues("montoDejar")).toFixed(2);

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
        navigate("/abrirCaja");
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

  if (isLoading) return <div>Cargando datos de caja...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container-fluid p-0 w-100 h-100">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="card shadow h-100">
            <div className="card-header p-3 border-bottom">
              <h5 className="titulo-card-especial">Resumen Venta del día</h5>
            </div>

            <div className="card-body p-2 h-100">
              <div className="row g-2 h-100">
                <div className="col-md-8">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <div className="card border h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                          <CashOutline
                            height="50px"
                            width="50px"
                            color="#488e98"
                            className="me-3"
                          />
                          <div className="w-100 text-end">
                            <h5 className="mb-1">Total de Ventas</h5>
                            <h4 className="card-text text-end ">
                              S/.{Number(cajaData?.totalVenta || 0).toFixed(2)}
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
                            <h4 className="card-text text-end ">
                              S/.
                              {Number(cajaData?.montoInicial || 0).toFixed(2)}
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
                            <h4 className="card-text text-end ">
                              S/.{sumaTotal}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card border h-100">
                        <div className="card-header">
                          <h5>Ventas Realizadas</h5>
                        </div>
                        <div className="card-body p-0 h-100">
                          <DataTable
                            className="tablaGeneral"
                            columns={columns}
                            data={cajaData?.detallesVenta || []}
                            pagination
                            responsive
                            dense
                            fixedHeader
                            customStyles={customDataTableStyles}
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

                <div className="col-md-4">
                  <div className="card border p-3 h-100">
                    <div className="card-header p-0">
                      <h5>Detalles de caja</h5>
                    </div>
                    <div className="card-body mt-0">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          readOnly
                          {...register("montoVendido", {
                            required: "Este campo es requerido",
                            validate: validatePrecio,
                          })}
                        />
                        <label>Monto Vendido S/.</label>
                      </div>
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="0"
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

            <div className="card-footer  bg-white text-center">
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
        </div>
      </div>
    </div>
  );
}
