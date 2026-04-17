import { useEffect, useState } from "react";
import axiosInstance from "../../../api/AxiosInstance";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { Repeat, MoveRight, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom";
import "../../../css/TransferirToMesa.css"; // Asegúrate de importar el CSS aquí

export function TransferirToMesa({ show, handleCloseModal, idMesa, mesa }) {
  const [mesasFree, setMesasFree] = useState([]);
  const [mesaDestino, setMesaDestino] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    if (show) getMesasFree();
  }, [show, idMesa]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(
        `/vender/transferirToMesa/${idMesa}`,
        data,
      );
      if (response.data.success) {
        const mensaje = `¡Transferencia exitosa!<br><b>Mesa ${mesa}</b> → <b>Mesa ${response.data.mesaDestino.numero}</b>`;
        ToastAlert("success", mensaje);
        queryClient.invalidateQueries(["mesas"]);
        handleCloseModal();
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error en el servidor");
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
          <button className="btn-close-circle" onClick={handleCloseModal}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="select-group">
            <label className="input-label">Mesa de destino</label>
            <div className="select-wrapper">
              <select
                className={`custom-select ${errors.mesaDestino ? "is-invalid" : ""}`}
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
              <p className="error-message">{errors.mesaDestino.message}</p>
            )}
          </div>

          <div className="actions-container">
            <button className="w-100 btn-principal p-4" type="submit">
              Confirmar Cambio
              <Repeat size={18} />
            </button>
            <button
              className="btn-cancel-transfer"
              type="button"
              onClick={handleCloseModal}
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
