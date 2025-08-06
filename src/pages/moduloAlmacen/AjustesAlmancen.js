import { useState } from "react";
import Categorias from "../../components/componenteAlmacen/componentesAjustesAlmacen/Categorias";
import UnidadMedida from "../../components/componenteAlmacen/componentesAjustesAlmacen/UnidadMedida";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../../components/componenteToast/ModalAlertActivar";

export function AjustesAlmacen() {
  const [modalShowDesactivar, setModalShowDesactivar] = useState(false);
  const [modalShowActivar, setModalShowActivar] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [tipoEntidad, setTipoEntidad] = useState(null); // "categoria" o "unidad"

  const queryClient = useQueryClient();

  const { data: categorias = [] } = useQuery({
    queryKey: ["categoriasAlmacen"],
    queryFn: GetCategoria,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: unidades = [] } = useQuery({
    queryKey: ["unidadesMedidas"],
    queryFn: GetUnidades,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleToggle = (item, tipo) => {
    setItemSeleccionado(item);
    setTipoEntidad(tipo);

    if (item.estado == 1) {
      setModalShowDesactivar(true);
    } else {
      setModalShowActivar(true);
    }
  };

  const confirmarCambioEstado = async () => {
    console.log(
      `Cambiando estado de ${tipoEntidad}:`,
      itemSeleccionado?.nombre
    );

    // Aquí deberías usar la lógica para cambiar el estado del item
    // Por ejemplo:
    // await axiosInstance.patch(`/${tipoEntidad}s/${itemSeleccionado.id}/toggle`);

    // Refresca la data según el tipo de entidad
    if (tipoEntidad === "categoria") {
      queryClient.invalidateQueries({ queryKey: ["categoriasAlmacen"] });
    } else if (tipoEntidad === "unidad") {
      queryClient.invalidateQueries({ queryKey: ["unidadesMedidas"] });
    }

    cerrarModales();
  };

  const cerrarModales = () => {
    setModalShowDesactivar(false);
    setModalShowActivar(false);
    setItemSeleccionado(null);
    setTipoEntidad(null);
  };

  return (
    <ContenedorPrincipal>
      <div className="card shadow-sm ">
        <div className="card-header border-bottom">
          <h4>Configuración de Almacén</h4>
        </div>
        <div className="card-body mb-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <Categorias
                categorias={categorias}
                onToggle={(categoria) => handleToggle(categoria, "categoria")}
              />
            </div>
            <div className="col-lg-6">
              <UnidadMedida
                unidades={unidades}
                onToggle={(unidad) => handleToggle(unidad, "unidad")}
              />
            </div>
          </div>
        </div>

        {/* Modal para desactivar */}
        <ModalAlertQuestion
          show={modalShowDesactivar}
          idEliminar={itemSeleccionado?.id}
          nombre={itemSeleccionado?.nombre}
          tipo="desactivar"
          handleEliminar={confirmarCambioEstado}
          handleCloseModal={cerrarModales}
        />

        {/* Modal para activar */}
        <ModalAlertActivar
          show={modalShowActivar}
          idEliminar={itemSeleccionado?.id}
          nombre={itemSeleccionado?.nombre}
          tipo="activar"
          handleEliminar={confirmarCambioEstado}
          handleCloseModal={cerrarModales}
        />
      </div>
    </ContenedorPrincipal>
  );
}
