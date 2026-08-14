import { useEffect, useState } from "react";
import axiosInstance from "../../../api/AxiosInstance";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { MoveRight, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom";
import "../../../css/TransferirToMesa.css";
// Ajusta la ruta de tu BotonConfirmar si es necesario
import BotonConfirmar from "../../componentesReutilizables/BotonConfirmar";

export function TransferirToMesa({ show, handleCloseModal, idMesa, mesa }) {
  const [mesasFree, setMesasFree] = useState([]);
  const [mesaDestino, setMesaDestino] = useState("");

  // 🔥 ESTADOS DE CONTROL
  const [loading, setLoading] = useState(false);
  const [errorRespuesta, setErrorRespuesta] = useState(null); // Nuevo estado para error interno

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getMesasFree = async () => {
    try {
      const response = await axiosInstance.get("/vender/mesasDisponibles");
      if (response.data.success) {
        setMesasFree(response.data.mesasFree);
      }
    } catch (error) {
      console.error("Error al cargar mesas:", error);
    }
  };

  useEffect(() => {
    if (show) {
      getMesasFree();
      setErrorRespuesta(null); // Limpiamos errores pasados al abrir
      reset(); // Limpiamos el select
      setMesaDestino("");
    }
  }, [show, idMesa, reset]);

  const onSubmit = async (data) => {
    // 🔥 Bloqueo estricto: Si ya está cargando, ignoramos el clic
    if (loading) return;

    setLoading(true);
    setErrorRespuesta(null); // Limpiamos el error visual al reintentar

    try {
      const response = await axiosInstance.put(
        `/vender/transferirToMesa/${idMesa}`,
        data,
      );
      if (response.data.success) {
        const mensaje = `¡Transferencia exitosa!<br><b>Mesa ${mesa}</b> → <b>Mesa ${response.data.mesaDestino.numero}</b>`;
        ToastAlert("success", mensaje); // El de success sí lo dejamos en toast porque el modal se va a cerrar
        queryClient.invalidateQueries(["mesas"]);
        handleCloseModal();
        navigate(`/vender/mesas`);
      } else {
        // 🔥 Si hay error lógico, lo mostramos dentro del modal
        setErrorRespuesta(response.data.message);
      }
    } catch (error) {
      // 🔥 Si explota el servidor (como tu error de SQL), lo mostramos dentro
      setErrorRespuesta(
        error.response?.data?.message ||
          "Error interno del servidor. Revisa el log.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay-custom">
      <div className="modal-content-custom">
        <div className="header-custom">
          <div className="header-title-container">
            <h2 className="modal-title">Transferir Pedido</h2>
            <div className="badge-status">
              <div className="dot"></div> {mesasFree.length} Disponibles
            </div>
          </div>
          <button
            className="btn-close-circle btn-icon"
            onClick={handleCloseModal}
            disabled={loading}
          >
            <X size={20} color="#666" />
          </button>
        </div>

        <div className="transfer-visual-container">
          <div className="node origin">
            <div className="node-circle">{mesa}</div>
            <span className="node-label">Origen</span>
          </div>
          <MoveRight className="arrow-icon" size={24} />
          <div className={`node dest ${!mesaDestino ? "pulse-active" : ""}`}>
            <div className="node-circle">
              {mesaDestino
                ? mesasFree.find((m) => m.id == mesaDestino)?.numero
                : "?"}
            </div>
            <span className="node-label">Destino</span>
          </div>
        </div>

        <form className="modal-form">
          <div className="select-group">
            <label className="input-label">Mesa de destino</label>
            <div className="select-wrapper">
              <select
                className={`custom-select ${errors.mesaDestino ? "is-invalid" : ""}`}
                disabled={loading} // Bloqueamos el select mientras transfiere
                {...register("mesaDestino", {
                  required: "Seleccione una mesa",
                  onChange: (e) => setMesaDestino(e.target.value),
                })}
              >
                <option value="">¿A qué mesa movemos el pedido?</option>
                {mesasFree.map((m) => (
                  <option key={m.id} value={m.id}>
                    Mesa {m.numero} -{" "}
                    {m.piso === 1 ? "1er Piso" : `Piso ${m.piso}`}
                  </option>
                ))}
              </select>
            </div>
            {errors.mesaDestino && (
              <p
                className="error-message m-0 mt-1"
                style={{ fontSize: "0.8rem", color: "#e3342f" }}
              >
                {errors.mesaDestino.message}
              </p>
            )}
          </div>

          {/* 🔥 MENSAJE DE ERROR INTERNO (Sustituye al Toast problemático) */}
          {errorRespuesta && (
            <div
              className="alert alert-danger py-2 px-3 mb-0 mt-3 text-center fw-medium border-danger border-opacity-25"
              style={{ fontSize: "0.85rem", borderRadius: "8px" }}
            >
              {errorRespuesta}
            </div>
          )}

          <div className="actions-container d-flex flex-column gap-2 mt-4">
            {/* 🔥 Tu Botón Animado. React-Hook-Form valida al hacer clic */}
            <BotonConfirmar loading={loading} onClick={handleSubmit(onSubmit)}>
              Confirmar Cambio
            </BotonConfirmar>

            <button
              className="btn-cancel-transfer w-100 mt-2"
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Mantener en mesa actual
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
