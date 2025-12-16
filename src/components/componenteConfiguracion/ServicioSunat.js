import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { File, FileText, Pen, PlusIcon, PowerIcon, Trash } from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { SunatFormIntegracion } from "./confiIntegraciones/SunatFormIntegracion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { GetConfiSerie } from "../../service/accionesConfiguracion/GetConfigSerie";
import { AddSerieForm } from "./confiIntegraciones/AddSerieForm";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import ModalGeneral from "../componenteToast/ModalGeneral";
import { EditFormSerie } from "./confiIntegraciones/EditFormSerie";

export function ServicioSunat() {
  const [modalRightSunat, setModalRightSunat] = useState(false);
  const [modalAddSerieCorr, setModalAddSerieCorr] = useState(false);
  const [modalQuestionActivar, setModalQuestionActivar] = useState(false);
  const [dataSerie, setDataSerie] = useState([]);

  // ACTIVAR  Y DESACTIVAR LA SERIE
  const [modalCambiarEstado, setQuestionEstado] = useState(false);
  const [modalDesactivar, setQuestionDesactivar] = useState(false);
  const [dataActivar, setDataActivar] = useState([]);

  // ACTIVAR MODAL Y ENVIAR DATA PARA EDITAR SERIE
  const [modalEditarSerie, setModalEditarSerie] = useState(false);
  const [dataEditSerie, setDataEditSerie] = useState([]);

  const queryClient = useQueryClient();

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
      initial[item?.id] = item.estado == 1;
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

  const handleSetDefault = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/configuraciones/serieCorrelativoDefault/${id}`
      );
      if (response.data.success) {
        ToastAlert("success", "Se estableció por defecto");
        queryClient.invalidateQueries(["configuracionSerie"]);
        setModalQuestionActivar(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          const mensajes = Object.values(data.errors).flat();
          mensajes.forEach((msg) => ToastAlert("error", msg));
          return;
        }
        const mensaje =
          data.message ||
          data.error ||
          "Ocurrió un error inesperado en el servidor.";
        ToastAlert("error", mensaje);
      } else if (error.request) {
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        ToastAlert("error", "Error en la solicitud.");
      }
    }
  };

  const handleActivarSerie = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/configuraciones/serieCorrelativoActivar/${id}`
      );
      if (response.data.success) {
        ToastAlert("success", "Se activó la serie");
        queryClient.invalidateQueries(["configuracionSerie"]);
        setQuestionEstado(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          const mensajes = Object.values(data.errors).flat();
          mensajes.forEach((msg) => ToastAlert("error", msg));
          return;
        }
        const mensaje =
          data.message ||
          data.error ||
          "Ocurrió un error inesperado en el servidor.";
        ToastAlert("error", mensaje);
      } else if (error.request) {
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        ToastAlert("error", "Error en la solicitud.");
      }
    }
  };

  const handleDesactivarSerie = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/configuraciones/serieCorrelativoDesactivar/${id}`
      );
      if (response.data.success) {
        ToastAlert("success", "Se desactivó la serie");
        queryClient.invalidateQueries(["configuracionSerie"]);
        setModalQuestionActivar(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          const mensajes = Object.values(data.errors).flat();
          mensajes.forEach((msg) => ToastAlert("error", msg));
          return;
        }
        const mensaje =
          data.message ||
          data.error ||
          "Ocurrió un error inesperado en el servidor.";
        ToastAlert("error", mensaje);
      } else if (error.request) {
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        ToastAlert("error", "Error en la solicitud.");
      }
    }
  };

  const columasSerieCorr = [
    {
      name: "ID",
      selector: (row) => row?.id,
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
      center: true,
      sortable: true,
      cell: (row) =>
        row.is_default == 1 ? (
          <span
            style={{
              color: "white",
              backgroundColor: "#39aa48ff",
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            ✔ Por defecto
          </span>
        ) : (
          <button
            onClick={() => {
              setModalQuestionActivar(row?.id);
              setDataSerie(row);
            }}
            className="badge btn btn-dark border shadow-sm"
            style={{
              color: "white",
              borderRadius: "12px",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Establecer
          </button>
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
          <span style={{ color: "green", fontWeight: "bold" }}>Activo</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-2 m-2">
          <button
            type="button"
            className="btn-editar"
            disabled={row.usado == 1}
            title={
              row.usado == 1
                ? "No puedes editar porque ya existe una venta"
                : "Editar serie y corelativo"
            }
            onClick={() => {
              setModalEditarSerie(true);
              setDataEditSerie(row);
            }}
          >
            <Pen size={15} />
          </button>

          {row.estado == 1 ? (
            <button
              type="button"
              onClick={() => {
                setQuestionDesactivar(row);
                setDataActivar(row);
              }}
              disabled={row.is_default == 1}
              title={
                row.is_default == 1
                  ? "No puedes desactivar una serie por defecto"
                  : "Desactivar Serie"
              }
              className="btn-eliminar"
            >
              <Trash size={15} />
            </button>
          ) : (
            <button
              onClick={() => {
                setQuestionEstado(true);
                setDataActivar(row);
              }}
              title="Activar Serie"
              className="btn-activar btn-sm w-auto"
            >
              <PowerIcon size={"auto"} />
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
              id={`flexSwitchCheckDefault${sunatConfig?.id}`}
              checked={!!switches[sunatConfig?.id]}
              onChange={() => handleSwitch(sunatConfig?.id)}
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
      <div className="card shadow-sm py-2">
        <div className="card-header align-items-center d-flex justify-content-left">
          <File size={30} className="text-danger me-2" />
          <span className="fw-semibold h5">
            Información de Serie y correlativo
          </span>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => setModalAddSerieCorr(true)}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <TablasGenerales
            columnas={columasSerieCorr}
            datos={confiSerieCorrelativo}
          />
        </div>
      </div>
      {/* MODAL PARA ACTUALIZAR LA CONFIGURACION DE INTEGRACION DE SUNAT */}
      <ModalRight
        isOpen={modalRightSunat}
        onClose={() => setModalRightSunat(false)}
        title={"Datos Sunat"}
        hideFooter={true}
      >
        <SunatFormIntegracion data={sunatConfig} />
      </ModalRight>

      {/* MODAL PARA AGREGAR UNA NUEVA SERIE */}
      <ModalRight
        isOpen={modalAddSerieCorr}
        onClose={() => setModalAddSerieCorr(false)}
        title={"Agrega una nueva serie"}
        subtitulo=" Registre la serie y el
            correlativo inicial para cada tipo de documento emitido."
        hideFooter={true}
      >
        <AddSerieForm data={sunatConfig} cerrarModal={setModalAddSerieCorr} />
      </ModalRight>

      {/* MODAL PARA ACTUIALIZAR O EDITAR UNA SERIE */}
      <ModalRight
        isOpen={modalEditarSerie}
        onClose={() => setModalEditarSerie(false)}
        title={"Editar Registro serie "}
        subtitulo=" Actualice los datos"
        hideFooter={true}
      >
        {({ handleClose }) => (
          <EditFormSerie
            dataEdit={dataEditSerie}
            /* Le pasamos la función 'handleClose' del modal */
            cerrarModal={handleClose}
          />
        )}
      </ModalRight>

      {/* MODAL PARA PONER POR DEFECTO UNASERIE */}
      <ModalGeneral
        show={modalQuestionActivar}
        handleCloseModal={() => setModalQuestionActivar(false)}
        nombre={dataSerie.serie}
        idProceso={dataSerie?.id}
        handleAccion={handleSetDefault}
      >
        <div className="rounded my-3 p-3">
          <h3 className="fw-bold mb-2">
            ¿Desea establecer esta serie como predeterminada?
          </h3>
          <small className="text-muted">
            Esta serie se utilizará por defecto para emitir documentos del mismo
            tipo. Las demás series de este tipo se desactivarán automáticamente.
          </small>
        </div>
      </ModalGeneral>

      {/* MODAL PARA ACTIVAR UNA SERIE */}
      <ModalGeneral
        show={modalCambiarEstado}
        handleCloseModal={() => setQuestionEstado(false)}
        nombre={dataActivar.serie}
        idProceso={dataActivar?.id}
        handleAccion={handleActivarSerie}
      >
        <div className="rounded my-3 p-3">
          <h3 className="fw-bold mb-2">¿Desea activar esta serie?</h3>
          <small className="text-muted">
            Al activarla, la serie podrá ser utilizada en la emisión de
            documentos, pero no será la predeterminada a menos que usted la
            configure como tal.
          </small>
        </div>
      </ModalGeneral>

      {/* MODAL PARA DESACTIVAR UNA SERIE */}
      <ModalGeneral
        show={modalDesactivar}
        handleCloseModal={() => setQuestionDesactivar(false)}
        nombre={dataActivar.serie}
        idProceso={dataActivar?.id}
        handleAccion={handleDesactivarSerie}
      >
        <div className="rounded my-3 p-3">
          <h3 className="fw-bold mb-2">¿Desea desactivar esta serie?</h3>
          <small className="text-muted">
            Al desactivar, la serie no podrá ser puesta por defecto.
          </small>
        </div>
      </ModalGeneral>
    </div>
  );
}
