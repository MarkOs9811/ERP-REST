import { faPowerOff, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";

import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useTooltips } from "../../hooks/UseToolTips";
import { PlatoEditar } from "./PlatoEdit";
import { Modal } from "react-bootstrap";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { GetPlatos } from "../../service/GetPlatos";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Cargando } from "../componentesReutilizables/Cargando";
import ToastAlert from "../componenteToast/ToastAlert";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import ModalRight from "../componentesReutilizables/ModalRight";
import {
  BtnEditar,
  BtnEliminar,
} from "../componentesReutilizables/BotonesAccion";

export function PlatoList({ search, categoriaActual = null }) {
  const queryClient = useQueryClient();
  const {
    data: platosList = [],
    isLoading: loadingPlatos,
    isError: errorPlatos,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatos,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  console.log("Lista de platos obtenida:", platosList); // <-- Agrega este console.log para verificar los datos
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [dataPlato, setDataPlato] = useState([]);
  const [filterPlatos, setFilterPlatos] = useState([]);

  const handleOpenEditar = (dataPlato) => {
    setShowModalEditar(true);
    setDataPlato(dataPlato);
  };

  const handleCloseEditarCat = () => {
    setShowModalEditar(false);
    setDataPlato([]);
    queryClient.invalidateQueries({ queryKey: ["platos"] });
  };

  // Filtrar según búsqueda y categoría
  useEffect(() => {
    const result = platosList.filter((plato) => {
      const matchCategoria =
        !categoriaActual || categoriaActual.toLowerCase() === "todo"
          ? true
          : plato.categoria?.nombre?.toLowerCase() ===
            categoriaActual.toLowerCase();

      // 2. Condición de Búsqueda (Tu lógica original)
      const { nombre, categoria, descripcion, precio } = plato;
      const searchLower = search.toLowerCase();

      // Si el search está vacío, matchSearch es true. Si no, busca las coincidencias.
      const matchSearch = !search
        ? true
        : (nombre && nombre.toLowerCase().includes(searchLower)) ||
          (categoria?.nombre &&
            categoria.nombre.toLowerCase().includes(searchLower)) ||
          (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
          (precio && precio.toString().includes(searchLower));

      // El plato debe cumplir AMBAS condiciones para mostrarse en la tabla
      return matchCategoria && matchSearch;
    });

    setFilterPlatos(result);
  }, [search, platosList, categoriaActual]);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [modalActivar, setModalActivar] = useState(false);
  const [nombrePlato, setNombrePlato] = useState("");
  const [idPlatoActivar, setIdPlatoActivar] = useState("");
  const [arrayPlato, setArrayPlato] = useState([]);

  const handleEliminarQuestion = (plato) => {
    setShowConfirmDelete(true);
    setArrayPlato(plato);
  };

  const handleCloseModalQuestionEliminar = () => {
    setShowConfirmDelete(false);
    setArrayPlato([]);
  };

  const handleEliminar = async (id) => {
    try {
      const response = await axiosInstance.put(`/combos/desactivar/ ${id}`);
      if (response.data.success) {
        ToastAlert("success", "Platos desactivado correctamente");
        queryClient.invalidateQueries({ queryKey: ["platos"] });
      } else {
        ToastAlert("error", "Ocurrio un error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error conexion", error);
    }
  };

  const handleActivarPlato = async (id) => {
    try {
      const response = await axiosInstance.put(`/combos/activar/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Activado correctamente");
        queryClient.invalidateQueries({ queryKey: ["platos"] });
      } else {
        ToastAlert("error", "Ocurrió un error al activar el combo");
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion", error);
    }
  };

  const handleBanderEnWeb = async (id, estadoActual) => {
    try {
      const estadoEnviar = estadoActual === 1 ? 0 : 1;

      const response = await axiosInstance.put(
        `/gestionPlatos/updateEstadoWebPlato/${id}/${estadoEnviar}`,
      );

      if (response.data.success) {
        const mensaje =
          estadoEnviar === 1
            ? "Activo para delivery"
            : "Oculto en la web de delivery";

        ToastAlert("success", mensaje);
        queryClient.invalidateQueries({ queryKey: ["platos"] });
      } else {
        ToastAlert("error", "Ocurrió un error al cambiar el estado");
      }
    } catch (error) {
      const errorMensaje =
        error.response?.data?.message || "Error de conexión con el servidor";

      ToastAlert("error", errorMensaje);
    }
  };

  const columns = [
    {
      name: "Foto",
      cell: (row) => (
        <img
          src={
            row.foto_url // <-- AHORA USAMOS EL NUEVO CAMPO QUE MANDA LARAVEL
              ? row.foto_url
              : "/images/img-default.jpg"
          }
          alt="Foto del Plato"
          onError={(e) => {
            if (!e.target.src.includes("img-default.jpg")) {
              e.target.src = "/images/img-default.jpg";
            }
          }}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ),
      grow: 0,
      width: "80px",
    },
    {
      name: "Plato",
      selector: (row) => row.nombre, // El selector se mantiene para ordenar por nombre
      sortable: true,
      wrap: true,
      grow: 3, // Damos más espacio a esta columna
      cell: (row) => (
        <div>
          <strong style={{ color: "#212529" }}>{row.nombre}</strong>
          <p
            className="text-muted mb-0"
            style={{ fontSize: "0.85em", whiteSpace: "normal" }}
          >
            {/* Acortamos la descripción si es muy larga */}
            {row.descripcion.length > 80
              ? row.descripcion.substring(0, 80) + "..."
              : row.descripcion}
          </p>
        </div>
      ),
    },
    {
      name: "Categoría", // <-- CAMBIO: Tilde
      selector: (row) => row.categoria.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Precio",
      selector: (row) => row.precio, // <-- CAMBIO: Ordenar por número
      sortable: true,
      wrap: true,
      cell: (row) => (
        // Formateamos el precio y lo ponemos en negrita
        <strong>S/. {Number(row.precio).toFixed(2)}</strong>
      ),
    },
    {
      name: "Activo en Web",
      selector: (row) => row.enWeb,
      sortable: true,
      center: true, // Para que el switch quede bien centrado
      cell: (row) => (
        <div className="form-check form-switch d-flex justify-content-center mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            style={{ cursor: "pointer" }}
            checked={row.enWeb === 1}
            onChange={() => handleBanderEnWeb(row.id, row.enWeb)}
          />
        </div>
      ),
    },
    {
      name: "Estado", // <-- CAMBIO: Nueva columna de Estado
      selector: (row) => row.estado,
      sortable: true,
      width: "120px",
      center: true,
      cell: (row) =>
        row.estado == 1 ? (
          <span className="badge bg-success ">Activo</span>
        ) : (
          <span className="badge bg-danger">Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      center: true,
      grow: 2,
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex gap-2">
            {estado === 1 ? (
              <>
                <BtnEditar
                  onClick={() => handleOpenEditar(row)}
                  title="Editar Plato"
                />
                <BtnEliminar
                  onClick={() => handleEliminarQuestion(row)}
                  title="Eliminar Plato"
                />
              </>
            ) : (
              <button
                className="btn btn-outline-success btn-sm"
                data-bs-toggle="tooltip"
                title="Activar Plato"
                onClick={() => {
                  setModalActivar(true);
                  setNombrePlato(row?.nombre);
                  setIdPlatoActivar(row?.id);
                }}
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
    },
  ];

  useTooltips(platosList);
  return (
    <div>
      {loadingPlatos ? (
        <div className="text-center p-4">
          <p>
            <Cargando />
          </p>
        </div>
      ) : errorPlatos ? (
        <div className="text-center p-4 text-danger">
          <p>Error al cargar los platos.</p>
        </div>
      ) : (
        <TablasGenerales datos={filterPlatos} columnas={columns} />
      )}

      {/* // modal para editar un PLATO */}
      <ModalRight
        isOpen={showModalEditar}
        onClose={handleCloseEditarCat}
        hideFooter={true}
        title={"Actualizar plato"}
      >
        {({ handleClose }) => (
          <PlatoEditar handleCloseModal={handleClose} dataPlato={dataPlato} />
        )}
      </ModalRight>

      {/* MODAL PARA ELIMINAR USUARIO */}
      <ModalAlertQuestion
        show={showConfirmDelete}
        idEliminar={arrayPlato.id}
        nombre={arrayPlato.nombre}
        tipo={"Plato"}
        handleEliminar={handleEliminar}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />

      <ModalAlertActivar
        show={modalActivar}
        idActivar={idPlatoActivar}
        nombre={nombrePlato}
        handleActivar={handleActivarPlato}
        handleCloseModal={() => setModalActivar(false)}
        tipo={"Plato"}
      />
    </div>
  );
}
