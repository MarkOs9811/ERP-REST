import { useState } from "react";
import {
  Search,
  FileText,
  Plus,
  Tag,
  Edit2,
  Trash2,
  PowerOff,
  Calendar,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPlatos } from "../../service/GetPlatos";


import { FormAddPromocion } from "../../components/componenteDelivery/FormAddPromocion";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { GetData } from "../../service/CRUD/GetData";
import { PutData } from "../../service/CRUD/PutData";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { FormEditPromocion } from "../../components/componenteDelivery/FormEditPromocion";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Promociones() {
  // Estado para controlar los modales y el registro seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [promocionSelected, setPromocionSelected] = useState(null);
  const [showModalActivar, setShowModalActivar] = useState(false);
  const [promoAccion, setPromoAccion] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [promoDelete, setPromoDelete] = useState(null);
  const queryClient = useQueryClient();

  const handleToggleEstado = async (id) => {
    const nuevoEstado = promoAccion.estado === 1 ? 0 : 1;
    const exito = await PutData("delivery/promociones", id, {
      estado: nuevoEstado,
    });
    if (exito) {
      queryClient.invalidateQueries(["promocionesApp"]);
      return true;
    }
    return false;
  };

  const handleDeletePromocion = async (id) => {
    const exito = await DeleteData("delivery/promociones", id);
    if (exito) {
      queryClient.invalidateQueries(["promocionesApp"]);
      return true;
    }
    return false;
  };

  const { data: platos } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatos,
  });

  const {
    data: promociones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promocionesApp"],
    queryFn: () => GetData("delivery/promociones"),
  });

  const getBadgeClass = (estado) => {
    return estado === 1 || estado === true || estado === "Activa"
      ? "bg-success text-white border-success"
      : "bg-secondary text-white border-secondary";
  };

  return (
    <div className="w-full p-0">
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
        {/* HEADER DE LA VISTA */}
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Promociones App
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {promociones?.length || 0} registradas
                </span>
              </h4>
            </CardTitle>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar promoción..."
                className="h-9 pl-9"
              />
            </div>

            <Button size="lg"
              className="w-full gap-2 px-3 sm:w-auto"
              title="Reporte"
              variant="ghostOutline"
            >
              <FileText size={20} />
              <span className="hidden sm:inline">Reporte</span>
            </Button>

            {/* BOTÓN QUE ABRE EL MODAL */}
            <Button size="lg"
              className="gap-2 px-3 w-full sm:w-auto"
              title="Crear Promoción"
              onClick={() => setIsModalOpen(true)}
              variant="default"
            >
              <Plus size={20} />
              <span className="">Crear </span>
            </Button>
          </div>
        </CardHeader>

        {/* BODY (GALERÍA DE PROMOCIONES REALES) */}
        <CardContent className="p-4">
          <CondicionCarga isLoading={isLoading} error={error} mode="cards">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {Array.isArray(promociones) &&
                promociones.map((promo, index) => (
                  <div
                    className="col-span-full md:col-span-6 xl:col-span-3"
                    key={promo.id}
                  >
                    <Card
                      className={`h-full promo-card border-secondary overflow-hidden animacion-cascada ${
                        promo.estado === 1 ? "" : "inactiva"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Banner Image */}
                      <div className="promo-banner-container">
                        <img
                          src={promo.foto_url}
                          alt={promo.titulo}
                          className="promo-banner"
                        />
                        <span
                          className={`inline-flex items-center text-xs transition-colors rounded-full px-3 py-2 promo-badge-status font-medium ${getBadgeClass(
                            promo.estado,
                          )}`}
                        >
                          {promo.estado === 1 ? "Activa" : "Inactiva"}
                        </span>
                      </div>

                      {/* Info de la Promo */}
                      <CardContent className="p-4 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag
                            size={18}
                            className="text-destructive shrink-0 font-bold"
                          />
                          <h5
                            className="mb-0 font-bold truncate"
                            title={promo.titulo}
                          >
                            {promo.titulo}
                          </h5>
                        </div>

                        <p className="text-muted-foreground text-sm mb-3 truncate">
                          Plato:{" "}
                          <strong>
                            {promo.plato?.nombre || "Plato no encontrado"}
                          </strong>
                        </p>

                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <span className="price-old block">
                              S/ {Number(promo.plato?.precio || 0).toFixed(2)}
                            </span>
                            <span className="price-new block">
                              S/ {Number(promo.precio_promocional).toFixed(2)}
                              {promo.porcentaje_descuento && (
                                <span
                                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-destructive ms-2"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  -{promo.porcentaje_descuento}%
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-right text-muted-foreground text-sm">
                            <Calendar size={12} className="me-1 mb-1" />
                            Hasta:{" "}
                            {promo.fecha_fin
                              ? new Date(promo.fecha_fin).toLocaleDateString()
                              : "Sin fecha"}
                          </div>
                        </div>
                      </CardContent>

                      {/* Acciones */}
                      <CardFooter className="bg-muted border-t-0 p-3 flex justify-end gap-2">
                        <Button
                          className="btn-editar"
                          title="Editar Promoción"
                          onClick={() => {
                            setPromocionSelected(promo);
                            setIsModalEditOpen(true);
                          }}
                          variant="secondary"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          className={
                            promo.estado === 1
                              ? "btn-desactivar"
                              : "btn-activar"
                          }
                          title={promo.estado === 1 ? "Desactivar" : "Activar"}
                          onClick={() => {
                            setPromoAccion(promo);
                            setShowModalActivar(true);
                          }}
                          variant="default"
                        >
                          <PowerOff size={16} />
                        </Button>
                        <Button
                          className="btn-eliminar"
                          title="Eliminar Promoción"
                          onClick={() => {
                            setPromoDelete(promo);
                            setShowModalEliminar(true);
                          }}
                          variant="destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
            </div>
          </CondicionCarga>
        </CardContent>
      </Card>

      {/* AQUÍ INVOCAMOS TU MODAL RIGHT PARA AGREGAR */}
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Promoción"
        subtitulo="Atrae más clientes con ofertas exclusivas"
        hideFooter={true}
        width="450px"
      >
        <FormAddPromocion
          onClose={() => setIsModalOpen(false)}
          platos={platos}
        />
      </ModalRight>

      {/* AQUÍ INVOCAMOS TU MODAL RIGHT PARA EDITAR */}
      <ModalRight
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        title="Editar Promoción"
        subtitulo="Actualiza los detalles de la oferta"
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormEditPromocion
            onClose={handleClose}
            platos={platos}
            promocionSelected={promocionSelected}
          />
        )}
      </ModalRight>

      {/* MODAL PARA CONFIRMAR ACTIVAR/DESACTIVAR */}
      <ModalAlertQuestion
        show={showModalActivar}
        handleCloseModal={() => {
          setShowModalActivar(false);
          setPromoAccion(null);
        }}
        handleEliminar={handleToggleEstado}
        idEliminar={promoAccion?.id}
        nombre={promoAccion?.titulo}
        pregunta={`¿Estás seguro de ${
          promoAccion?.estado === 1 ? "desactivar" : "activar"
        }`}
        tipo="esta promoción"
      />

      {/* MODAL PARA CONFIRMAR ELIMINAR OPCIÓN DEFINITIVA */}
      <ModalAlertQuestion
        show={showModalEliminar}
        handleCloseModal={() => {
          setShowModalEliminar(false);
          setPromoDelete(null);
        }}
        handleEliminar={handleDeletePromocion}
        idEliminar={promoDelete?.id}
        nombre={promoDelete?.titulo}
        pregunta="¿Estás completamente seguro de ELIMINAR"
        tipo="esta promoción"
      />
    </div>
  );
}
