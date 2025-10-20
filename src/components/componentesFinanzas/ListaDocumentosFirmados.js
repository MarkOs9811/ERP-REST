import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { GetDocFirmados } from "../../service/serviceFinanzas/GetDocFirmados";
import { useState } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { Trash2 } from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function ListaDocumentosFirmados() {
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  const queryClient = useQueryClient();
  const [dataDocumento, setDataDocument] = useState([]);
  const [handleEliminar, setHandleEliminar] = useState(false);
  const {
    data: dataDocFirmados = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documentosFirmados"],
    queryFn: GetDocFirmados,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const EliminarDoc = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/borrarDocumentoFirmado/${id}`
      );
      if (response.data.success) {
        ToastAlert("success", "Se eliminó correctamente el documento");
        queryClient.refetchQueries(["documentosFirmados"]);
      } else {
        ToastAlert("error", "Error" + response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion interna");
    }
  };
  // 🔹 Definimos las columnas de la tabla
  const columnas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Usuario",
      selector: (row) =>
        row.usuario?.empleado?.persona?.nombre +
          " " +
          row.usuario?.empleado?.persona?.apellidos ?? "Sin usuario",
      sortable: true,
    },
    {
      name: "Nombre del Archivo",
      selector: (row) => row.nombre_archivo,
      sortable: true,
      grow: 2,
    },
    {
      name: "Ruta del Archivo",
      selector: (row) => row.ruta_archivo,
      cell: (row) => (
        <a
          href={API_BASE_URL + row.ruta_archivo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Ver documento
        </a>
      ),
      grow: 2,
    },
    {
      name: "Fecha de Creación",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      width: "150px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          onClick={() => {
            setHandleEliminar(true);
            setDataDocument(row);
          }}
          className="btn-eliminar d-flex"
          title="Eliminar este documento"
        >
          <Trash2 className="text-auto" size={"auto"} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px",
    },
  ];

  // 🔹 Renderizamos la tabla usando el componente genérico
  return (
    <div className="">
      <div className="card-header p-3">
        <h6 className="mb-3 font-bold text-lg">Documentos Firmados</h6>
      </div>
      <div className="card-body p-0">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <TablasGenerales columnas={columnas} datos={dataDocFirmados} />
        </CondicionCarga>
      </div>
      <ModalAlertQuestion
        show={handleEliminar}
        handleCloseModal={() => setHandleEliminar(false)}
        idEliminar={dataDocumento.id}
        tipo={"este documento"}
        nombre={dataDocumento.nombre_archivo}
        handleEliminar={() => EliminarDoc(dataDocumento.id)}
      />
    </div>
  );
}
