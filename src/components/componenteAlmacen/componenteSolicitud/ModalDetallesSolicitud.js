import React, { useState } from "react";
import { Badge } from "react-bootstrap"; // Importamos Badge de react-bootstrap

import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import ModalGeneral from "../../componenteToast/ModalGeneral";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import {
  Box,
  Check,
  FileAxis3d,
  GitCompare,
  Info,
  Printer,
  UserRound,
} from "lucide-react";
export function ModalDetallesSolicitud({ data, actualizarTabla }) {
  // FUNCIONES PARA ELIMINAR Y ACTIVAR
  const [modalQuestion, setModalQuestion] = useState(false);

  const [idProceso, setIdProceso] = useState(null);

  // funcion para eliminar un registro - modal
  const handleQuestionEstado = (id) => {
    setModalQuestion(true);
    setIdProceso(id);
  };

  const handleCloseModal = () => {
    setModalQuestion(false);
    setIdProceso(null);
  };

  const handleAccion = async (id) => {
    try {
      const response = await axiosInstance.put("/solicitudes/cambioEstado", {
        id,
      });

      if (response.data.success) {
        ToastAlert("success", "Cambio de estado correctamente");
        actualizarTabla();
        return true; // Indicar que la acción fue exitosa
      } else {
        ToastAlert("error", response.data.error || "Error en la actualización");
        return false;
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión");
      console.error("Error:", error);
      return false;
    }
  };

  return (
    <div className="container-fluid">
      {/* Primera fila: Información General y Detalles del Producto */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border h-100">
            <div className="card-header">
              <p className="h6 mt-3">
                <FileAxis3d color={"auto"} className={"me-2"} />
                Información General
              </p>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <UserRound color={"auto"} height="50px" width="50px" />
              <span id="detalleSolicitante" className="mt-2">
                {capitalizeFirstLetter(data?.nombre_solicitante)}
              </span>
              <small id="detalleCorreo" className="text-muted mt-1">
                {data?.usuario?.empleado?.persona?.correo}
              </small>
              <Badge bg="primary" id="detalleArea" className="mt-2">
                {data?.area.nombre}
              </Badge>
              <small id="detalleCelular" className="text-muted mt-2">
                {data?.celular}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border h-100">
            <div className="card-header">
              <p className=" h6 mt-3">
                <Box color={"auto"} className={"me-2"} /> Detalles del Producto
              </p>
            </div>
            <div className="card-body">
              <p>
                <strong>Producto:</strong>{" "}
                <span id="detalleProducto">{data?.nombre_producto}</span>
              </p>
              <p>
                <strong>Marca:</strong>{" "}
                <span id="detalleMarca">{data?.marcaProd}</span>
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                <span id="detalleDescripcion">{data?.descripcion}</span>
              </p>
              <p>
                <strong>Cantidad:</strong>{" "}
                <span id="detalleCantidad">{data?.cantidad}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card border h-100">
            <div className="card-header">
              <p className="h6 mt-3">
                <Info color={"auto"} className={"me-2"} /> Información Adicional
              </p>
            </div>
            <div className="card-body">
              <p>
                <strong>Motivo:</strong>{" "}
                <span id="detalleMotivo">{data?.motivo}</span>
              </p>
              <p>
                <strong>Uso previsto:</strong>{" "}
                <span id="detalleUsoPrevisto">{data?.uso_previsto}</span>
              </p>
              <p>
                <strong>Prioridad:</strong>{" "}
                <span id="detallePrioridad">{data?.prioridad}</span>
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span id="detalleEstado">{data?.estado}</span>
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                <span id="fechaSolicitud">{data?.fecha_solicitud}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pie del modal: Botones de acción */}
      <div className="modal-footer mt-2 border-0">
        <button type="button" className="btn-primary btn float-start me-auto">
          <Printer color={"auto"} /> Imprimir
        </button>
        {data?.estado == 1 ? (
          <h4>
            <Check color={"auto"} /> Atendido
          </h4>
        ) : (
          <button
            type="button"
            className="btn-guardar"
            onClick={() => handleQuestionEstado(data.id)}
          >
            <GitCompare color={"auto"} />
            Cambiar Estado
          </button>
        )}
      </div>

      <ModalGeneral
        show={modalQuestion}
        idProceso={idProceso}
        mensaje={"¿Cambiar estado a Atendido?"}
        handleAccion={handleAccion}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}
