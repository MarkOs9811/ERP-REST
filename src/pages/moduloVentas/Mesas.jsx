import { useState } from "react";
// Importa los componentes
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { FormularioMesa } from "../../components/componentesVentas/formularios/FormularioMesa";
// Importa los iconos
import {
  Plus,
  Edit2,
  Trash2,
  Table,
  Users,
  Building,
  CheckCircle,
  AlertCircle,
  AlertTriangle, // <-- Para el error
} from "lucide-react";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetMesasAll } from "../../service/accionesVentas/GetMesasAll";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export function Mesas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);

  const [questionModalDelete, setQuestionModalDelete] = useState(false);
  const [dataMesa, setDataMesa] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: dummyMesas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasAll, // Esta función ahora devuelve { success: true, data: [...] }
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      if (data && data.data && Array.isArray(data.data)) {
        return data.data; // Extraemos el array de adentro
      }
      return [];
    },
  });

  const handleEliminar = async (idEliminar) => {
    const exito = await DeleteData("mesas", idEliminar);

    setQuestionModalDelete(false);

    if (exito) {
      queryClient.invalidateQueries(["mesas"]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="md:col-span-12">
        <Card className="">
          <CardHeader className="flex justify-between items-center border-0">
            <h4 className="mb-0">Gestión de Mesas</h4>
            <Button
              className="btn-principal "
              title="Agregar nueva mesa"
              onClick={() => {
                setIsEditMode(false);
                setSelectedMesa(null);
                setModalOpen(true);
              }}
             variant="default">
              <Plus size={18} />
              Agregar Mesa
            </Button>
          </CardHeader>

          <CardContent className="p-4">
            {/* --- INICIO: Manejo de Estados de Carga/Error (¡MUY IMPORTANTE!) --- */}
            {isLoading && (
              <div className="text-center p-5">
                <span className="load"></span> {/* Asumo tu spinner */}
                <p className="text-muted mt-2">Cargando mesas...</p>
              </div>
            )}

            {isError && (
              <div className="text-center p-5 text-danger">
                <AlertTriangle className="mx-auto mb-2" size={40} />
                <h5>Error al Cargar</h5>
                <p>No se pudieron obtener los datos de las mesas.</p>
              </div>
            )}

            {!isLoading && !isError && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Mensaje si no hay mesas */}
                {dummyMesas.length === 0 ? (
                  <div className="col-12 text-center p-5">
                    <Table size={40} className="text-muted mx-auto mb-2" />
                    <h5>No hay mesas registradas</h5>
                    <p>Comienza agregando una nueva mesa.</p>
                  </div>
                ) : (
                  // Ahora 'dummyMesas' SÍ es un array y .map() funcionará
                  dummyMesas.map((mesa) => (
                    <div key={mesa.id} className="md:col-span-3 col-lg-2">
                      <Card className="h-full border">
                        <CardContent className="text-center flex flex-col p-3">
                          {/* Icono de Estado */}
                          {mesa?.estado == 1 ? (
                            <CheckCircle
                              size={36}
                              className="text-success mx-auto"
                              title="Disponible"
                            />
                          ) : (
                            <AlertCircle
                              size={36}
                              className="text-danger mx-auto"
                              title="Ocupada"
                            />
                          )}

                          {/* Info */}
                          <CardTitle asChild><h5 className="mt-2 mb-1">
                            Mesa N° {mesa?.numero}
                          </h5></CardTitle>
                          <div>
                            <span
                              className={`badge w-auto ${
                                mesa?.estado == 1 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {mesa?.estado == 1 ? "Disponible" : "Ocupada"}
                            </span>
                          </div>
                          <hr className="my-2" />
                          <div className="text-start">
                            <small className="text-muted d-flex align-items-center">
                              <Users size={14} className="me-2" />
                              Capacidad: {mesa?.capacidad}
                            </small>
                            <small className="text-muted d-flex align-items-center mt-1">
                              <Building size={14} className="me-2" />
                              Piso: {mesa?.piso}
                            </small>
                          </div>
                        </CardContent>
                        {/* Footer de Acciones */}
                        <CardFooter className="flex justify-center gap-2">
                          <Button
                            className="btn-editar btn-icon btn-sm"
                            title={
                              mesa?.estado == 0
                                ? "No se puede editar (mesa ocupada)"
                                : "Editar mesa"
                            }
                            disabled={mesa?.estado == 0}
                            onClick={() => {
                              if (mesa?.estado == 0) {
                                ToastAlert(
                                  "error",
                                  "No se puede editar una mesa que está en uso.",
                                );
                                return;
                              }
                              setIsEditMode(true);
                              setSelectedMesa(mesa);
                              setModalOpen(true);
                            }}
                           variant="secondary">
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            className="btn-eliminar btn-icon btn-sm"
                            title={
                              mesa?.estado == 0
                                ? "No se puede eliminar (mesa ocupada)"
                                : "Eliminar mesa"
                            }
                            disabled={mesa?.estado == 0}
                            onClick={() => {
                              if (mesa?.estado == 0) {
                                ToastAlert(
                                  "error",
                                  "No se puede eliminar una mesa que está en uso.",
                                );
                                return;
                              }
                              setQuestionModalDelete(true);
                              setDataMesa(mesa);
                            }}
                           variant="destructive">
                            <Trash2 size={16} />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Renderizado del Modal (Sin cambios) --- */}
      <ModalRight
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Editar Mesa" : "Agregar Nueva Mesa"}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioMesa
            onClose={handleClose}
            isEdit={isEditMode}
            dataEdit={selectedMesa}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={questionModalDelete}
        idEliminar={dataMesa.id}
        nombre={"Número " + dataMesa.numero}
        handleEliminar={handleEliminar}
        handleCloseModal={() => setQuestionModalDelete(false)}
        pregunta={"¿Estas seguro de eliminar la mesa"}
      />
    </div>
  );
}
