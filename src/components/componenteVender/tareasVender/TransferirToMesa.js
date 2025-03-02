import React, { useEffect, useState } from "react";
import { ArrowRedoOutline } from "react-ionicons";
import CloseButton from "../../componentesReutilizables/CloseButton";
import axiosInstance from "../../../api/AxiosInstance";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";

export function TransferirToMesa({ show, handleCloseModal, idMesa, mesa }) {
  const [mesasFree, setMesasFree] = useState([]);
  const [mesaDestino, setMesaDestino] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const getMesasFree = async () => {
    try {
      const response = await axiosInstance.get("/vender/mesasDisponibles");
      if (response.data.success) {
        setMesasFree(response.data.mesasFree);
      } else {
        console.log("error" + response.data.message);
      }
    } catch (error) {
      console.log("error" + error);
    }
  };

  useEffect(() => {
    getMesasFree();
  }, [idMesa]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(
        `/vender/transferirToMesa/${idMesa}`,
        data
      );
      if (response.data.success) {
        const mesaOrigen = `<b>Mesa ${response.data.mesaOrigen.numero}</b>`;
        const mesaDestino = `<b>Mesa ${response.data.mesaDestino.numero}</b>`;
        const mensaje = `${response.data.message}<br> ${mesaOrigen} a ${mesaDestino}`;

        ToastAlert("success", mensaje); // Aquí pasas el mensaje con HTML

        navigate(`/vender/ventasMesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "error" + error);
    }
  };

  if (!show) return null; // No renderizar si el modal no debe mostrarse.

  return (
    <div className="modal-overlay m-0">
      <div className="contenido-model bg-white p-4 rounded-3 shadow-lg">
        {/* Cabecera del Modal */}
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h3 className="text-center mb-4">Transferir Pedidos</h3>
          <p className="align-middle mx-2 fw-normal">
            {mesasFree.filter((mesa) => mesa.estado === 1).length} Disponibles
            <span
              className="mx-2"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10ba82",
              }}
            ></span>{" "}
          </p>
          <CloseButton onClose={handleCloseModal} />
        </div>

        {/* Mesa Origen */}
        <div className="form-floating mb-2">
          <input
            type="text"
            id="mesaOrigen"
            className="form-control"
            value={mesa}
          />
          <label htmlFor="mesaOrigen">Mesa Origen</label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Mesa Destino */}
          <div className="form-floating">
            <select
              id="mesaDestino"
              className={`form-select ${errors.contacto ? "is-invalid" : ""}`}
              {...register("mesaDestino", {
                required: "Seleccione una mesa de Destino",
                onChange: (e) => setMesaDestino(e.target.value),
              })}
            >
              <option value="">Elige una mesa</option>
              {mesasFree.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa {mesa.numero} - Piso {mesa.piso}
                </option>
              ))}
            </select>
            <label htmlFor="mesaDestino" className="form-label">
              Mesa Destino
            </label>
            {errors.mesaDestino && (
              <div className="invalid-feedback">
                {errors.mesaDestino.message}
              </div>
            )}
          </div>

          {/* Botón de Confirmar */}
          <div className="text-center mt-4">
            <button className="btn btn-primary w-100 p-3" type="submit">
              Confirmar Transferencia
              <ArrowRedoOutline
                color="white"
                style={{ fontSize: "20px", marginLeft: "8px" }}
              />
            </button>
          </div>

          {/* Botón de Cancelar */}
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary w-100 p-3"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
