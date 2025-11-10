import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import {
  Check,
  CheckCheck,
  FileText,
  Pencil,
  Plus,
  Timer,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../../componenteToast/ModalAlertActivar";
import { SpinnerCargando } from "../../componentesReutilizables/SpinnerCargando";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioHorario } from "./formulariosAjustes/FormularioHorario";
import { GetHorariosAll } from "../../../service/accionesPlanilla/GetHorarioAll";

export function AjustesHorario() {
  const queryClient = useQueryClient();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingActivar, setLoadingActivar] = useState(false);

  const [fitroHorarios, setfitroHorarios] = useState("");
  const [dataDeduccion, setDataHorario] = useState([]);

  const [modalAddHorario, setModalAddHorario] = useState(false);
  const [editarHorario, setEditarHorario] = useState(false);

  const [modalSuspenderDeduccion, setModalSuspenderHorario] = useState(false);
  const [modalActivarDedu, setModalActivarDedu] = useState(false);
  const {
    data: horariosList,
    isLoading: loadingHorarios,
    isError: errorHorarios,
    error: errorHorariosMessage,
  } = useQuery({
    queryKey: ["horarios"],
    queryFn: GetHorariosAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // PARA EL FILTRO DE BUSCAR
  // ============================
  const horariosFiltrados = useMemo(() => {
    if (!horariosList) {
      return [];
    }
    const termino = fitroHorarios.toLowerCase();
    if (termino === "") {
      return horariosList;
    }
    return horariosList.filter((dato) => {
      const horaEntrada = (dato.horaEntrada || "").toLowerCase();
      const horaSalida = (dato.horaSalida || "").toLowerCase();

      return horaEntrada.includes(termino) || horaSalida.includes(termino);
    });
  }, [horariosList, fitroHorarios]);
  // ============================
  // ============================
  const handleSuspenderHorario = async (idDeduccion) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.put(`/horarios/${idDeduccion}`);

      if (response.data.success) {
        setLoadingDelete(false);
        queryClient.invalidateQueries(["horarios"]);
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
        `/horarios/activar/${idDeduccion}`
      );

      if (response.data.success) {
        setLoadingActivar(false);
        queryClient.invalidateQueries(["horarios"]);
        ToastAlert("success", "Se suspendió correctamente");
      }
    } catch (error) {
      setLoadingActivar(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };

  if (loadingHorarios) {
    return (
      <div className=" text-primary" role="status">
        <Cargando />
      </div>
    );
  }
  if (errorHorarios) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los horarios: {errorHorariosMessage.message}
      </div>
    );
  }

  const columnas = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      grow: 0,
    },
    {
      name: "Hora Entrada",
      selector: (row) => row.horaEntrada,
      sortable: true,
    },
    {
      name: "Hora Salida",
      selector: (row) => row.horaSalida,
      sortable: true,
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
                  setModalAddHorario(true);
                  setEditarHorario(true);
                  setDataHorario(row);
                }}
              >
                <Pencil className="text-auto" size={"auto"} />
              </button>
              <button
                className="btn-eliminar"
                title="Eliminar"
                disabled={loadingDelete}
                onClick={() => {
                  setModalSuspenderHorario(true);
                  setDataHorario(row);
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
                setDataHorario(row);
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
          <Timer className="text-auto" /> Horarios
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="form-control"
            onChange={(e) => setfitroHorarios(e.target.value)}
          />
        </div>

        <button
          className="btn btn-sm btn-outline-dark mx-2"
          title="Agregar"
          onClick={() => {
            setModalAddHorario(true);
            setEditarHorario(false);
            setDataHorario([]);
          }}
        >
          <Plus className="text-auto" />
        </button>
      </div>
      <div className="card-body p-0">
        <TablasGenerales columnas={columnas} datos={horariosFiltrados} />
      </div>

      <ModalRight
        isOpen={modalAddHorario}
        onClose={() => setModalAddHorario(false)}
        title={editarHorario ? "Editar Horario" : "Agregar Horario"}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioHorario
            onClose={handleClose}
            isEdit={editarHorario}
            dataEdit={dataDeduccion}
          />
        )}
      </ModalRight>
      <ModalAlertQuestion
        show={modalSuspenderDeduccion}
        idEliminar={dataDeduccion.id}
        nombre={
          "Entrada " +
          dataDeduccion.horaEntrada +
          " - Salida " +
          dataDeduccion.horaSalida
        }
        tipo={"horario"}
        handleEliminar={handleSuspenderHorario}
        handleCloseModal={() => setModalSuspenderHorario(false)}
      />

      <ModalAlertActivar
        show={modalActivarDedu}
        idActivar={dataDeduccion.id}
        nombre={
          "Entrada " +
          dataDeduccion.horaEntrada +
          " - Salida " +
          dataDeduccion.horaSalida
        }
        tipo={"horario"}
        handleActivar={handleActivarDeduccion}
        handleCloseModal={() => setModalActivarDedu(false)}
      />
    </div>
  );
}
