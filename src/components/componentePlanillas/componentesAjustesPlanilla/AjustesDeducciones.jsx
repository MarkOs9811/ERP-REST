import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { Check, CircleMinus, FileText, Plus } from "lucide-react";
import {
  BtnEditar,
  BtnEliminar,
} from "../../componentesReutilizables/BotonesAccion";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioDeduccion } from "./formulariosAjustes/FormularioDeduccion";
import { GetDeduccionAll } from "../../../service/accionesPlanilla/GetDeduccionAll";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../../componenteToast/ModalAlertActivar";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { SpinnerCargando } from "../../componentesReutilizables/SpinnerCargando";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        `/deducciones/activar/${idDeduccion}`,
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
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600 text-white">
              Activo
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-destructive text-white">
              Inactivo
            </div>
          )}
        </div>
      ),
      sortable: true,
      grow: 0,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center">
          {row.estado == 1 ? (
            <>
              <BtnEditar
                onClick={() => {
                  setModalAddDeduccion(true);
                  setEditarDeduccion(true);
                  setDataDeduccion(row);
                }}
                title="Editar Deducción"
              />
              <BtnEliminar
                disabled={loadingDelete}
                onClick={() => {
                  setModalSuspenderDeduccion(true);
                  setDataDeduccion(row);
                }}
                title="Eliminar Deducción"
              />
            </>
          ) : (
            <Button
              className="btn-activar"
              title="acivar"
              disabled={loadingActivar}
              onClick={() => {
                setModalActivarDedu(true);
                setDataDeduccion(row);
              }}
              variant="default"
            >
              {loadingActivar ? (
                <SpinnerCargando />
              ) : (
                <Check className="text-auto" size={"auto"} />
              )}
            </Button>
          )}
        </div>
      ),
      sortable: true,
      grow: 0,
      right: true,
    },
  ];
  return (
    <Card className="h-full py-2">
      <CardHeader className="flex justify-between items-center p-2 border-b">
        <h4 className="mb-0">
          <CircleMinus className="text-auto" /> Deducciones
        </h4>
        <div className="flex mx-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setFiltroDeducciones(e.target.value)}
          />
        </div>

        <Button
          className="btn-principal btn-icon mx-2"
          title="Agregar"
          onClick={() => {
            setModalAddDeduccion(true);
            setEditarDeduccion(false);
            setDataDeduccion([]);
          }}
          variant="default"
        >
          <Plus className="text-auto" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <TablasGenerales columnas={columnas} datos={bonificacionFiltrada} />
      </CardContent>

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
    </Card>
  );
}
