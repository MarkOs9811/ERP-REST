import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPreventaMesa } from "../../service/preventaService";
import "../../css/EstilosPlatos.css";
import { useNavigate } from "react-router-dom";
import {
  handleInputChange,
  handleSelectChange,
} from "../../hooks/InputHandlers";
import { useForm } from "react-hook-form";
import { RealizarVenta } from "../../service/RealizarVentaService";
import ToastAlert from "../componenteToast/ToastAlert";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { OpcionesPago } from "./tareasVender/OpcionesPago";
import { clearPedidoLlevar } from "../../redux/pedidoLlevarSlice";
import { clearPedido } from "../../redux/pedidoSlice";
import { DetallePedido } from "./tareasVender/DetallePedido";
import { RealizarPago } from "./tareasVender/RealizarPago";

export function DetallesPago() {
  // VARIABELS EN REDUX SI ES QUE LO HAY
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const caja = useSelector((state) => state.caja.caja);
  const estadoTipoVenta = useSelector((state) => state.tipoVenta.estado);
  const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
  const pedidoLlevar = useSelector((state) => state.pedidoLlevar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PARA VALIDAR EL TIPO DE DOCUMENTO
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  // DATOS DEL CLIENTE
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numeroCuotas, setNumeroCuotas] = useState("");

  // REACTK HOOK FORM
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [preVentas, setPreventas] = useState([]);
  const [mesa, setMesa] = useState(null);

  const getPreventeMesa = async () => {
    try {
      const result = await getPreventaMesa(idMesa, caja.id);
      if (result.success) {
        setPreventas(result.preventas);
        const numeroMesa = result.preventas[0]?.mesa?.numero;
        if (numeroMesa) {
          setMesa(numeroMesa);
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error al obtener las preventas de la mesa:", error);
    }
  };

  useEffect(() => {
    if (estadoTipoVenta === "llevar") {
      setPreventas(pedidoLlevar.items);
    } else if (idMesa && caja?.id) {
      getPreventeMesa();
    } else {
      setPreventas([]);
    }
  }, [estadoTipoVenta, idMesa, caja, pedidoLlevar]);

  // calculo para el total e igv
  const totalPreventa = preVentas
    .reduce(
      (acc, item) => acc + item.cantidad * (item.plato?.precio || item.precio),
      0
    )
    .toFixed(2);

  // Calcular el IGV
  const igv = (totalPreventa * 0.18).toFixed(2);
  // =====================================

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [tipoComporbante, setTipoComporbante] = useState(false);
  const [typeTarjeta, setTypeTarjeta] = useState(null);
  const [tarjetas, setTarjetas] = useState(false);
  const [cuotas, setCuotas] = useState(false);
  const [clienteBoleta, setClienteBoleta] = useState(false);
  const [clienteFactura, setClienteFactura] = useState(false);

  // FUNCION PARA SELECCIONAR EL METODO DE PAGO
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

  // FUNCION PARA SLECCIONAR EL TIPO DE TARJETA
  const handleSelectCardType = (estado) => {
    setTarjetas(estado);
    setCuotas(false);
  };
  //FUNCION PARA SELECIONAR EL TIPO DE TARJETA DEBITO - CREDITO
  const handleTypeTarjeta = (typeTarjeta) => {
    setTypeTarjeta(typeTarjeta);
    setTipoComporbante(true);
    setComprobante(null);
    setClienteFactura(false);
    setClienteBoleta(false);
    setCuotas(false);
  };

  // FUNCION PARA SELECIONAR EL COMPROBANTE DE PAGO
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

  // funcion para ocutar o mostrar campo de cuotas
  const handleShowDatosClientes = (estado) => {
    setCuotas(estado);
  };

  // funcion para cuando es una factura
  const handleShowFactura = (estado) => {
    setCuotas(false);
  };

  // ESTAS 3 FUNCIONES SE ENCARGAN DE REALIZAR LA VENTA Y REGISTRAR
  const realizarVentaPago = async (data) => {
    const result = await RealizarVenta(data);
    if (result.success) {
      ToastAlert("success", "Venta realizada con éxito");
      if (estadoTipoVenta == "llevar") {
        navigate("/vender/ventasLlevar");
        dispatch(clearPedidoLlevar());
      } else {
        navigate("/vender/ventasMesas");
        dispatch(clearPedido());
      }
    } else {
      const errorMessage = result.errorDetails
        ? `Error: ${result.errorDetails.statusText} (${
            result.errorDetails.status
          }). Detalles: ${
            result.errorDetails.data?.message ||
            "No se proporcionaron detalles adicionales"
          }`
        : result.message;

      ToastAlert(
        "error",
        `Ocurrió un error al realizar la venta: ${errorMessage}`
      );
    }
  };
  const { loading, error, execute } = useEstadoAsyn(realizarVentaPago);

  const handleCrearJson = async () => {
    let datosCliente = {}; // Objeto independiente para los datos del cliente
    let metodoPagoFinal = "";

    // Validar el método de pago seleccionado
    if (metodoSeleccionado === "tarjeta") {
      // Concatenar tarjeta y tipo
      metodoPagoFinal = metodoSeleccionado + " " + (typeTarjeta || "");

      if (!typeTarjeta) {
        ToastAlert("warning", "Por favor seleccione el tipo de tarjeta");
        return;
      }
    } else {
      // Otros métodos de pago (e.g., YAPE, efectivo, etc.)
      metodoPagoFinal = metodoSeleccionado;
    }

    // Validar datos del cliente según el tipo de comprobante y condiciones específicas
    if (comprobante === "F") {
      // Para factura (siempre se requieren datos del cliente)
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
      // Para boleta
      if (metodoSeleccionado === "tarjeta" && typeTarjeta === "credito") {
        // Solo requerir datos del cliente si es tarjeta y crédito
        datosCliente = {
          dni: numeroDocumento,
          nombre: nombres,
          apellidos,
        };

        if (!numeroDocumento || !nombres || !apellidos) {
          ToastAlert(
            "warning",
            "Por favor ingrese los campos de boleta (cliente requerido con tarjeta y crédito)"
          );
          return;
        }
      }
    }

    // Inicializar variables
    let data = {};
    let pedidoToLlevar = null;

    // Verificar el estado del tipo de venta y construir el objeto `data`
    if (estadoTipoVenta === "mesa") {
      // Datos para ventas en mesa
      data = {
        metodoPago: metodoPagoFinal,
        totalPreventa: totalPreventa ?? 0, // Asegurar que totalPreventa tenga un valor válido
        comprobante: comprobante ?? "", // Tipo de comprobante (asegurar valor por defecto)
        cuotas: numeroCuotas ?? 0, // Cuotas si aplica
        tarjeta: typeTarjeta ?? null, // Tipo de tarjeta (Débito o Crédito)
        datosCliente: datosCliente ?? {}, // Validar datosCliente para evitar errores
        idCaja: caja?.id ?? null, // Validar idCaja
        idMesa: idMesa ?? null, // Validar idMesa
        idUsuario: usuarioLogeado?.id ?? null, // Validar idUsuario
        tipoVenta: estadoTipoVenta,
      };
    } else {
      // Construir el objeto para pedido "llevar"
      pedidoToLlevar = pedidoLlevar?.items ?? [];

      data = {
        metodoPago: metodoPagoFinal,
        totalPreventa: totalPreventa ?? 0, // Total preventa
        comprobante: comprobante ?? "", // Tipo de comprobante
        cuotas: numeroCuotas ?? 0, // Cuotas si aplica
        tarjeta: typeTarjeta ?? null, // Tipo de tarjeta (Débito o Crédito)
        datosCliente: datosCliente ?? {}, // Validar datosCliente
        pedidoToLlevar, // Agregar pedido a llevar
        idCaja: caja?.id ?? null, // Validar idCaja
        idMesa: null, // idMesa es null porque es "llevar"
        idUsuario: usuarioLogeado?.id ?? null, // Validar idUsuario
        tipoVenta: estadoTipoVenta,
      };
    }

    // Validaciones generales antes de continuar
    if (!metodoPagoFinal || !totalPreventa || !comprobante) {
      ToastAlert(
        "warning",
        "Por favor seleccione el método de pago y complete todos los campos requeridos."
      );
      return;
    }

    // Mostrar en consola el JSON generado para depuración
    console.log("Datos enviados:", data);

    await execute(data);
  };

  // =======================================================================

  return (
    <div className="row g-3 h-100">
      {/* Columna DetallePedido */}
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column">
        <DetallePedido
          idMesa={idMesa}
          mesa={mesa}
          caja={caja}
          estadoTipoVenta={estadoTipoVenta}
          preVentas={preVentas}
          totalPreventa={totalPreventa}
          igv={igv}
        />
      </div>

      {/* Columna OpcionesPago */}
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

      {/* Columna RealizarPago */}
      <div className="col-lg-3 col-md-12 col-sm-12 col-12 d-flex flex-column">
        <RealizarPago
          totalPreventa={totalPreventa}
          igv={igv}
          handleCrearJson={handleCrearJson}
          loading={loading}
          error={loading}
        />
      </div>
    </div>
  );
}
