import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";
import { useEffect, useMemo, useState } from "react";
import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import {
  CheckCheck,
  PrinterIcon,
  RotateCcw,
  AlertCircle,
  Search,
  Timer,
  FlameIcon,
  CheckCheckIcon,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { BadgeComponent } from "../../components/componentesReutilizables/BadgeComponent";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import echoEvents from "../../api/echoEvents";

import "../../css/EstilosCocina.css";

const estados = {
  0: { texto: "En espera", variant: "warning" },
  2: { texto: "En preparación", variant: "secondary" },
  1: { texto: "Listo", variant: "success" },
};

const generarCodigoReal = (pedido) => {
  if (pedido.tipo_pedido === "mesa" && pedido.idPedidoMesa)
    return `PED-${pedido.idPedidoMesa}`;
  if (
    pedido.tipo_pedido === "llevar" &&
    (pedido.idPedidoLlevar || pedido.idPedidoLLevar)
  )
    return `LL-${pedido.idPedidoLlevar || pedido.idPedidoLLevar}`;
  if (pedido.tipo_pedido === "web" && pedido.idPedidoWsp)
    return `WSP-${pedido.idPedidoWsp}`;
  return `#${pedido.id}`;
};

function TarjetaPedido({ pedido }) {
  const [cargando, setCargando] = useState(false);
  const queryClient = useQueryClient();

  const esListo = pedido.estado === 1;
  const esEnPreparacion = pedido.estado === 2;

  const cambiarEstado = async () => {
    setCargando(true);
    const nuevoEstado = pedido.estado === 0 ? 2 : pedido.estado === 2 ? 1 : 0;
    const success = await PutData("pedidoCocina", pedido.id, {
      estado: nuevoEstado,
    });
    setCargando(false);

    if (success) {
      queryClient.invalidateQueries(["pedidosEstado"]);
    }
  };

  const platos = useMemo(() => {
    try {
      return JSON.parse(pedido.detalle_platos);
    } catch {
      return [];
    }
  }, [pedido.detalle_platos]);

  const handleImprimirPedidoCocina = async (e) => {
    e.stopPropagation();

    if (!platos || platos.length === 0) {
      return ToastAlert("error", "No hay platos para imprimir en este pedido.");
    }

    const contenidoFormateado = platos.map((item) => {
      const cantidad = Number(item.cantidad ?? 1);
      const precio = Number(item.precio ?? 0);
      return {
        nombre: item.nombre || "Plato desconocido",
        cantidad,
        precio,
        subtotal: cantidad * precio,
      };
    });

    const payload = {
      mesa:
        pedido.tipo_pedido === "mesa"
          ? `Mesa ${pedido.numeroMesa}`
          : generarCodigoReal(pedido),
      fecha: new Date().toLocaleString("es-PE"),
      usuario: "Cajero",
      productos: contenidoFormateado,
      nota: pedido.detalles_extras || "",
    };

    try {
      const response = await axiosInstance.post(
        "/vender/imprimirCocina",
        payload,
      );
      if (response.data.success) {
        ToastAlert("success", `Pedido enviado a impresión.`);
      } else {
        ToastAlert(
          "error",
          response.data.message || "No se pudo imprimir el pedido.",
        );
      }
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error de conexión con el servidor.",
      );
    }
  };

  const tipoPedidoInfo = {
    mesa: {
      titulo: `MESA ${pedido?.numeroMesa ?? "?"}`,
      colorPunto: "var(--fw-strawberry, #ef4444)",
    },
    llevar: { titulo: "LLEVAR", colorPunto: "var(--fw-teal, #10b981)" },
    web: { titulo: "DELIVERY", colorPunto: "var(--fw-blue, #3b82f6)" },
  };

  const { titulo, colorPunto } = tipoPedidoInfo[pedido.tipo_pedido] ?? {
    titulo: "SIN TIPO",
    colorPunto: "#999",
  };

  return (
    <div
      className={`card overflow-hidden  mb-3 ${esListo ? "border-success opacity-75" : ""}`}
    >
      {/* HEADER DE LA TARJETA USANDO TU CSS */}
      <div
        className={`card-header d-flex justify-content-between align-items-center ${
          esListo
            ? "bg-white border-bottom"
            : esEnPreparacion
              ? "cocina-header-preparacion"
              : "cocina-header-espera"
        }`}
      >
        <div className="d-flex align-items-center gap-2">
          {/* CÓDIGO REAL DEL PEDIDO */}
          <span className="badge bg-white text-dark border px-2 py-1">
            {generarCodigoReal(pedido)}
          </span>
          <span
            className={`cocina-pedido-title text-truncate ${esListo ? "cocina-title-listo" : ""}`}
          >
            <span
              className="rounded-circle d-inline-block me-1"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: colorPunto,
              }}
            ></span>
            {titulo}
          </span>
        </div>

        <BadgeComponent
          className="px-2"
          variant={estados[pedido.estado]?.variant}
          label={estados[pedido.estado]?.texto}
        />
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="card-body p-0 pt-2 pb-2">
        <ul className="list-group list-group-flush border-0">
          {platos.map((plato, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex border-0 align-items-start py-1 px-3 "
            >
              <span
                className={`border p-1 rounded-pill btn-icon fw-bold me-2 mt-1 ${esListo ? "text-dark" : "text-dark"}`}
              >
                {plato.cantidad}
              </span>
              <span
                className={`fw-medium ${esListo ? "text-decoration-line-through cocina-text-muted" : "text-dark"}`}
              >
                {plato.nombre}
              </span>
            </li>
          ))}
        </ul>

        {/* NOTA DE COCINA USANDO TU CSS */}
        {pedido.detalles_extras && (
          <div className="px-3 pt-2">
            <div
              className={`d-flex align-items-start gap-2 rounded ${esListo ? "cocina-nota-listo" : "cocina-nota-espera"}`}
            >
              <AlertCircle size={16} className="cocina-icon-note mt-1" />
              <div>
                <span
                  className="fw-bold d-block mb-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  NOTA:
                </span>
                <span
                  className="fst-italic"
                  style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
                >
                  {pedido.detalles_extras}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DE LA TARJETA USANDO TU CSS */}
      <div className="card-footer bg-transparent border-0 d-flex align-items-center gap-2 px-3 pb-3">
        <button
          className={`cocina-btn-imprimir btn-icon ${
            esListo
              ? "cocina-btn-imprimir-listo"
              : esEnPreparacion
                ? "cocina-btn-imprimir-preparacion"
                : "cocina-btn-imprimir-espera"
          }`}
          title="Imprimir Ticket"
          onClick={handleImprimirPedidoCocina}
        >
          <PrinterIcon size={18} />
        </button>

        <BotonAnimado
          className={`ms-auto cocina-btn-accion ${
            esListo
              ? "cocina-btn-accion-listo"
              : esEnPreparacion
                ? "cocina-btn-accion-preparacion"
                : "cocina-btn-accion-espera"
          }`}
          onClick={cambiarEstado}
          loading={cargando}
          icon={
            pedido.estado === 0 ? (
              <CheckCheck size={18} />
            ) : pedido.estado === 2 ? (
              <CheckCheck size={18} />
            ) : (
              <RotateCcw size={16} />
            )
          }
        >
          {pedido.estado === 0
            ? "Mover a preparar"
            : pedido.estado === 2
              ? "Marcar Listo"
              : "Reabrir"}
        </BotonAnimado>
      </div>
    </div>
  );
}

