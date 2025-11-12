import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useEffect, useState } from "react";
import { GetPlatos } from "../../service/GetPlatos";
import { Cargando } from "../componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ModalRight from "../componentesReutilizables/ModalRight";
import { NuevoCombo } from "./combos/NuevoCombo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { EllipsisVerticalIcon } from "lucide-react";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";
import { EditCombo } from "./combos/EditCombo";

export function CombosList() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Empieza mostrando 6 combos
  const cardBodyRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient(); // ← Obtienes el cliente

  const [modalQuestion, setModalQuestion] = useState(false);
  const [modalActivar, setModalActivar] = useState(false);
  const [nombreCombo, setNombreCombo] = useState("");
  const [idEliminar, setIdEliminar] = useState("");
  const [idActivarCombo, setIdActivarCombo] = useState("");

  const [modalEditCombo, setModalEditCombo] = useState(false);
  const [dataCombo, setDataCombo] = useState(false);

  const {
    data: platosList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["combos"],
    queryFn: GetPlatos,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleUpdateCombos = () => {
    queryClient.invalidateQueries({ queryKey: ["combos"] }); // ← Sintaxis correcta
  };

  const filteredCombos = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return platosList
      .filter((plato) => plato.categoria?.nombre?.toLowerCase() === "combos")
      .filter((combo) => {
        const { nombre, descripcion, precio } = combo;
        return (
          (nombre && nombre.toLowerCase().includes(lowerSearch)) ||
          (descripcion && descripcion.toLowerCase().includes(lowerSearch)) ||
          (precio && precio.toString().includes(lowerSearch))
        );
      });
  }, [platosList, search]);

  // Mostrar combos según el scroll
  const visibleCombos = useMemo(() => {
    return filteredCombos.slice(0, visibleCount);
  }, [filteredCombos, visibleCount]);

  // Detectar scroll para cargar más combos
  useEffect(() => {
    const cardBody = cardBodyRef.current;
    if (!cardBody) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = cardBody;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;

      if (isNearBottom && visibleCount < filteredCombos.length) {
        setVisibleCount((prev) => prev + 6); // Cargar 6 más
      }
    };

    cardBody.addEventListener("scroll", handleScroll);
    return () => cardBody.removeEventListener("scroll", handleScroll);
  }, [filteredCombos.length, visibleCount]);

  const handleEliminarCombo = async (id) => {
    try {
      const response = await axiosInstance.put(`/combos/desactivar/ ${id}`);
      if (response.data.success) {
        ToastAlert("success", "Combo desactivado correctamente");
        queryClient.invalidateQueries({ queryKey: ["combos"] });
      } else {
        ToastAlert("error", "Ocurrio un error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error conexion", error);
    }
  };

  const handleActivarACombo = async (id) => {
    try {
      const response = await axiosInstance.put(`/combos/activar/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Activado correctamente");
        queryClient.invalidateQueries({ queryKey: ["combos"] });
      } else {
        ToastAlert("error", "Ocurrió un error al activar el combo");
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion", error);
    }
  };

  const {
    data: estadoOpenAi,
    isLoading: isLoadingOpen,
    isError: isErrorOpen,
    error,
    refetch: refetchSunat,
  } = EstadoIntegraciones("Open Ai", { enabled: false });

  if (isLoadingOpen) return <p>Cargando estado...</p>;
  if (isErrorOpen) return <p>Error: {error.message}</p>;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-bottom d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Combos</h5>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex flex-wrap">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(6); // Reset si se hace nueva búsqueda
              }}
            />
          </div>
          <div className="d-flex align-items-center ">
            <button
              className=" btn btn-outline-dark btn-sm rounded-pill "
              onClick={() => {
                setIsModalOpen(true);
                refetchSunat();
              }}
            >
              <FontAwesomeIcon icon={faPlus} color={"auto"} />
              Nuevo Combo
            </button>
          </div>
        </div>
      </div>

      <div
        className="card-body"
        style={{ overflowY: "auto", minHeight: "450px" }}
        ref={cardBodyRef}
      >
        {isLoading ? (
          <Cargando />
        ) : isError ? (
          <p className="text-danger">Error al cargar los combos.</p>
        ) : filteredCombos.length === 0 ? (
          <p>No se encontraron combos.</p>
        ) : (
          <div className="row">
            {visibleCombos.map((combo) => (
              <div className="col-md-3 mb-3" key={combo.id}>
                <div
                  className="card h-100 shadow-sm border position-relative"
                  style={{
                    backgroundImage: `url("/utilitarios/comboFondo.jpg")`,
                    backgroundSize: "50%",
                    backgroundPosition: "bottom left",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "12px",
                    overflow: "visible", // aseguramos que no haya recortes
                  }}
                >
                  {/* Overlay bloqueado si combo está inactivo */}
                  {combo.estado == 0 && (
                    <div
                      className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        zIndex: 5,
                        top: 0,
                        left: 0,
                      }}
                    >
                      <span className="text-white mb-2 fw-bold">
                        No disponible
                      </span>
                      <button
                        className="btn btn-light btn-sm"
                        title="Activar Combo"
                        type="button"
                        onClick={() => {
                          setModalActivar(true);
                          setNombreCombo(combo.nombre);
                          setIdActivarCombo(combo.id);
                        }}
                      >
                        Activar
                      </button>
                    </div>
                  )}

                  <div className="card-body position-relative d-flex">
                    <div>
                      <p className="card-title h6 fw-bold">
                        {capitalizeFirstLetter(combo.nombre)}
                      </p>
                      <small className="card-text">{combo.descripcion}</small>
                    </div>

                    <div className="dropdown position-relative ">
                      <button
                        className="btn p-0 m-0"
                        type="button"
                        id="dropdownMenu2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <EllipsisVerticalIcon className="text-auto" />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-bottom"
                        aria-labelledby="dropdownMenu2"
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => {
                              setModalEditCombo(true);
                              setDataCombo(combo);
                            }}
                          >
                            Editar
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => {
                              setModalQuestion(true);
                              setNombreCombo(combo.nombre);
                              setIdEliminar(combo.id);
                            }}
                          >
                            Desactivar Combo
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    className="card-footer d-flex justify-content-between align-items-center flex-column position-relative"
                    style={{ zIndex: 2, backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <span className="badge badge-ok mb-2">
                      S/ {combo.precio}
                    </span>
                    <button className="btn btn-outline-dark btn-sm ms-auto">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Nuevo Combo"
        submitText="Agregar"
        hideFooter={true}
      >
        <div className="modal-body p-3">
          <NuevoCombo
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleUpdateCombos}
            estadoOpenAi={estadoOpenAi}
          />
        </div>
      </ModalRight>

      <ModalRight
        isOpen={modalEditCombo}
        onClose={() => {
          setModalEditCombo(false);
        }}
        title="Editar Comboo"
        hideFooter={true}
      >
        <div className="modal-body p-3">
          <EditCombo dataCombo={dataCombo} />
        </div>
      </ModalRight>

      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={idEliminar}
        nombre={nombreCombo}
        handleEliminar={handleEliminarCombo}
        handleCloseModal={() => setModalQuestion(false)}
        tipo={"combo"}
      />

      <ModalAlertActivar
        show={modalActivar}
        idActivar={idActivarCombo}
        nombre={nombreCombo}
        handleActivar={handleActivarACombo}
        handleCloseModal={() => setModalActivar(false)}
        tipo={"combo"}
      />
    </div>
  );
}
