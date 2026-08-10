import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import {
  Eye,
  Layers,
  PlusCircle,
  Users,
  UtensilsCrossed,
  Printer,
  Receipt,
  PrinterIcon,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance"; // Asegúrate de importar tu instancia
import "../../css/EstilosMesas.css";

export function MesasList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: mesas = [],
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true, // Excelente práctica para mantener sincronizadas las mesas
  });

  const handleMesaAddPlato = (data) => {
    dispatch(setIdPreventaMesa({ id: data.id, numero: data.numero }));
    navigate(`/vender/mesas/platos`);
  };

  const handleShowPedido = (id) => {
    dispatch(setIdPreventaMesa({ id: id, numero: null }));
    navigate(`/vender/mesas/preVenta`);
  };

  // Acción Rápida: Imprimir Pre-cuenta directamente desde la grilla
  const handleImprimirPrecuentaRapida = async (e, mesa) => {
    e.stopPropagation(); // Evita que la tarjeta se abra al hacer clic en el botón

    // Verificamos que la mesa tenga items
    const preventas = mesa.preventas || [];
    if (preventas.length === 0) {
      return ToastAlert("error", "No hay pedidos registrados en esta mesa.");
    }

    // 1. Formateamos el contenido tal como lo espera tu endpoint genérico
    const contenidoFormateado = preventas.map((item) => ({
      nombre: item.plato?.nombre || "Plato desconocido", // Extrae el nombre de la relación
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.cantidad * item.precio,
    }));

    // 2. Armamos el Payload final
    const payload = {
      titulo: `PRE-CUENTA MESA ${mesa.numero}`,
      contenido: contenidoFormateado,
      total: mesa.total || 0,
    };

    try {
      // 3. Petición POST a tu ruta genérica
      const response = await axiosInstance.post(
        "/vender/imprimirGenerico",
        payload,
      );

      if (response.data.success) {
        ToastAlert(
          "success",
          `Pre-cuenta de Mesa ${mesa.numero} enviada a impresión.`,
        );
      } else {
        ToastAlert(
          "error",
          response.data.message || "No se pudo imprimir la pre-cuenta.",
        );
      }
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error de conexión con el servidor.",
      );
    }
  };

  const listaMesas = Array.isArray(mesas) ? mesas : [];
  const mesasDisponibles = listaMesas.filter(
    (mesa) => mesa.estado === 1,
  ).length;
  const mesasOcupadas = listaMesas.filter((mesa) => mesa.estado === 0).length;

  return (
    <div className="card m-0 h-100 overflow-auto p-3">
      {/* HEADER FIRE WOK */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h3 className="m-0 fw-bold" style={{ color: "var(--text-main)" }}>
          Mapa de Mesas
        </h3>
        <div className="d-flex align-items-center gap-3 bg-white px-3 py-2 rounded-pill shadow-sm border">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-success"></span>
            <span className="small fw-bold text-muted">
              {mesasDisponibles} Libres
            </span>
          </div>
          <div className="vr"></div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-danger"></span>
            <span className="small fw-bold text-muted">
              {mesasOcupadas} Ocupadas
            </span>
          </div>
        </div>
      </div>

      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="p-1">
          <div className="row g-3">
            {listaMesas.map((mesa) => (
              <div key={mesa.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div
                  className={`mesa-card h-100  ${
                    mesa.estado === 1 ? "disponible" : "en-atencion"
                  }`}
                  onClick={() =>
                    mesa.estado === 1
                      ? handleMesaAddPlato(mesa)
                      : handleShowPedido(mesa.id)
                  }
                >
                  {/* Contenido Principal */}
                  <div className="mesa-content">
                    <h6 className="mesa-numero">
                      <UtensilsCrossed size={16} />
                      Mesa {mesa.numero}
                    </h6>

                    <div className="mesa-detalles mt-2">
                      <p>
                        <Layers size={13} /> Piso {mesa.piso}
                      </p>
                      <p>
                        <Users size={13} /> Capacidad: {mesa.capacidad}
                      </p>
                    </div>

                    {/* VISTA PREVIA DEL TOTAL (Si está ocupada) */}
                    {mesa.estado === 0 && (
                      <div className="mesa-total-preview mt-2">
                        <span
                          className="text-muted small d-block"
                          style={{ fontSize: "0.65rem" }}
                        >
                          TOTAL ACTUAL
                        </span>
                        {/* ⚠️ ADAPTACIÓN: Asegúrate de que tu backend (GetMesasVender) envíe el campo mesa.total */}
                        <span className="fw-bold fs-6">
                          S/ {Number(mesa.total || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Acciones y Etiquetas */}
                  <div className="mesa-footer">
                    {mesa.estado === 1 ? (
                      <div className="mesa-action-label">
                        <PlusCircle size={14} /> <span>ABRIR MESA</span>
                      </div>
                    ) : (
                      <div className="d-flex w-100 gap-1">
                        <div className="mesa-action-label flex-grow-1">
                          <Eye size={14} /> <span>VER PEDIDO</span>
                        </div>
                        {/* Botón de impresión directa */}
                        <button
                          className="btn-informativo"
                          onClick={(e) =>
                            handleImprimirPrecuentaRapida(e, mesa)
                          }
                          title="Imprimir Pre-cuenta"
                        >
                          <PrinterIcon size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
