import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../componentesReutilizables/Cargando";
import {
  Check,
  CircleMinus,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioDeduccion } from "./formulariosAjustes/FormularioDeduccion";
import { GetDeduccionAll } from "../../../service/accionesPlanilla/GetDeduccionAll";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../../componenteToast/ModalAlertActivar";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { SpinnerCargando } from "../../componentesReutilizables/SpinnerCargando";

export function AjustesDeducciones() {
  const queryClient = useQueryClient();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingActivar, setLoadingActivar] = useState(false);

  const [filtroDeduccion, setFiltroDeducciones] = useState("");
  const [dataDeduccion, setDataDeduccion] = useState([]);

  const [modalAddDeduccion, setModalAddDeduccion] = useState(false);
  const [editarDeduccion, setEditarDeduccion] = useState(false);

  const [modalSuspenderDeduccion, setModalSuspenderDeduccion] = useState(false);
  const [modalActivarDedu, setModalActivarDedu] = useState(false);

  const {
    data: deducciones,
    isLoading: loadingDeducciones,
    isError: errorDeducciones,
    error: errorDeduccionesMessage,
  } = useQuery({
    queryFn: GetDeduccionAll,
    queryKey: ["deducciones"],
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // PARA EL FILTRO DE BUSCAR
  // ============================
  const bonificacionFiltrada = useMemo(() => {
    if (!deducciones) {
      return [];
    }
    const termino = filtroDeduccion.toLowerCase();
    if (termino === "") {
      return deducciones;
    }
    return deducciones.filter((dato) => {
      const nombre = (dato.nombre || "").toLowerCase();
      const porcentaje = (dato.porcentaje || "").toLowerCase();

      return nombre.includes(termino) || porcentaje.includes(termino);
    });
  }, [deducciones, filtroDeduccion]);
  // ============================
  const handleSuspenderDeduccion = async (idDeduccion) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(`/deducciones/${idDeduccion}`);

      if (response.data.success) {
        setLoadingDelete(false);
        queryClient.invalidateQueries(["deducciones"]);
        ToastAlert("success", "Se suspendió correctamente");
      }
    } catch (error) {
      setLoadingDelete(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };

  const handleActivarDeduccion = async (idDeduccion) => {
    setLoadingActivar(true);
    try {
      const response = await axiosInstance.put(
        `/deducciones/activar/${idDeduccion}`
      );

      if (response.data.success) {
        setLoadingActivar(false);
        queryClient.invalidateQueries(["deducciones"]);
        ToastAlert("success", "Se suspendió correctamente");
      }
    } catch (error) {
      setLoadingActivar(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };

  if (loadingDeducciones)
    return (
      <p>
        <Cargando />
      </p>
    );
  if (errorDeducciones) return <p>Error: {errorDeduccionesMessage}</p>;

  const columnas = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "50px",
    },
    {
      name: "Nombre del concepto",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: 1,
      grow: 1,
    },
    {
      name: "%",
      selector: (row) => "% " + row.porcentaje,
      sortable: true,
      grow: 0,
    },
    {
      name: "Estado",
      cell: (row) => (
        <div>
          {row.estado === 1 ? (
            <div className="badge bg-success text-white">Activo</div>
          ) : (
            <div className="badge bg-danger text-white">Inactivo</div>
          )}
        </div>
      ),
      sortable: true,
      grow: 0,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          {row.estado == 1 ? (
            <>
              <button
                className=" btn-editar mx-1"
                title="Editar"
                onClick={() => {
                  setModalAddDeduccion(true);
                  setEditarDeduccion(true);
                  setDataDeduccion(row);
                }}
              >
                <Pencil className="text-auto" size={"auto"} />
              </button>
              <button
                className="btn-eliminar"
                title="Eliminar"
                disabled={loadingDelete}
                onClick={() => {
                  setModalSuspenderDeduccion(true);
                  setDataDeduccion(row);
                }}
              >
                {loadingDelete ? (
                  <SpinnerCargando />
                ) : (
                  <Trash2 className="text-auto" size={"auto"} />
                )}
              </button>
            </>
          ) : (
            <button
              className="btn-activar"
              title="acivar"
              disabled={loadingActivar}
              onClick={() => {
                setModalActivarDedu(true);
                setDataDeduccion(row);
              }}
            >
              {loadingActivar ? (
                <SpinnerCargando />
              ) : (
                <Check className="text-auto" size={"auto"} />
              )}
            </button>
          )}
        </div>
      ),
      sortable: true,
      grow: 0,
      right: true,
    },
  ];
  return (
    <div className="card shadow-sm h-100 py-2">
      <div className="card-header d-flex justify-content-between align-items-center p-2 border-bottom">
        <h4 className=" mb-0">
          <CircleMinus className="text-auto" /> Deducciones
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="form-control"
            onChange={(e) => setFiltroDeducciones(e.target.value)}
          />
        </div>

        <button
          className="btn btn-sm btn-outline-dark mx-2"
          title="Agregar"
          onClick={() => {
            setModalAddDeduccion(true);
            setEditarDeduccion(false);
            setDataDeduccion([]);
          }}
        >
          <Plus className="text-auto" />
        </button>
      </div>
      <div className="card-body p-0">
        <TablasGenerales columnas={columnas} datos={bonificacionFiltrada} />
      </div>

      <ModalRight
        isOpen={modalAddDeduccion}
        onClose={() => setModalAddDeduccion(false)}
        title={editarDeduccion ? "Editar Deducción" : "Agregar Deduccion"}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioDeduccion
            onClose={handleClose}
            isEdit={editarDeduccion}
            dataEdit={dataDeduccion}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={modalSuspenderDeduccion}
        idEliminar={dataDeduccion.id}
        nombre={dataDeduccion.nombre}
        tipo={"deducción"}
        handleEliminar={handleSuspenderDeduccion}
        handleCloseModal={() => setModalSuspenderDeduccion(false)}
      />

      <ModalAlertActivar
        show={modalActivarDedu}
        idActivar={dataDeduccion.id}
        nombre={dataDeduccion.nombre}
        tipo={"deducción"}
        handleActivar={handleActivarDeduccion}
        handleCloseModal={() => setModalActivarDedu(false)}
      />
    </div>
  );
}
