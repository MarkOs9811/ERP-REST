import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  CheckCircle,
  Trash2,
  Calendar,
  PlusCircle,
  PackageOpen,
  Loader2,
  Plus,
} from "lucide-react";
import { GetRoles } from "../../service/accionesAreasCargos/GetRoles";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ModulosEmpresa({ onClose, dataEmpresa }) {
  // Solo necesitamos el ID para trabajar de forma independiente
  const empresaId = dataEmpresa?.id;

  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  // 1. CARGAR DATA FRESCA DE LA EMPRESA (Esto soluciona el problema de recargar)
  const { data: empresaFresca, isLoading: loadingEmpresa } = useQuery({
    queryKey: ["empresa", empresaId], // Clave única para esta empresa
    queryFn: async () => {
      if (!empresaId) return null;
      // Pide al backend la empresa actualizada con sus roles
      const res = await axiosInstance.get(`/superadmin/empresas/${empresaId}`);
      return res.data.data || res.data;
    },
    enabled: !!empresaId,
  });

  // 2. CARGAR CATÁLOGO
  const { data: catalogoRoles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: GetRoles,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // 3. LÓGICA DE SEPARACIÓN (Usando empresaFresca)
  const { activos, disponibles } = useMemo(() => {
    // Usamos la data que viene del servidor, no la prop antigua
    const rolesDeLaEmpresa = empresaFresca?.roles || [];

    // Set de IDs para filtrar rápido
    const idsPoseidos = new Set(rolesDeLaEmpresa.map((r) => String(r.id)));

    const listActivos = rolesDeLaEmpresa;

    const listDisponibles = catalogoRoles.filter((rolGlobal) => {
      return !idsPoseidos.has(String(rolGlobal.id));
    });

    return { activos: listActivos, disponibles: listDisponibles };
  }, [empresaFresca, catalogoRoles]); // Dependencias correctas

  // 4. MUTATION
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(
        `/superadmin/empresas/${empresaId}/modulos`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      // ¡AQUÍ ESTÁ LA MAGIA!
      // Al invalidar esta query, React Query vuelve a pedir la data de la empresa
      // y la UI se actualiza sola instantáneamente.
      queryClient.invalidateQueries(["empresa", empresaId]);
      queryClient.invalidateQueries(["empresasAdmin"]); // También actualiza la tabla de atrás

      ToastAlert("success", "Actualizado correctamente");
      setLoadingId(null);
    },
    onError: (err) => {
      console.error(err);
      ToastAlert("error", "Error al actualizar");
      setLoadingId(null);
    },
  });

  // Handlers
  const handleAttach = (roleId) => {
    setLoadingId(roleId);
    mutation.mutate({ role_id: roleId, action: "attach" });
  };

  const handleDetach = (roleId) => {
    if (!window.confirm("¿Quitar módulo y su configuración?")) return;
    setLoadingId(roleId);
    mutation.mutate({ role_id: roleId, action: "detach" });
  };

  const handleUpdatePivot = (roleId, field, value) => {
    mutation.mutate({
      role_id: roleId,
      action: "update_pivot",
      [field]: value,
    });
  };

  // Render de carga
  if (loadingRoles || loadingEmpresa) {
    return (
      <div className="flex flex-col items-center justify-center py-5 h-full">
        <Loader2 className="animate-spin text-foreground" size={32} />
        <span className="mt-2 text-muted-foreground text-sm">
          Sincronizando...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <div>
          <h5 className="font-bold mb-1 flex items-center gap-2">
            <Shield size={20} /> Gestión de Módulos
          </h5>
          <div className="text-muted-foreground text-sm">
            Empresa:{" "}
            <span className="font-bold text-foreground">
              {empresaFresca?.nombre}
            </span>
          </div>
        </div>
        <Button className="btn-principal" onClick={onClose} variant="default">
          Cerrar
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* COLUMNA IZQUIERDA: CONTRATADOS */}
        <div className="col-span-full md:col-span-7 md:pe-4 border-r">
          <div className="flex items-center justify-between mb-3">
            <h6 className="font-bold text-emerald-600 dark:text-emerald-400 mb-0 flex items-center gap-2">
              <CheckCircle size={16} /> Contratados ({activos.length})
            </h6>
          </div>

          {activos.length === 0 ? (
            <Card className="border-0 shadow-sm py-5 text-center">
              <div className="text-muted-foreground opacity-50 mb-2">
                <PackageOpen size={40} className="mx-auto" />
              </div>
              <small className="text-muted-foreground">
                Sin módulos asignados.
              </small>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {activos.map((rol) => (
                <Card key={rol.id} className="border">
                  <CardContent className="py-2 px-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-foreground text-sm">
                        {rol.nombre}
                      </span>
                      <Button
                        className="btn-eliminar p-0"
                        onClick={() => handleDetach(rol.id)}
                        disabled={loadingId === rol.id}
                        variant="destructive"
                      >
                        {loadingId === rol.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                    </div>

                    {/* Configuración Pivot */}
                    <div className="bg-muted rounded p-2 flex items-center gap-3">
                      <div className="flex items-center gap-2 mb-0 min-h-auto">
                        <input
                          className="size-4 shrink-0 rounded border-input accent-primary"
                          type="checkbox"
                          role="switch"
                          style={{ width: "2em", height: "1em" }}
                          checked={Number(rol.pivot?.estado ?? 1) === 1}
                          onChange={(e) =>
                            handleUpdatePivot(
                              rol.id,
                              "estado",
                              e.target.checked ? 1 : 0,
                            )
                          }
                        />
                        <label
                          className="font-medium text-sm ms-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {Number(rol.pivot?.estado ?? 1) === 1
                            ? "Activo"
                            : "Susp."}
                        </label>
                      </div>
                      <div className="vr opacity-25"></div>
                      <div className="flex items-center gap-1 grow">
                        <Calendar size={12} className="text-muted-foreground" />
                        <input
                          type="date"
                          className="w-full rounded-md border-input shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 text-xs border-0 bg-transparent p-0"
                          style={{ fontSize: "0.75rem", boxShadow: "none" }}
                          value={rol.pivot?.fecha_expiracion || ""}
                          onChange={(e) =>
                            handleUpdatePivot(
                              rol.id,
                              "fecha_expiracion",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: DISPONIBLES */}
        <div className="col-span-full md:col-span-5 md:ps-4">
          <h6 className="font-bold text-primary mb-3 flex items-center gap-2">
            <PlusCircle size={16} /> Catálogo ({disponibles.length})
          </h6>

          <div
            className="flex flex-col gap-2"
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {disponibles.map((rol) => (
              <Card
                key={rol.id}
                className="border-0 bg-background shadow-sm hover-shadow transition-all"
              >
                <CardContent className="py-2 px-3 flex justify-between items-center">
                  <span
                    className="font-medium text-sm uppercase"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {rol.nombre}
                  </span>

                  <Button
                    className="btn-principal inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs rounded-full py-0 px-3"
                    style={{ fontSize: "0.7rem", height: "24px" }}
                    onClick={() => handleAttach(rol.id)}
                    disabled={loadingId === rol.id}
                    variant="default"
                  >
                    {loadingId === rol.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={"auto"} />
                        Agregar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {disponibles.length === 0 && (
              <div className="relative w-full rounded-lg px-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm py-2">
                ¡Todos asignados!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
