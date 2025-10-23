import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { useQuery } from "@tanstack/react-query";
import { File, FileText, Pen, Trash } from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { SunatFormIntegracion } from "./confiIntegraciones/SunatFormIntegracion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { GetConfiSerie } from "../../service/accionesConfiguracion/GetConfigSerie";

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
  const {
    data: confiSerieCorrelativo = [],
    isLoading: serieLoading,
    isError: errorLoading,
  } = useQuery({
    queryKey: ["configuracionSerie"],
    queryFn: GetConfiSerie,
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

  const handleEdit = () => {};
  const handleToggleEstado = () => {};
  const columasSerieCorr = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "60px", // Más angosto, no es tan importante
    },
    {
      name: "Tipo Documento",
      selector: (row) => row.tipo_documento_sunat,
      sortable: true,
      wrap: true,
      // 'cell' nos permite renderizar JSX personalizado
      cell: (row) => {
        const mapTipos = {
          "01": "Factura",
          "03": "Boleta",
          "07": "Nota de Crédito",
          "08": "Nota de Débito",
        };
        // Devuelve el texto amigable o el código si no se encuentra
        return mapTipos[row.tipo_documento_sunat] || row.tipo_documento_sunat;
      },
    },
    {
      name: "Serie",
      selector: (row) => row.serie,
      sortable: true,
      center: true,
    },
    {
      name: "Correlativo Actual",
      selector: (row) => row.correlativo_actual,
      sortable: true,
      center: true,
      // (Este es el NÚMERO contador, ej: 182.
      // ¡No el texto '00000182'!)
    },
    {
      name: "Por Defecto",
      selector: (row) => row.is_default,
      sortable: true,
      center: true,
      cell: (row) =>
        // Aquí puedes usar un componente <Badge> o <Chip> de tu librería UI
        row.is_default == 1 ? (
          <span
            style={{
              color: "white",
              backgroundColor: "green",
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            Sí
          </span>
        ) : (
          <span
            style={{
              color: "white",
              backgroundColor: "gray",
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            No
          </span>
        ),
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
      cell: (row) =>
        // (Asumo que 1 es 'Activo' y 0 es 'Inactivo')
        row.estado == 1 ? (
          <span style={{ color: "blue", fontWeight: "bold" }}>Activo</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      center: true,
      // Esta celda no tiene 'selector' porque es calculada
      cell: (row) => (
        <div className="g-2">
          {/* --- BOTÓN EDITAR --- */}
          {/* Siempre se puede editar (para cambiar 'is_default') */}
          <button
            onClick={() => handleEdit(row)}
            title="Editar"
            className="btn-editar"
          >
            <Pen size={15} /> Editar
          </button>

          {/* --- BOTÓN ACTIVAR/DESACTIVAR --- */}
          {row.estado == 1 ? (
            // Si está ACTIVO, mostramos botón "Desactivar"
            <button
              onClick={() => handleToggleEstado(row)}
              // ¡LA REGLA DE ORO! No se puede desactivar la serie 'default'
              disabled={row.is_default == 1}
              title={
                row.is_default == 1
                  ? "No puedes desactivar una serie por defecto"
                  : "Desactivar Serie"
              }
              className="btn-eliminar"
            >
              <Trash size={15} /> Desactivar
            </button>
          ) : (
            // Si está INACTIVO, mostramos botón "Activar"
            <button
              onClick={() => handleToggleEstado(row)}
              title="Activar Serie"
              className="btn-guardar"
            >
              Activar
            </button>
          )}
        </div>
      ),
    },
  ];

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
    <div className="container w-100 p-3 d-flex gap-4 align-items-stretch flex-wrap flex-column">
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
      <div className="card shadow-sm">
        <div className="card-header">
          <File size={30} className="text-danger" />
          <span className="Fw-semibold h5">
            Información de Serie y correlativo
          </span>
        </div>
        <div className="card-body">
          <TablasGenerales
            columnas={columasSerieCorr}
            datos={confiSerieCorrelativo}
          />
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
