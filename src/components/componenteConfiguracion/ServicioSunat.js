import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { SunatFormIntegracion } from "./confiIntegraciones/SunatFormIntegracion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";

export function ServicioSunat() {
  const [modalRightSunat, setModalRightSunat] = useState(false);
  const {
    data: configuracion = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["configuracion"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const sunatConfig = configuracion.find(
    (item) => item.nombre?.toLowerCase() === "sunat"
  );

  const [switches, setSwitches] = useState({});
  if (Object.keys(switches).length === 0 && configuracion.length > 0) {
    const initial = {};
    configuracion.forEach((item) => {
      initial[item.id] = item.estado == 1;
    });
    setSwitches(initial);
  }
  const handleSwitch = async (id) => {
    try {
      const newValue = !switches[id]; // calcular el nuevo valor
      setSwitches((prev) => ({
        ...prev,
        [id]: newValue,
      }));

      const response = await axiosInstance.put(`/activarServicio/${id}`, {
        estado: newValue ? 1 : 0, // enviar el valor correcto
      });

      if (response.data.success) {
        ToastAlert("success", "Estado de la integración actualizado");
      } else {
        ToastAlert("error", "Error al actualizar el estado de la integración");
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la integración:", error);
      ToastAlert("error", "Error al actualizar el estado de la integración");
    }
  };
  if (isLoading) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-secondary">Cargando configuración...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-danger">
          Error: No se pudo cargar la configuración de SUNAT.
        </span>
      </div>
    );
  }

  return (
    <div className="container w-100 p-3 d-flex gap-4 align-items-stretch flex-wrap">
      {/* Card de información SUNAT */}
      <div
        className="card p-4 shadow-sm flex-grow-1"
        style={{ borderRadius: 18 }}
      >
        <div className="d-flex align-items-center mb-3">
          <FileText
            color={"#ee5252"}
            height="30px"
            width="30px"
            className="me-2"
          />
          <span
            className="fw-semibold"
            style={{ color: "#1d2530", fontSize: 18 }}
          >
            Configuración de Servicio SUNAT
          </span>
          <div className="form-switch ms-auto">
            <input
              className="form-check-input"
              type="checkbox"
              id={`flexSwitchCheckDefault${sunatConfig.id}`}
              checked={!!switches[sunatConfig.id]}
              onChange={() => handleSwitch(sunatConfig.id)}
              style={{
                accentColor: "#ee5252",
                width: 40,
                height: 22,
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <p className="text-secondary small mb-3">
          {sunatConfig?.descripcion ||
            "Configuración del servicio de SUNAT para la emisión de comprobantes electrónicos."}
        </p>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">RUC</span>
          <span className="small">{sunatConfig?.clave || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Archivo .pem</span>
          <span className="small">{sunatConfig?.valor1 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Endpoint</span>
          <span className="small">{sunatConfig?.valor2 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Usuario Sol</span>
          <span className="small">{sunatConfig?.valor3 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Clave Sol</span>
          <span className="small">{sunatConfig?.valor4 || "-"}</span>
        </div>

        <div className="d-flex">
          <button
            className="btn btn-sm btn-outline-dark ms-auto"
            onClick={() => setModalRightSunat(true)}
          >
            Configurar
          </button>
        </div>
      </div>

      <ModalRight
        isOpen={modalRightSunat}
        onClose={() => setModalRightSunat(false)}
        title={"Datos Sunat"}
        hideFooter={true}
      >
        <SunatFormIntegracion data={sunatConfig} />
      </ModalRight>
    </div>
  );
}
