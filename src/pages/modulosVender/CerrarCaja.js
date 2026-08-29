import { useEffect, useRef, useState } from "react";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import {
  BanknoteArrowDown,
  Calendar,
  Clock,
  CreditCard,
  Lock,
  Printer,
  TrendingUp,
  User,
  Wallet,
  WalletMinimal,
  PieChart,
} from "lucide-react";
import { cerrarCaja } from "../../redux/cajaSlice";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { TicketCerrarCaja } from "../../components/componenteVender/TiketsType/TicketCerrarCaja";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { BtnVer } from "../../components/componentesReutilizables/BotonesAccion";
import { ModalDetallesVentas } from "../../components/componentesVentas/ModalDetallesVentas";
import { GetMetodosPago } from "../../service/accionesVentas/GetMetodosPago";

import "../../css/EstilosCerrarCaja.css";

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

  const [modalDetallesVenta, setModalDetallesVenta] = useState(false);
  const [dataVentas, setDataVentas] = useState([]);
  // PARA LA BUSQUEDA
  const [busqueda, setBusqueda] = useState("");
  const [metodoFiltro, setMetodoFiltro] = useState("TODOS"); // "TODOS" para mostrar todo por defecto

  const [openModal, setOpenModal] = useState(false);
  const [tituloModal, setTituloModal] = useState(null);
  const [idCaja, setIdCaja] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const caja = JSON.parse(
    localStorage.getItem("caja") || sessionStorage.getItem("caja"),
  );

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

  const listaVentas = cajaData?.detallesVenta || [];

  // Filtramos dinámicamente según el texto de búsqueda y el método seleccionado
  const ventasFiltradas = listaVentas.filter((item) => {
    // Coincidencia por texto (busca en pedido, documento o vendedor)
    const textoMatch =
      item.pedido.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.vendedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.documento.toLowerCase().includes(busqueda.toLowerCase());

    // Coincidencia por método de pago
    const metodoMatch =
      metodoFiltro === "TODOS" ||
      item.metodoPago.toLowerCase() === metodoFiltro.toLowerCase();

    return textoMatch && metodoMatch;
  });
  // ============================
  const {
    data: dataMetodos = [],
    isLoading: loadingMetodo,
    isError: loadingError,
  } = useQuery({
    queryKey: ["metodosPagos"],
    queryFn: GetMetodosPago,
  });

  const componentRef = useRef();
  const [datosCerrarCaja, setDatosCerrarCaja] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosCerrarCaja(null);
    },
  });

 const handleImprimirCaja = async () => {
    const dataActual = cajaData?.data || cajaData;
    if (!dataActual) {
      ToastAlert("error", "No hay datos registrados en esta caja");
      return;
    }

    // Armamos el paquete estructurado que espera nuestro backend
    const payload = {
      nombreCaja: caja?.nombre || "Caja Principal",
      cajero: `${dataActual.datosRegistroCaja?.usuario?.empleado?.persona?.nombre} ${dataActual.datosRegistroCaja?.usuario?.empleado?.persona?.apellidos || ""}`,
      fechaApertura: dataActual.datosRegistroCaja?.fechaApertura,
      horaApertura: dataActual.datosRegistroCaja?.horaApertura,
      montoInicial: dataActual.montoInicial,
      totalVenta: dataActual.totalVenta,
      fisicoEsperado: dataActual.fisicoEsperado,
      totalesPorMetodo: dataActual.totalesPorMetodo,
      // 🔥 NUEVO: Enviamos el historial de transacciones
      detallesVenta: dataActual.detallesVenta || [], 
    };

    try {
      const response = await axiosInstance.post("/cajas/imprimirCierre", payload);
      if (response.data.success) {
        ToastAlert("success", "Imprimiendo Arqueo de Caja...");
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error al enviar la impresión al servidor");
    }
  };

  useEffect(() => {
    if (cajaData?.totalVenta !== undefined) {
      const montoVendido = Number(cajaData.totalVenta).toFixed(2);
      setValue("montoVendido", montoVendido, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [cajaData, setValue]);

  // --- NUEVOS CÁLCULOS DEL BACKEND ---
  const fisicoEsperado = cajaData?.fisicoEsperado
    ? Number(cajaData.fisicoEsperado).toFixed(2)
    : "0.00";

  const totalesPorMetodo = cajaData?.totalesPorMetodo || {};

 const handleCerrarCaja = async (id) => {
    const sumaTotalFormatted = parseFloat(fisicoEsperado).toFixed(2);
    const montoDejarFormatted = parseFloat(getValues("montoDejar")).toFixed(2);

    if (isNaN(sumaTotalFormatted) || isNaN(montoDejarFormatted)) {
      ToastAlert("error", "Los montos deben ser números válidos.");
      return;
    }

    try {
      // 🔥 NUEVO: Mandamos a imprimir automáticamente el arqueo antes de cerrar
      await handleImprimirCaja();

      // Luego procedemos a cerrar la caja en el backend
      const response = await axiosInstance.put(`/cajas/closeCaja/${id}`, {
        sumaTotalFormatted,
        montoDejarFormatted,
      });

      if (response.data.success) {
        localStorage.removeItem("caja");
        sessionStorage.removeItem("caja");
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
      selector: (row) => row.ventaOriginal.id,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Total",
      selector: (row) => `S/. ${Number(row.total).toFixed(2)}`,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Metodo Pago",
      selector: (row) => (
        <span className="text-capitalize">{row.metodoPago}</span>
      ),
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Documento",
      selector: (row) =>
        row.documento === "S"
          ? "Boleta Simple"
          : row.documento === "F"
            ? "Factura"
            : "Boleta",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Vendedor",
      selector: (row) => row.vendedor,
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
    {
      name: "Detalles",
      cell: (row) => (
        <div className="d-flex ">
          <BtnVer
            onClick={() => {
              setDataVentas(row.ventaOriginal);
              setModalDetallesVenta(true);
            }}
            title="Ver Detalles de Venta"
          />
        </div>
      ),
      center: true,
      grow: 0,
    },
  ];

  if (isLoading) return <div>Cargando datos de caja...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container d-flex align-items-center justify-content-center ">
      <div className="card h-100 overflow-auto border">
        <div className="card-header p-3 border-bottom d-flex align-content-center align-items-center bg-white">
          <h5 className="titulo-card-especial mb-0">Arqueo y Cierre de Caja</h5>
          <div className="badge px-3 py-2 ms-auto bg-dark border">
            <span className="h5 mb-0 text-white">{caja?.nombre}</span>
          </div>
        </div>

        <div className="card-body p-4 h-100 ">
          <div className="row g-4 h-100">
            {/* LADO IZQUIERDO: Tarjetas y Tabla */}
            <div className="col-md-8 h-100">
              <div className="row g-3">
                {/* TARJETA 1 (Fondo Inicial) */}
                <div className="col-md-4">
                  <div
                    className="card h-100"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Azul
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(74, 105, 189, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "rgba(74, 105, 189, 0.12)",
                          }}
                        >
                          <WalletMinimal
                            size={22}
                            color="#4A69BD"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-muted fw-semibold small">
                          Fondo Inicial
                        </p>
                        <h3
                          className="fw-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {Number(cajaData?.montoInicial || 0).toFixed(2)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TARJETA 2 (Efectivo Físico) */}
                <div className="col-md-4">
                  <div
                    className="card h-100"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Rosa/Rojo
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(196, 69, 105, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "rgba(255, 0, 0, 0.12)",
                          }}
                        >
                          <BanknoteArrowDown
                            size={22}
                            color="#c44545"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-muted fw-semibold small">
                          Efectivo Físico
                        </p>
                        <h3
                          className="fw-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {fisicoEsperado}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TARJETA 3 (Monto Vendido Total) */}
                <div className="col-md-4">
                  <div
                    className="card h-100"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Verde
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(34, 190, 55, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "rgba(38, 199, 17, 0.12)",
                          }}
                        >
                          <TrendingUp
                            size={22}
                            color="#1ab92f"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-muted fw-semibold small">
                          Total Vendido
                        </p>
                        <h3
                          className="fw-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {Number(cajaData?.totalVenta || 0).toFixed(2)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESGLOSE POR MÉTODO DE PAGO */}
                <div className="col-md-12">
                  <div className="card border bg-white p-3">
                    <div className="d-flex align-items-center mb-3">
                      <PieChart className="text-secondary me-2" size={18} />
                      <h6 className="fw-bold mb-0 text-secondary">
                        Desglose de Ingresos
                      </h6>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.keys(totalesPorMetodo).length > 0 ? (
                        Object.entries(totalesPorMetodo).map(
                          ([metodo, monto]) => (
                            <div
                              key={metodo}
                              className="border rounded px-3 py-2 bg-light d-flex justify-content-between align-items-center flex-grow-1"
                              style={{ minWidth: "160px" }}
                            >
                              <span className="text-capitalize text-muted small fw-semibold me-3">
                                {metodo}
                              </span>
                              <span className="fw-bold text-dark fs-6">
                                S/. {Number(monto).toFixed(2)}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-muted small mb-0 w-100 text-center py-2">
                          No hay ventas registradas aún.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* TABLA DE VENTAS */}
                <div className="col-md-12">
                  <div className="card border py-2 bg-white">
                    <div className="card-header bg-white border-bottom-0 pb-3">
                      <p className="fw-bold text-secondary mb-2">
                        Historial de Transacciones
                      </p>
                      <div className="d-flex  gap-2 align-items-center">
                        {/* Input de Búsqueda */}
                        <div>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Buscar por pedido, vendedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ minWidth: "220px" }}
                          />
                        </div>
                        <div className="filtro-metodos">
                          <button
                            type="button"
                            className={metodoFiltro === "TODOS" ? "activo" : ""}
                            onClick={() => setMetodoFiltro("TODOS")}
                          >
                            Todos
                          </button>

                          {dataMetodos.map((metodo) => (
                            <button
                              key={metodo.id || metodo.nombre}
                              type="button"
                              className={
                                metodoFiltro.toLowerCase() ===
                                metodo.nombre.toLowerCase()
                                  ? "activo"
                                  : ""
                              }
                              onClick={() => setMetodoFiltro(metodo.nombre)}
                            >
                              {metodo.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0 border-top">
                      <TablasGenerales
                        datos={ventasFiltradas}
                        columnas={columns}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: Detalles y Acciones */}
            <div className="col-md-4 h-100">
              <div className="card border  h-100 d-flex flex-column">
                <div className="card-header border-bottom  p-3">
                  <div className="d-flex align-items-center">
                    <div className=" alert alert-danger rounded p-2 me-3">
                      <CreditCard className="text-danger" size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">
                        Detalles de Operación
                      </h6>
                      <p className="text-muted small mb-0">Auditoría de caja</p>
                    </div>
                  </div>
                </div>

                <div className="card-body d-flex flex-column p-3">
                  {/* Información de Apertura */}
                  <div className="bg-light rounded p-3 mb-4 border">
                    <div className="d-flex flex-column mb-3 border-bottom pb-2">
                      <div className="d-flex align-items-center mb-1">
                        <User className="text-secondary me-2" size={16} />
                        <span className="fw-semibold small text-secondary">
                          Cajero / Usuario
                        </span>
                      </div>
                      <span className="text-dark fw-bold ps-4">
                        {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                          ?.nombre +
                          " " +
                          (cajaData?.datosRegistroCaja?.usuario?.empleado
                            ?.persona?.apellidos || "")}
                      </span>
                    </div>

                    <div className="d-flex flex-column mb-3 border-bottom pb-2">
                      <div className="d-flex align-items-center mb-1">
                        <Calendar className="text-secondary me-2" size={16} />
                        <span className="fw-semibold small text-secondary">
                          Fecha de Apertura
                        </span>
                      </div>
                      <span className="text-dark fw-bold ps-4">
                        {cajaData?.datosRegistroCaja?.fechaApertura}
                      </span>
                    </div>

                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-1">
                        <Clock className="text-secondary me-2" size={16} />
                        <span className="fw-semibold small text-secondary">
                          Hora de Apertura
                        </span>
                      </div>
                      <span className="text-dark fw-bold ps-4">
                        {cajaData?.datosRegistroCaja?.horaApertura}
                      </span>
                    </div>
                  </div>

                  {/* Inputs de Cierre */}
                  <div className="bg-white rounded p-3 border mb-4 flex-grow-1">
                    <div className="mb-4">
                      <label className="text-secondary small fw-semibold mb-1 d-block">
                        Total Vendido Declarado
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 bg-light fs-5 fw-bold text-success text-end"
                        style={{ height: "55px" }}
                        readOnly
                        {...register("montoVendido", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-secondary small fw-semibold mb-1 d-flex align-items-center">
                        <Wallet className="me-2 text-secondary" size={16} />
                        Monto Físico a Dejar en Cajón
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 bg-white fs-5 fw-bold text-primary text-end"
                        style={{ height: "55px" }}
                        defaultValue="0"
                        {...register("montoDejar", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                        onInput={handlePrecioInput}
                      />
                      <small className="text-muted mt-1 d-block">
                        Fondo de inicio para el siguiente turno
                      </small>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="d-flex flex-column gap-3 mt-auto">
                    <BotonAnimado
                      onClick={handleImprimirCaja}
                      loading={isLoading}
                      error={error}
                      className="btn btn-light px-4 py-3 border-2 border-dark text-dark fw-bold"
                      icon={<Printer className="me-2" size={20} />}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        Imprimir Arqueo
                      </span>
                    </BotonAnimado>

                   

                    <BotonAnimado
                      loading={isLoading}
                      error={error}
                      className="btn btn-outline-danger border-2 px-4 py-3 fw-bold bg-danger text-white hover-outline"
                      onClick={() => handleQuestionCaja(caja)}
                      icon={<Lock className="me-2" size={20} />}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        Cerrar Turno y Caja
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
        <ModalRight
          isOpen={modalDetallesVenta}
          onClose={() => setModalDetallesVenta(false)}
          title="Detalles de la Venta"
          submitText="Imprimir"
          cancelText="Cerrar"
          hideFooter={true}
        >
          <ModalDetallesVentas dataVentas={dataVentas} />
        </ModalRight>
      </div>
    </div>
  );
}
