import React, { useEffect, useState } from "react";

import ModalAlertQuestion from "../components/componenteToast/ModalAlertQuestion";
import axiosInstance from "../api/AxiosInstance";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { handlePrecioInput, validatePrecio } from "../hooks/InputHandlers";
import { useForm } from "react-hook-form";

import { useQuery } from "@tanstack/react-query";
import { TablasGenerales } from "../components/componentesReutilizables/TablasGenerales";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import BotonAnimado from "../components/componentesReutilizables/BotonAnimado";
import {
  BanknoteArrowDown,
  Calendar,
  ChartColumnBig,
  Clock,
  CreditCard,
  DollarSign,
  Lock,
  LockIcon,
  Printer,
  TrendingUp,
  User,
  Wallet,
  WalletMinimal,
} from "lucide-react";
import { cerrarCaja } from "../redux/cajaSlice";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
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
      // Convierte a número y haz la operación, luego formatea
      const montoVendido = (
        Number(cajaData.totalVenta) - Number(cajaData.montoInicial)
      ).toFixed(2);

      setValue("montoVendido", montoVendido, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [cajaData, setValue]);

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
        dispatch(cerrarCaja());
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
    <div className="container d-flex align-items-center justify-content-center h-100">
      <div className="card shadow-sm h-100">
        <div className="card-header p-3 border-bottom d-flex align-content-center align-items-center">
          <h5 className="titulo-card-especial">Resumen Venta del día</h5>
          <div className="badge  px-3 p-0 ms-auto bg-dark pt-2">
            <p className="h4 text-auto">{caja?.nombre}</p>
          </div>
        </div>

        <div className="card-body p-3 h-100">
          <div className="row g-3  h-100">
            <div className="col-md-8 h-100">
              <div className="row g-3">
                <div className="col-md-4">
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #d14e6fff 0%, #ffe2e7ff 100%)",
                    }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="bg-white bg-opacity-50 rounded-circle p-2">
                        <BanknoteArrowDown
                          height="40px"
                          width="40px"
                          color="#C44569"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="w-100 text-end">
                        <p className="mb-1 fw-semibold text-dark opacity-90">
                          Total de Ventas
                        </p>
                        <p className="card-text text-end fw-bold h5 mb-0 text-dark">
                          S/.{Number(cajaData?.totalVenta || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #C2E9FB 0%, #A1C4FD 100%)",
                    }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="bg-white bg-opacity-50 rounded-circle p-2">
                        <WalletMinimal
                          height="40px"
                          width="40px"
                          color="#4A69BD"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="w-100 text-end">
                        <p className="mb-1 fw-semibold text-dark opacity-90">
                          Dinero al Inicio
                        </p>
                        <p className="card-text text-end fw-bold h5 mb-0 text-dark">
                          S/.{Number(cajaData?.montoInicial || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
                    }}
                  >
                    <div className="card-body d-flex align-items-center justify-content-between p-3">
                      <div className="bg-white bg-opacity-50 rounded-circle p-2">
                        <TrendingUp
                          height="40px"
                          width="40px"
                          color="#38A169"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="w-100 text-end">
                        <p className="mb-1 fw-semibold text-dark opacity-90">
                          Ganancias
                        </p>
                        <p className="card-text text-end fw-bold h5 mb-0 text-dark">
                          S/.
                          {Number(
                            (cajaData?.totalVenta || 0) -
                              (cajaData?.montoInicial || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card border  py-2">
                    <div className="card-header">
                      <p>Ventas Realizadas</p>
                    </div>
                    <div className="card-body p-0 ">
                      <TablasGenerales
                        datos={cajaData?.detallesVenta || []}
                        columnas={columns}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 h-100">
              <div className="card border h-100">
                <div className="card-header bg-white border-0 pb-0">
                  <div className="d-flex align-items-center">
                    <div className="alert alert-primary rounded p-2 me-3">
                      <CreditCard className="text-primary" size={24} />
                    </div>
                    <div>
                      <h5 className="fw-bold  mb-0">Detalles de Caja</h5>
                      <p className="text-muted small mb-0">
                        Resumen de operaciones
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  {/* Información de Apertura */}
                  <div className="bg-white rounded-3 p-3 mb-4 shadow-sm">
                    <div className="d-flex flex-column align-items-left mb-3">
                      <div className="d-flex">
                        <User className="text-muted me-2" size={18} />
                        <h6 className="fw-semibold small text-dark mb-0">
                          Usuario de Apertura
                        </h6>
                      </div>

                      <p className="text-dark fs-6 mb-3 ps-4">
                        {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                          ?.nombre +
                          " " +
                          cajaData?.datosRegistroCaja?.usuario?.empleado
                            ?.persona?.apellidos}
                      </p>
                    </div>

                    <div className="d-flex flex-column align-items-left mb-3">
                      <div className="d-flex">
                        <Calendar className="text-muted me-2" size={18} />
                        <h6 className="fw-semibold small text-dark mb-0">
                          Fecha de Apertura
                        </h6>
                      </div>

                      <p className="text-dark fs-6 mb-3 ps-4">
                        {cajaData?.datosRegistroCaja?.fechaApertura}
                      </p>
                    </div>

                    <div className="d-flex flex-column align-items-left mb-2">
                      <div className="d-flex">
                        <Clock className="text-muted me-2" size={18} />
                        <h6 className="fw-semibold small text-dark mb-0">
                          Hora de Apertura
                        </h6>
                      </div>
                      <p className="text-dark fs-6 ps-4">
                        {cajaData?.datosRegistroCaja?.horaApertura}
                      </p>
                    </div>
                  </div>

                  {/* Montos */}
                  <div className="bg-white rounded-3 p-3 shadow-sm">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control border-0 bg-light fs-5 fw-bold text-success"
                        style={{ height: "60px" }}
                        readOnly
                        {...register("montoVendido", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                      />
                      <label className="text-muted">Monto Vendido S/.</label>
                    </div>

                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light fs-5 fw-bold text-primary"
                        style={{ height: "60px" }}
                        defaultValue="0"
                        {...register("montoDejar", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                        onInput={handlePrecioInput}
                      />
                      <label className="text-muted">
                        <Wallet className="me-2" size={16} />
                        Monto a Dejar
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer con Botones */}
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex flex-column gap-3">
                    <BotonAnimado
                      loading={isLoading}
                      error={error}
                      className="btn btn-outline-dark px-4 py-3 rounded-3 fw-semibold border-2"
                      icon={<Printer className="me-2" size={20} />}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        Solo Imprimir
                      </span>
                    </BotonAnimado>

                    <BotonAnimado
                      loading={isLoading}
                      error={error}
                      className="btn btn-danger px-4 py-3 rounded-3 fw-semibold shadow"
                      onClick={() => handleQuestionCaja(caja)}
                      icon={<Lock className="me-2" size={20} />}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        Cerrar Caja
                      </span>
                    </BotonAnimado>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  );
}
