import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPreventaMesa } from "../../service/preventaService";

import "../../css/EstilosPreventa.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleInputChange,
  handleSelectChange,
} from "../../hooks/InputHandlers";
import { useForm } from "react-hook-form";
import { RealizarVenta } from "../../service/RealizarVentaService";
import ToastAlert from "../componenteToast/ToastAlert";
// import { useEstadoAsyn } from "../../hooks/EstadoAsync"; // YA NO LO USAREMOS AQUÍ PARA EVITAR EL AUTO-FALSE
import { OpcionesPago } from "./tareasVender/OpcionesPago";
import { clearPedidoLlevar } from "../../redux/pedidoLlevarSlice";
import { clearPedido } from "../../redux/pedidoSlice";
import { DetallePedido } from "./tareasVender/DetallePedido";
import { RealizarPago } from "./tareasVender/RealizarPago";
import { clearPedidoWeb } from "../../redux/pedidoWebSlice";
import { clearCuentaSeparada } from "../../redux/cuentaSeparadaSlice";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { TicketImpresion } from "./TiketsType/TicketImpresion";
import { FileText } from "lucide-react";

export function DetallesPago() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const caja = useSelector((state) => state.caja.caja);
  const estadoTipoVenta = useSelector((state) => state.tipoVenta.estado);
  const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
  const pedidoLlevar = useSelector((state) => state.pedidoLlevar);
  const pedidoWeb = useSelector((state) => state.pedidoWeb);

  const { idMesa: idMesaSeparada, itemsSeleccionados } = useSelector(
    (state) => state.cuentaSeparada,
  );
  const isSplitPayment =
    idMesaSeparada === idMesa && itemsSeleccionados.length > 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numeroCuotas, setNumeroCuotas] = useState("");

  const { idPedidoWeb } = useParams();

  const componentRef = useRef();
  const [datosVenta, setDatosVenta] = useState(null);
  const [nombreReferencia, setNombreCliente] = useState("");

  // === ESTADO DE BLOQUEO MANUAL ===
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosVenta(null);
      ejecutarNavegacionFinal();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const {
    data: preventasMesa,
    isLoading,
    isError,
    error: errorPreventaMesa,
  } = useQuery({
    queryKey: ["preventasMesa", idMesa, caja?.id],
    queryFn: () => getPreventaMesa(idMesa, caja.id),
    enabled: !!idMesa && !!caja?.id,
  });

  let preventas = [];

  if (estadoTipoVenta === "llevar") {
    preventas = pedidoLlevar.items;
  } else if (estadoTipoVenta === "web") {
    preventas = pedidoWeb.items;
  } else if (idMesa && caja?.id) {
    if (isSplitPayment) {
      preventas = itemsSeleccionados.map((item) => ({
        ...item,
        plato:
          typeof item.plato === "string"
            ? { nombre: item.plato, precio: item.precio }
            : item.plato,
        precio: item.precio,
      }));
    } else {
      preventas = preventasMesa ?? [];
    }
  }

  const mesa = preventasMesa?.[0]?.mesa?.numero ?? null;

  const totalPreventa = (preventas ?? [])
    .reduce(
      (acc, item) => acc + item.cantidad * (item.plato?.precio || item.precio),
      0,
    )
    .toFixed(2);

  const igv = (totalPreventa * 0.18).toFixed(2);

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [tipoComporbante, setTipoComporbante] = useState(false);
  const [typeTarjeta, setTypeTarjeta] = useState(null);
  const [tarjetas, setTarjetas] = useState(false);
  const [cuotas, setCuotas] = useState(false);
  const [clienteBoleta, setClienteBoleta] = useState(false);
  const [clienteFactura, setClienteFactura] = useState(false);

  const handleSelectMetodo = (metodo) => {
    setMetodoSeleccionado(metodo);
    setComprobante(false);
    setTypeTarjeta(false);
    setClienteFactura(false);
    setClienteBoleta(false);
    if (metodo === "tarjeta") {
      setTipoComporbante(false);
    } else {
      setTipoComporbante(true);
    }
  };

  const handleSelectCardType = (estado) => {
    setTarjetas(estado);
    setCuotas(false);
  };

  const handleTypeTarjeta = (typeTarjeta) => {
    setTypeTarjeta(typeTarjeta);
    setTipoComporbante(true);
    setComprobante(null);
    setClienteFactura(false);
    setClienteBoleta(false);
    setCuotas(false);
  };

  const handleSlectComprobante = (comprobante) => {
    if (metodoSeleccionado === "tarjeta") {
      setComprobante(comprobante);
      if (comprobante === "F") {
        if (typeTarjeta === "debito") {
          setClienteFactura(true);
          setClienteBoleta(false);
          setCuotas(false);
        } else if (typeTarjeta === "credito") {
          setClienteFactura(true);
          setClienteBoleta(false);
          setCuotas(true);
        }
      } else {
        if (typeTarjeta === "debito") {
          setClienteFactura(false);
          setClienteBoleta(false);
          setCuotas(false);
        } else {
          setClienteFactura(false);
          setClienteBoleta(true);
          setCuotas(true);
        }
      }
    } else {
      setComprobante(comprobante);
      if (comprobante === "F") {
        setClienteFactura(true);
        setCuotas(false);
      } else {
        setClienteFactura(false);
        setCuotas(false);
      }
    }
  };

  const handleShowDatosClientes = (estado) => {
    setCuotas(estado);
  };

  const handleShowFactura = (estado) => {
    setCuotas(false);
  };

  const ejecutarNavegacionFinal = async () => {
    queryClient.invalidateQueries(["mesas"]);

    if (isSplitPayment) {
      dispatch(clearCuentaSeparada());
    }

    if (estadoTipoVenta === "llevar") {
      navigate("/vender/ventasLlevar");
      dispatch(clearPedidoLlevar());
    } else if (estadoTipoVenta === "web") {
      await Promise.all([
        queryClient.refetchQueries(["pedidosPendientes"]),
        queryClient.refetchQueries(["listaPedidosProceso"]),
        queryClient.refetchQueries(["listaPedidosListos"]),
      ]);
      navigate("/vender/pedidosWeb");
      dispatch(clearPedidoWeb());
    } else {
      navigate("/vender/mesas");
      dispatch(clearPedido());
    }
  };

  // === LÓGICA DE VENTA CON BLOQUEO MANUAL ===
  const realizarVentaPago = async (data, nombreReferencia) => {
    // 1. Iniciamos bloqueo
    setIsProcessing(true);

    try {
      const result = await RealizarVenta(data);

      if (result.success) {
        setDatosVenta(result.ticket);
        setNombreCliente(nombreReferencia);

        setTimeout(() => {
          if (componentRef.current) {
            handlePrint();
            ToastAlert("success", "Venta realizada con éxito");
            // OJO: NO desbloqueamos aquí (setIsProcessing(false))
            // Se quedará true hasta que el componente muera al navegar
          }
        }, 1000);
      } else {
        const mensajeDelBackend =
          result.message || "Error desconocido al realizar la venta";
        ToastAlert("error", mensajeDelBackend);
        setIsProcessing(false); // Si falló, desbloqueamos para reintentar
      }
    } catch (error) {
      const mensajeCritico =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error inesperado";
      ToastAlert("error", mensajeCritico);
      setIsProcessing(false); // Si hubo error de red, desbloqueamos
    }
  };

  const handleCrearJson = async (nombreReferenciaPrincipal) => {
    let datosCliente = {};
    let metodoPagoFinal = "";

    if (metodoSeleccionado === "tarjeta") {
      metodoPagoFinal = metodoSeleccionado + " " + (typeTarjeta || "");
      if (!typeTarjeta) {
        ToastAlert("warning", "Por favor seleccione el tipo de tarjeta");
        return;
      }
    } else {
      metodoPagoFinal = metodoSeleccionado;
    }

    if (comprobante === "F") {
      datosCliente = {
        ruc,
        razonSocial,
        direccion,
      };
      if (!ruc || !razonSocial || !direccion) {
        ToastAlert("warning", "Por favor ingrese los campos de factura");
        return;
      }
    } else if (comprobante === "B") {
      if (metodoSeleccionado === "tarjeta" && typeTarjeta === "credito") {
        datosCliente = {
          dni: numeroDocumento,
          nombre: nombres,
          apellidos,
        };
        if (!numeroDocumento || !nombres || !apellidos) {
          ToastAlert(
            "warning",
            "Por favor ingrese los campos de boleta (cliente requerido con tarjeta y crédito)",
          );
          return;
        }
      }
    } else if (comprobante === "S") {
      datosCliente = {
        nombre: nombreReferenciaPrincipal || "CLIENTE GENERICO",
        documento: "00000000",
      };
    }

    let data = {};
    let pedidoToLlevar = null;

    if (estadoTipoVenta === "mesa") {
      data = {
        metodoPago: metodoPagoFinal,
        totalPreventa: totalPreventa ?? 0,
        comprobante: comprobante ?? "",
        cuotas: numeroCuotas ?? 0,
        tarjeta: typeTarjeta ?? null,
        datosCliente: datosCliente ?? {},
        idCaja: caja?.id ?? null,
        idMesa: idMesa ?? null,
        idUsuario: usuarioLogeado?.id ?? null,
        tipoVenta: estadoTipoVenta,
        esCuentaSeparada: isSplitPayment,
        pedidosSeleccionados: isSplitPayment ? itemsSeleccionados : [],
      };
    } else if (estadoTipoVenta === "llevar") {
      pedidoToLlevar = pedidoLlevar?.items ?? [];
      data = {
        metodoPago: metodoPagoFinal,
        totalPreventa: totalPreventa ?? 0,
        comprobante: comprobante ?? "",
        cuotas: numeroCuotas ?? 0,
        tarjeta: typeTarjeta ?? null,
        datosCliente: datosCliente ?? {},
        pedidoToLlevar,
        observacion: pedidoLlevar.descripcion || "",
        idCaja: caja?.id ?? null,
        idMesa: null,
        idUsuario: usuarioLogeado?.id ?? null,
        tipoVenta: estadoTipoVenta,
      };
    } else {
      data = {
        metodoPago: metodoPagoFinal,
        totalPreventa: totalPreventa ?? 0,
        comprobante: comprobante ?? "",
        cuotas: numeroCuotas ?? 0,
        tarjeta: typeTarjeta ?? null,
        datosCliente: datosCliente ?? {},
        idPedidoWeb: idPedidoWeb,
        idCaja: caja?.id ?? null,
        idMesa: null,
        idUsuario: usuarioLogeado?.id ?? null,
        tipoVenta: estadoTipoVenta,
      };
    }

    if (!metodoPagoFinal || !totalPreventa || !comprobante) {
      ToastAlert(
        "warning",
        "Por favor seleccione el método de pago y complete todos los campos requeridos.",
      );
      return;
    }

    // Ejecutamos la función directa (sin el hook useEstadoAsyn para tener control manual)
    await realizarVentaPago(data, nombreReferenciaPrincipal);
  };

  if (isLoading) return <p>Cargando preventas...</p>;
  if (isError) return <p>Error: {errorPreventaMesa?.message}</p>;

  return (
    <div className="card h-100 bg-transparent ">
      <div className="row h-100 g-3">
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column h-100">
          <DetallePedido
            idMesa={idMesa}
            mesa={mesa}
            caja={caja}
            estadoTipoVenta={estadoTipoVenta}
            preVentas={preventas}
            totalPreventa={totalPreventa}
            igv={igv}
          />
          {estadoTipoVenta === "llevar" && pedidoLlevar.descripcion && (
            <div className="mt-2 p-2 bg-warning bg-opacity-10 border border-warning rounded small text-dark">
              <div className="d-flex align-items-center gap-1 fw-bold mb-1">
                <FileText size={14} /> Notas del pedido:
              </div>
              <p className="m-0 fst-italic text-break">
                {pedidoLlevar.descripcion}
              </p>
            </div>
          )}
        </div>

        <div className="col-lg-6 col-md-8 col-sm-12 col-12 d-flex flex-column">
          <OpcionesPago
            handleSelectMetodo={handleSelectMetodo}
            handleSelectCardType={handleSelectCardType}
            handleTypeTarjeta={handleTypeTarjeta}
            handleSlectComprobante={handleSlectComprobante}
            handleShowDatosClientes={handleShowDatosClientes}
            handleShowFactura={handleShowFactura}
            handleSelectChange={handleSelectChange}
            handleInputChange={handleInputChange}
            metodoSeleccionado={metodoSeleccionado}
            clienteFactura={clienteFactura}
            clienteBoleta={clienteBoleta}
            tarjetas={tarjetas}
            typeTarjeta={typeTarjeta}
            tipoComporbante={tipoComporbante}
            comprobante={comprobante}
            tipoDocumento={tipoDocumento}
            numeroDocumento={numeroDocumento}
            setNombres={setNombres}
            setApellidos={setApellidos}
            setRuc={setRuc}
            setRazonSocial={setRazonSocial}
            setDireccion={setDireccion}
            cuotas={cuotas}
            setNumeroCuotas={setNumeroCuotas}
            setTipoDocumento={setTipoDocumento}
            setNumeroDocumento={setNumeroDocumento}
          />
        </div>

        <div className="col-lg-3 col-md-12 col-sm-12 col-12 d-flex flex-column">
          <RealizarPago
            totalPreventa={totalPreventa}
            igv={igv}
            handleCrearJson={handleCrearJson}
            // AQUI USAMOS EL ESTADO MANUAL
            loading={isProcessing}
            error={null}
          />
          <div style={{ display: "none" }}>
            <TicketImpresion
              ref={componentRef}
              venta={datosVenta || { productos: [] }}
              cliente={nombreReferencia}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
