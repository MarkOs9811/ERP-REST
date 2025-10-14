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

export function PlatoList({ search }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  // 🔍 Filtrar según búsqueda
  useEffect(() => {
    const result = platosList.filter((plato) => {
      const { nombre, categoria, descripcion, precio } = plato;
      const searchLower = search.toLowerCase();
      return (
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (categoria?.nombre &&
          categoria.nombre.toLowerCase().includes(searchLower)) ||
        (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
        (precio && precio.toString().includes(searchLower))
      );
    });
    setFilterPlatos(result);
  }, [search, platosList]);

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

  const columns = [
    {
      name: "Foto",
      selector: (row) => (
        <img
          src={
            row.foto
              ? `${BASE_URL}/storage/${row.foto}`
              : "/images/img-default.jpg"
          }
          alt="Foto del Plato"
          onError={(e) => {
            // Solo reemplaza la imagen si aún no es la imagen por defecto
            if (!e.target.src.includes("img-default.jpg")) {
              e.target.src = "/images/img-default.jpg";
            }
          }}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
      sortable: false, // No tiene sentido ordenar por imagen
      wrap: false,
      grow: 0,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Categoria",
      selector: (row) => row.categoria.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Descripcion",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
    },
    {
      name: "Precio",
      selector: (row) => "S/." + row.precio,
      sortable: true,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex justify-content-around">
            {estado === 1 ? (
              <>
                <button
                  className=" btn-editar me-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Editar Plato"
                  onClick={() => handleOpenEditar(row)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>

                <button
                  className="btn-eliminar"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Eliminar Plato"
                  onClick={() => handleEliminarQuestion(row)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
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
      <Modal
        show={showModalEditar}
        onHide={handleCloseEditarCat}
        centered
        className="modal-sin-borde"
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Plato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a CATEGORIA */}
          <PlatoEditar
            handleCloseModal={handleCloseEditarCat}
            dataPlato={dataPlato}
          />
        </Modal.Body>
      </Modal>

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
