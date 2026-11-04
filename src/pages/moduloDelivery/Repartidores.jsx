import {
  FileText,
  Plus,
  Phone,
  Mail,
  User,
  Search,
  Eye,
  PowerOff,
  Trash2,
  Edit2,
  Power,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUsuarios } from "../../service/GetUsuarios";


import ModalRight from "../../components/componentesReutilizables/ModalRight";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { FormEditRepartidor } from "../../components/componenteDelivery/FormEditRepartidor";
import { PutData } from "../../service/CRUD/PutData";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Repartidores() {
  const {
    data: repartidores,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repartidores"],
    queryFn: GetUsuarios,
  });

  const queryClient = useQueryClient();

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [repartidorSelected, setRepartidorSelected] = useState(null);

  const [showModalActivar, setShowModalActivar] = useState(false);
  const [repartidorAccion, setRepartidorAccion] = useState(null);

  const handleToggleEstado = async (id) => {
    const nuevoEstado = repartidorAccion?.estado == 1 ? 0 : 1;
    const exito = await PutData("delivery/repartidores-estado", id, {
      estado: nuevoEstado,
    });
    if (exito) {
      queryClient.invalidateQueries(["repartidores"]);
      return true;
    }
    return false;
  };

  const usuariosRepartidores = repartidores
    ? repartidores.filter(
        (usuario) =>
          usuario?.empleado?.cargo?.nombre === "conductor" ||
          usuario?.empleado?.cargo?.nombre === "repartidor" ||
          usuario?.empleado?.cargo?.nombre === "delivery",
      )
    : [];

  return (
    <div className="w-full p-0">
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
        {/* HEADER DE LA VISTA */}
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Panel de Repartidores
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {usuariosRepartidores.length} activos
                </span>
              </h4>
            </CardTitle>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar repartidor..."
                className="h-9 pl-9"
              />
            </div>
            <Button size="lg"
              className="w-full gap-2 px-3 sm:w-auto"
              title="Generar Reporte Completo"
              variant="ghostOutline"
            >
              <FileText size={20} />
              <span className="hidden sm:inline">Reporte</span>
            </Button>
            <Button asChild size="lg"
              className="gap-2 px-3 w-full sm:w-auto"
              title="Agregar Nuevo Repartidor"
              variant="default"
            >
              <Link to="/rrhh">
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar</span>
              </Link>
            </Button>
          </div>
        </CardHeader>

        {/* BODY CON EL LISTADO HORIZONTAL (GRID DE BOOTSTRAP 5) */}
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {isLoading ? (
              <div className="col-span-full text-center py-5">
                <div
                  className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent text-primary"
                  role="status"
                >
                  <span className="sr-only">Cargando...</span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Sincronizando la flota...
                </p>
              </div>
            ) : error ? (
              <div className="col-span-full">
                <div className="relative w-full rounded-lg px-4 py-3 border-destructive/30 bg-destructive/10 text-destructive shadow-sm border-0 text-sm">
                  Error al cargar repartidores: {error.message}
                </div>
              </div>
            ) : usuariosRepartidores.length === 0 ? (
              <div className="col-span-full text-center py-5">
                <p className="text-muted-foreground text-lg">
                  No hay repartidores registrados actualmente.
                </p>
              </div>
            ) : (
              usuariosRepartidores.map((repartidor) => (
                /* AQUÍ ESTÁ LA CLAVE: col-md-6 (2 por fila en tablet) col-xl-4 o col-xl-3 (3 o 4 por fila en desktop) */
                <div
                  className="col-span-full md:col-span-6 xl:col-span-4"
                  key={repartidor.id}
                >
                  <Card className="h-full bg-background">
                    {/* Rejilla interna simplificada con Flexbox puro */}
                    <CardContent className="p-3 flex items-center gap-3">
                      {/* 1. Avatar fijo a la izquierda */}
                      <div className="relative shrink-0">
                        <div className="avatar-circle-horizontal overflow-hidden">
                          <img
                            src={repartidor.foto_url || "/default-avatar.png"}
                            alt="Avatar"
                            loading="lazy"
                            width={60}
                            height={60}
                            className="avatar-img-horizontal"
                          />
                        </div>
                        <div
                          className={`status-indicator-horizontal ${repartidor.estado == 1 ? "bg-emerald-600" : "bg-destructive"}`}
                          title={
                            repartidor.estado == 1
                              ? "Activo/Conectado"
                              : "Inactivo"
                          }
                        ></div>
                      </div>

                      {/* 2. Información central fluida */}
                      <div className="grow" style={{ minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <h6
                            className="mb-0 font-bold truncate"
                            title={`${repartidor.empleado.persona.nombre} ${repartidor.empleado.persona.apellidos}`}
                          >
                            {repartidor.empleado.persona.nombre}{" "}
                            {repartidor.empleado.persona.apellidos}
                          </h6>
                        </div>

                        <div className="mb-2">
                          <span
                            className="inline-flex items-center text-xs font-semibold transition-colors bg-emerald-600 border-emerald-500 rounded-full px-2 py-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Motorizado
                          </span>
                        </div>

                        <div
                          className="flex flex-col gap-1 text-muted-foreground"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Phone
                              size={12}
                              className="text-muted-foreground shrink-0"
                            />
                            <span className="truncate">
                              {repartidor?.empleado?.persona?.telefono ||
                                "Sin registro"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Mail
                              size={12}
                              className="text-muted-foreground shrink-0"
                            />
                            <span className="truncate" title={repartidor.email}>
                              {repartidor.email || "Sin correo"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Acciones alineadas a la derecha */}
                      <div className="flex justify-center items-center shrink-0 gap-2">
                        <Button
                          className="btn-editar p-2"
                          title="Editar Repartidor"
                          onClick={() => {
                            setRepartidorSelected(repartidor);
                            setIsModalEditOpen(true);
                          }}
                          variant="secondary"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs p-2 ${repartidor.estado == 1 ? "btn-eliminar" : "btn-activar"}`}
                          title={
                            repartidor.estado == 1
                              ? "Desactivar Repartidor"
                              : "Activar Repartidor"
                          }
                          onClick={() => {
                            setRepartidorAccion(repartidor);
                            setShowModalActivar(true);
                          }}
                          variant="destructive"
                        >
                          {repartidor.estado == 0 ? (
                            <Power size={18} />
                          ) : (
                            <PowerOff size={18} />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* MODAL PARA EDITAR REPARTIDOR */}
      <ModalRight
        isOpen={isModalEditOpen}
        onClose={() => {
          setIsModalEditOpen(false);
          setRepartidorSelected(null);
        }}
        title="Editar Repartidor"
        subtitulo="Modifica la información de contacto y vehículo"
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormEditRepartidor
            onClose={handleClose}
            repartidor={repartidorSelected}
          />
        )}
      </ModalRight>

      {/* MODAL PARA CONFIRMAR ACTIVAR/DESACTIVAR */}
      <ModalAlertQuestion
        show={showModalActivar}
        handleCloseModal={() => {
          setShowModalActivar(false);
          setRepartidorAccion(null);
        }}
        handleEliminar={handleToggleEstado}
        idEliminar={repartidorAccion?.id}
        nombre={
          repartidorAccion
            ? `${repartidorAccion.empleado?.persona?.nombre} ${repartidorAccion.empleado?.persona?.apellidos}`
            : ""
        }
        pregunta={`¿Estás seguro de ${repartidorAccion?.estado == 1 ? "desactivar" : "activar"}`}
        tipo="el repartidor"
      />
    </div>
  );
}