export function CocinaDespacho() {
  const queryClient = useQueryClient();
  const {
    data: pedidos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pedidosEstado"],
    queryFn: GetPedidosCocina,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filtroOpciones = [
    { label: "Todos", value: "Todos" },
    { label: "Mesa", value: "mesa" },
    { label: "Llevar", value: "llevar" },
    { label: "Delivery", value: "web" },
  ];

  const pedidosFiltrados = useMemo(() => {
    let result = pedidos;
    if (filtroTipo !== "Todos") {
      result = result.filter((pedido) => pedido.tipo_pedido === filtroTipo);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((pedido) => {
        const codigo = generarCodigoReal(pedido).toLowerCase();
        const textoMesa = pedido.numeroMesa
          ? `mesa ${pedido.numeroMesa}`.toLowerCase()
          : "";
        return codigo.includes(term) || textoMesa.includes(term);
      });
    }
    return result;
  }, [pedidos, filtroTipo, searchTerm]);

  const pedidosEnEspera = pedidosFiltrados.filter((p) => p.estado === 0);
  const pedidosEnPreparacion = pedidosFiltrados.filter((p) => p.estado === 2);
  const pedidosListos = pedidosFiltrados.filter((p) => p.estado === 1);

  useEffect(() => {
    const canalCocina = echoEvents.channel("pedidosEstado");
    canalCocina.listen(".pedidosEstado.creado", () => {
      queryClient.invalidateQueries(["pedidosEstado"]);
    });
    return () => echoEvents.leaveChannel("pedidosEstado");
  }, [queryClient]);

  return (
    <div className="h-100">
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <div className="cocina-card-body h-100 p-2">
          {/* BARRA SUPERIOR (Buscador y Filtros con tu CSS) */}
          <div className="cocina-filter-bar mb-3 d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-2">
              {filtroOpciones.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`cocina-filter-btn fw-bold ${filtroTipo === option.value ? "cocina-filter-btn-active" : ""}`}
                  onClick={() => setFiltroTipo(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div
              className="d-flex align-items-center gap-3 flex-grow-1"
              style={{ maxWidth: "450px" }}
            >
              {" "}
              <span
                className="text-center fw-bold h5"
                style={{ width: "200px" }}
              >
                Total: {`${pedidosFiltrados.length}`}
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 ps-0"
                placeholder="Buscar PED-123 o Mesa 5..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50 bg-white rounded-4 border border-dashed">
              <CheckCheck size={50} className="mb-3 text-success" />
              <h4 className="fw-bold m-0">Cocina al día</h4>
              <p>No hay pedidos pendientes.</p>
            </div>
          ) : (
            /* ESTRUCTURA KANBAN USANDO TU CSS GRID (.cocina-columnas) */
            <div className="cocina-columnas">
              {/* Columna: En Espera */}
              <div className=" card overflow-hidden">
                <div className="card-header d-flex justify-content-between align-items-center mb-3 px-4">
                  <div className="d-flex">
                    {" "}
                    <span className="me-3">
                      <Timer />
                    </span>
                    <div className="d-flex flex-column">
                      <h6 className="m-0 fw-bold">En Espera</h6>
                      <small className="text-muted">Pedidos nuevos</small>
                    </div>
                  </div>
                  <span className="cocina-badge-warning  btn-icon">
                    {pedidosEnEspera.length}
                  </span>
                </div>
                <div className="card-body cocina-col-body px-3">
                  {pedidosEnEspera.map((pedido, i) => (
                    <TarjetaPedido
                      key={`espera-${pedido.id}-${i}`}
                      pedido={pedido}
                    />
                  ))}
                </div>
              </div>

              {/* Columna: En Preparación */}
              <div className="card overflow-hidden">
                <div className="card-header d-flex justify-content-between align-items-center mb-3 px-4">
                  <div className="d-flex">
                    <span className="me-3">
                      <FlameIcon />
                    </span>
                    <div className="d-flex flex-column">
                      <h6 className="m-0 fw-bold">En Preparación</h6>
                      <small className="text-muted">Cocinando ahora</small>
                    </div>
                  </div>
                  <span className="cocina-badge-preparacion  btn-icon">
                    {pedidosEnPreparacion.length}
                  </span>
                </div>
                <div className="card-body cocina-col-body px-3">
                  {pedidosEnPreparacion.map((pedido, i) => (
                    <TarjetaPedido
                      key={`prep-${pedido.id}-${i}`}
                      pedido={pedido}
                    />
                  ))}
                </div>
              </div>

              {/* Columna: Listo */}
              <div className="card overflow-hidden">
                <div className="card-header d-flex justify-content-between align-items-center mb-3 px-4">
                  <div className="d-flex">
                    {" "}
                    <span className="me-3">
                      <CheckCheckIcon />
                    </span>
                    <div className="d-flex flex-column">
                      <h6 className="m-0 fw-bold">Listo</h6>
                      <small className="text-muted">Para despacho</small>
                    </div>
                  </div>
                  <span className="cocina-badge-listo btn-icon ">
                    {pedidosListos.length}
                  </span>
                </div>
                <div className="card-body cocina-col-body px-3 ">
                  {pedidosListos.map((pedido, i) => (
                    <TarjetaPedido
                      key={`listo-${pedido.id}-${i}`}
                      pedido={pedido}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CondicionCarga>
    </div>
  );
}
