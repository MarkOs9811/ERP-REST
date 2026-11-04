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


import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      const response = await axiosInstance.post(
        "/cajas/imprimirCierre",
        payload,
      );
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
      selector: (row) => <span className="capitalize">{row.metodoPago}</span>,
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
        <div className="flex">
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
    <div className="mx-auto w-full max-w-7xl px-4 flex items-center justify-center">
      <Card className="h-full overflow-auto border">
        <CardHeader className="p-3 border-b flex align-content-center items-center bg-background">
          <h5 className="titulo-card-especial mb-0">Arqueo y Cierre de Caja</h5>
          <div className="inline-flex items-center rounded-full text-xs font-semibold transition-colors px-3 py-2 ms-auto bg-foreground border">
            <span className="h5 mb-0 text-white">{caja?.nombre}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 h-full">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* LADO IZQUIERDO: Tarjetas y Tabla */}
            <div className="col-span-full md:col-span-8 h-full">
              <div className="grid grid-cols-12 gap-3">
                {/* TARJETA 1 (Fondo Inicial) */}
                <div className="col-span-full md:col-span-4">
                  <Card
                    className="h-full"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Azul
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(74, 105, 189, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <CardContent className="p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className="flex items-center justify-center rounded-full"
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
                        <p className="mb-1 text-muted-foreground font-semibold text-sm">
                          Fondo Inicial
                        </p>
                        <h3
                          className="font-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {Number(cajaData?.montoInicial || 0).toFixed(2)}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* TARJETA 2 (Efectivo Físico) */}
                <div className="col-span-full md:col-span-4">
                  <Card
                    className="h-full"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Rosa/Rojo
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(196, 69, 105, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <CardContent className="p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className="flex items-center justify-center rounded-full"
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
                        <p className="mb-1 text-muted-foreground font-semibold text-sm">
                          Efectivo Físico
                        </p>
                        <h3
                          className="font-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {fisicoEsperado}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* TARJETA 3 (Monto Vendido Total) */}
                <div className="col-span-full md:col-span-4">
                  <Card
                    className="h-full"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #eaeaea",
                      borderRadius: "16px",
                      // Efecto Aura Verde
                      backgroundImage:
                        "radial-gradient(circle at top left, rgba(34, 190, 55, 0.08) 0%, transparent 70%)",
                    }}
                  >
                    <CardContent className="p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className="flex items-center justify-center rounded-full"
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
                        <p className="mb-1 text-muted-foreground font-semibold text-sm">
                          Total Vendido
                        </p>
                        <h3
                          className="font-bold mb-0"
                          style={{ color: "#2d3436" }}
                        >
                          S/. {Number(cajaData?.totalVenta || 0).toFixed(2)}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* DESGLOSE POR MÉTODO DE PAGO */}
                <div className="col-span-full md:col-span-12">
                  <Card className="border bg-background p-3">
                    <div className="flex items-center mb-3">
                      <PieChart
                        className="text-muted-foreground me-2"
                        size={18}
                      />
                      <h6 className="font-bold mb-0 text-muted-foreground">
                        Desglose de Ingresos
                      </h6>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(totalesPorMetodo).length > 0 ? (
                        Object.entries(totalesPorMetodo).map(
                          ([metodo, monto]) => (
                            <div
                              key={metodo}
                              className="border rounded px-3 py-2 bg-muted flex justify-between items-center grow"
                              style={{ minWidth: "160px" }}
                            >
                              <span className="text-muted-foreground text-sm font-semibold me-3">
                                {metodo}
                              </span>
                              <span className="font-bold text-foreground text-base">
                                S/. {Number(monto).toFixed(2)}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-muted-foreground text-sm mb-0 w-full text-center py-2">
                          No hay ventas registradas aún.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>

                {/* TABLA DE VENTAS */}
                <div className="col-span-full md:col-span-12">
                  <Card className="border py-2 bg-background">
                    <CardHeader className="bg-background border-b-0 pb-3">
                      <p className="font-bold text-muted-foreground mb-2">
                        Historial de Transacciones
                      </p>
                      <div className="flex gap-2 items-center">
                        {/* Input de Búsqueda */}
                        <div>
                          <input
                            type="search"
                            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
                            placeholder="Buscar por pedido, vendedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ minWidth: "220px" }}
                          />
                        </div>
                        <div className="filtro-metodos">
                          <Button
                            type="button"
                            className={metodoFiltro === "TODOS" ? "activo" : ""}
                            onClick={() => setMetodoFiltro("TODOS")}
                            variant="default"
                          >
                            Todos
                          </Button>

                          {dataMetodos.map((metodo) => (
                            <Button
                              key={metodo.id || metodo.nombre}
                              type="button"
                              className={
                                metodoFiltro.toLowerCase() ===
                                metodo.nombre.toLowerCase()
                                  ? "activo"
                                  : ""
                              }
                              onClick={() => setMetodoFiltro(metodo.nombre)}
                              variant="default"
                            >
                              {metodo.nombre}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 border-t">
                      <TablasGenerales
                        datos={ventasFiltradas}
                        columnas={columns}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: Detalles y Acciones */}
            <div className="col-span-full md:col-span-4 h-full">
              <Card className="border h-full flex flex-col">
                <CardHeader className="border-b p-3">
                  <div className="flex items-center">
                    <div className="relative w-full text-sm border-destructive/30 bg-destructive/10 text-destructive rounded p-2 me-3">
                      <CreditCard className="text-destructive" size={20} />
                    </div>
                    <div>
                      <h6 className="font-bold text-foreground mb-0">
                        Detalles de Operación
                      </h6>
                      <p className="text-muted-foreground text-sm mb-0">
                        Auditoría de caja
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col p-3">
                  {/* Información de Apertura */}
                  <div className="bg-muted rounded p-3 mb-4 border">
                    <div className="flex flex-col mb-3 border-b pb-2">
                      <div className="flex items-center mb-1">
                        <User
                          className="text-muted-foreground me-2"
                          size={16}
                        />
                        <span className="font-semibold text-sm text-muted-foreground">
                          Cajero / Usuario
                        </span>
                      </div>
                      <span className="text-foreground font-bold ps-4">
                        {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                          ?.nombre +
                          " " +
                          (cajaData?.datosRegistroCaja?.usuario?.empleado
                            ?.persona?.apellidos || "")}
                      </span>
                    </div>

                    <div className="flex flex-col mb-3 border-b pb-2">
                      <div className="flex items-center mb-1">
                        <Calendar
                          className="text-muted-foreground me-2"
                          size={16}
                        />
                        <span className="font-semibold text-sm text-muted-foreground">
                          Fecha de Apertura
                        </span>
                      </div>
                      <span className="text-foreground font-bold ps-4">
                        {cajaData?.datosRegistroCaja?.fechaApertura}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <Clock
                          className="text-muted-foreground me-2"
                          size={16}
                        />
                        <span className="font-semibold text-sm text-muted-foreground">
                          Hora de Apertura
                        </span>
                      </div>
                      <span className="text-foreground font-bold ps-4">
                        {cajaData?.datosRegistroCaja?.horaApertura}
                      </span>
                    </div>
                  </div>

                  {/* Inputs de Cierre */}
                  <div className="bg-background rounded p-3 mb-4 grow">
                    <div className="mb-4">
                      <label className="text-muted-foreground text-sm font-semibold mb-1 block">
                        Total Vendido Declarado
                      </label>
                      <input
                        type="text"
                        className="h-9 w-full rounded-md border-input px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 bg-muted text-lg font-bold text-emerald-600 dark:text-emerald-400 text-right"
                        style={{ height: "55px" }}
                        readOnly
                        {...register("montoVendido", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-muted-foreground text-sm font-semibold mb-1 flex items-center">
                        <Wallet
                          className="me-2 text-muted-foreground"
                          size={16}
                        />
                        Monto Físico a Dejar en Cajón
                      </label>
                      <input
                        type="text"
                        className="h-9 w-full rounded-md border-input px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 bg-background text-lg font-bold text-primary text-right"
                        style={{ height: "55px" }}
                        defaultValue="0"
                        {...register("montoDejar", {
                          required: "Este campo es requerido",
                          validate: validatePrecio,
                        })}
                        onInput={handlePrecioInput}
                      />
                      <small className="text-muted-foreground mt-1 block">
                        Fondo de inicio para el siguiente turno
                      </small>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <BotonAnimado
                      onClick={handleImprimirCaja}
                      loading={isLoading}
                      error={error}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted shadow-sm hover:bg-muted/80 px-4 py-3 border-2 border-dark text-foreground font-bold"
                      icon={<Printer className="me-2" size={20} />}
                    >
                      <span className="flex items-center justify-center">
                        Imprimir Arqueo
                      </span>
                    </BotonAnimado>

                    <BotonAnimado
                      loading={isLoading}
                      error={error}
                      className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive hover:bg-destructive/10 border-2 px-4 py-3 font-bold bg-destructive text-white hover-outline"
                      onClick={() => handleQuestionCaja(caja)}
                      icon={<Lock className="me-2" size={20} />}
                    >
                      <span className="flex items-center justify-center">
                        Cerrar Turno y Caja
                      </span>
                    </BotonAnimado>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>

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
      </Card>
    </div>
  );
}
