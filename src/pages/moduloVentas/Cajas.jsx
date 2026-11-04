import { CajasList } from "../../components/componentesModuloVentas/CajasList";
import { useState } from "react";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import ModalRight from "../../components/componentesReutilizables/ModalRight";

import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FormAddCaja } from "../../components/componentesModuloVentas/accionesCaja/FormAddCaja";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { RegistrosCajasList } from "../../components/componentesModuloVentas/RegistrosCajasList";
import { GetCajas } from "../../service/accionesVentas/GetCajas";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Cajas() {
  const [search, setSearch] = useState("");
  const [modalAddCaja, setModalAddCaja] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/cajas", data);

      if (response.data.success) {
        setModalAddCaja(false);
        ToastAlert("success", "Caja creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
      } else {
        // Si llega con success: false desde backend (pero sin status 422)
        const msg =
          response.data.message || "Ocurrió un error al crear la caja";
        ToastAlert("error", msg);
      }
    } catch (error) {
      // Si el backend devuelve error de validación (422)
      if (error.response && error.response.status === 422) {
        const data = error.response.data;

        // Si Laravel devuelve errores múltiples (array en `errors`)
        if (data.errors) {
          const mensajes = Object.values(data.errors).flat().join("\n");
          ToastAlert("error", mensajes);
        }
        // Si Laravel devuelve solo un `message`
        else if (data.message) {
          ToastAlert("error", data.message);
        }
        // Fallback
        else {
          ToastAlert("error", "Error de validación desconocido");
        }
      }

      // Errores internos (500, 404, etc.)
      else if (error.response) {
        const msg =
          error.response.data?.message || "Error interno del servidor";
        ToastAlert("error", msg);
      }

      // Si no hay respuesta (error de red, timeout, etc.)
      else if (error.request) {
        ToastAlert("error", "No hay conexión con el servidor");
      }

      // Errores imprevistos del frontend
      else {
        ToastAlert("error", `Error inesperado: ${error.message}`);
      }
    }
  };

  const {
    data: cajas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cajas"],
    queryFn: GetCajas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full">
        <CondicionCarga
          isLoading={isLoading}
          isError={isError}
          mode="single-card"
        >
          <Card className="">
            <CardHeader className="border-b-0 flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="flex items-center">
                <CardTitle asChild>
                  <h4 className="mb-0">Panel de Cajas</h4>
                </CardTitle>
                <span className="badge-header ms-2">Registro</span>
              </div>
              <div className="flex items-center flex-wrap gap-2 mt-3 md:mt-0">
                <Button
                  type="button"
                  className="btn-principal px-3"
                  onClick={() => setModalAddCaja(true)}
                  variant="default"
                >
                  <Plus size={18} />
                  Abrir Caja
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 mb-3">
              <CajasList />
            </CardContent>
          </Card>
        </CondicionCarga>
      </div>
      <div className="col-span-full">
        <CondicionCarga
          isLoading={isLoading}
          isError={isError}
          mode="single-card"
        >
          <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 overflow-hidden">
            <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex items-center">
                <CardTitle asChild>
                  <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">Registros Caja</h4>
                </CardTitle>
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Historial</span>
              </div>

              <div className="flex flex-col md:flex-row items-center md:justify-end gap-2 mt-3 md:mt-0">
                <div className="relative w-full min-w-0 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    className="h-9 pl-9"
                    placeholder="Buscar registro..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: "150px" }}
                >
                  <option value="">Todas las cajas</option>
                  {cajas?.map((caja) => (
                    <option key={caja.id} value={caja.nombreCaja}>
                      {caja.nombreCaja}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "180px" }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RegistrosCajasList search={search} />
            </CardContent>
          </Card>
        </CondicionCarga>
      </div>
      <ModalRight
        isOpen={modalAddCaja}
        onClose={() => {
          setModalAddCaja(false);
        }}
        title={"Crear una caja"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-3">
          <FormAddCaja
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
          />
        </div>
      </ModalRight>
    </div>
  );
}
