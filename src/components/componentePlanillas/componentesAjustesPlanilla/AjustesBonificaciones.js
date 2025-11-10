import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import {
  CheckCheck,
  Coins,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import {
  FormularioAddBonificaciones,
  FormularioBonificacion,
} from "./formulariosAjustes/FormularioBonificacion";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { GetBonificacionAll } from "../../../service/accionesPlanilla/GetBonificacionesAll";
import ModalAlertActivar from "../../componenteToast/ModalAlertActivar";

export function AjustesBonificaciones() {
  const queryClient = useQueryClient();
  const [filtroBonificacion, setFiltroBoificaciones] = useState("");

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingActivar, setLoadingActivar] = useState(false);

  const [modalAddBoni, setModalAddBoni] = useState(false);
  const [modalEditBoni, setModalEditBoni] = useState(false);

  const [dataBonificaciones, setDataBonificacion] = useState([]);
  const [modalQuestionDesactivar, setModalQuestionDesactivar] = useState(false);
  const [modalQuestionActivar, setModalQuestionActivar] = useState(false);

  const {
    data: bonificaciones,
    isLoading: loadingBonificaciones,
    isError: errorBonificaciones,
    error: errorBonificacionesMessage,
  } = useQuery({
    queryFn: GetBonificacionAll,
    queryKey: ["bonificaciones"],
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // PARA EL FILTRO DE BUSCAR
  // ============================
  const bonificacionFiltrada = useMemo(() => {
    if (!bonificaciones) {
      return [];
    }
    const termino = filtroBonificacion.toLowerCase();
    if (termino === "") {
      return bonificaciones;
    }
    return bonificaciones.filter((dato) => {
      const nombre = (dato.nombre || "").toLowerCase();
      const descripcion = (dato.descripcion || "").toLowerCase();

      const monto = (dato.monto || "").toString();

      return (
        nombre.includes(termino) ||
        descripcion.includes(termino) ||
        monto.includes(termino)
      );
    });
  }, [bonificaciones, filtroBonificacion]);
  // ============================

  const handleEliminarBoni = async (idBonificacion) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(
        `/bonificaciones/${idBonificacion}`
      );

      if (response.data.success) {
        setLoadingDelete(false);
        queryClient.invalidateQueries(["bonificacion"]);
        ToastAlert("success", "Se suspendió correctamente");
      }
    } catch (error) {
      setLoadingDelete(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };
  const handleActivarBoni = async (idBonificacion) => {
    setLoadingActivar(true);
    try {
      const response = await axiosInstance.put(
        `/bonificaciones/activar/${idBonificacion}`
      );

      if (response.data.success) {
        setLoadingActivar(false);
        queryClient.invalidateQueries(["bonificacion"]);
        ToastAlert("success", "Se activó correctamente");
      }
    } catch (error) {
      setLoadingActivar(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };
  if (loadingBonificaciones)
    return (
      <p>
        <Cargando />
      </p>
    );
  if (errorBonificaciones) return <p>Error: {errorBonificacionesMessage}</p>;

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
      name: "Monto",
      selector: (row) => "S/. " + row.monto,
      sortable: true,
    },
    {
      name: "Estado",
      grow: 0,
      cell: (row) => (
        <div>
          {row.estado == 1 ? (
            <div className="badge bg-success text-white">Activo</div>
          ) : (
            <div className="badge bg-danger text-white">Inactivo</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Acciones",
      grow: 0,
      cell: (row) => (
        <div className="d-flex justify-content-center">
          {/* Botón Eliminar o Activar */}
          {row.estado == 1 ? (
            <>
              {/* Botón Editar */}
              <button
                className=" btn-editar btn-sm"
                title="Editar"
                onClick={() => {
                  setModalAddBoni(true);
                  setModalEditBoni(true);
                  setDataBonificacion(row);
                }}
              >
                <Pencil className="text-auto" size={"auto"} />
              </button>
              <button
                className="btn-eliminar btn-sm ms-2"
                title="Eliminar"
                onClick={() => {
                  setModalQuestionDesactivar(true);
                  setDataBonificacion(row);
                }}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <span className="spinner-border-sm" role="status"></span>
                ) : (
                  <>
                    <Trash2 className="text-auto" size={"auto"} />
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className="btn-activar btn-sm ms-2"
              title="Activar"
              onClick={() => {
                setModalQuestionActivar(true);
                setDataBonificacion(row);
              }}
              disabled={loadingActivar}
            >
              <CheckCheck className="text-auto" size={"auto"} />
            </button>
          )}
        </div>
      ),
      right: true,
      sortable: true,
    },
  ];
  return (
    <div className="card shadow-sm h-100 py-2">
      <div className="card-header d-flex justify-content-between align-items-center p-2 border-bottom">
        <h4 className=" mb-0">
          <Coins className="text-auto" /> Bonificaciones
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="form-control"
            onChange={(e) => setFiltroBoificaciones(e.target.value)}
          />
        </div>

        <button
          className="btn btn-sm btn-outline-dark mx-2"
          title="Agregar"
          onClick={() => {
            setModalAddBoni(true);
            setModalEditBoni(false);
            setDataBonificacion([]);
          }}
        >
          <Plus className=" text-auto" />
        </button>
      </div>
      <div className="card-body p-0">
        <TablasGenerales columnas={columnas} datos={bonificacionFiltrada} />
      </div>

      <ModalRight
        isOpen={modalAddBoni}
        onClose={() => setModalAddBoni(false)}
        title={modalEditBoni ? "Editar Bonificación" : "Agregar Bonificación"}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioBonificacion
            onClose={handleClose}
            dataBoni={modalEditBoni}
            datosToEditar={dataBonificaciones}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={modalQuestionDesactivar}
        idEliminar={dataBonificaciones.id}
        nombre={dataBonificaciones.nombre}
        tipo={"bonificacion"}
        handleEliminar={handleEliminarBoni}
        handleCloseModal={() => setModalQuestionDesactivar(false)}
      />

      <ModalAlertActivar
        show={modalQuestionActivar}
        idActivar={dataBonificaciones.id}
        nombre={dataBonificaciones.nombre}
        tipo={"bonificacion"}
        handleActivar={handleActivarBoni}
        handleCloseModal={() => setModalQuestionActivar(false)}
      />
    </div>
  );
}
