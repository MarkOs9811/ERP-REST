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
        payload
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
      <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100">
        <Loader2 className="animate-spin text-dark" size={32} />
        <span className="mt-2 text-muted small">Sincronizando...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h5 className="fw-bold  mb-1 d-flex align-items-center gap-2">
            <Shield size={20} /> Gestión de Módulos
          </h5>
          <div className="text-muted small">
            Empresa:{" "}
            <span className="fw-bold text-dark">{empresaFresca?.nombre}</span>
          </div>
        </div>
        <button className="btn-principal" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <div className="row g-4">
        {/* COLUMNA IZQUIERDA: CONTRATADOS */}
        <div className="col-md-7 pe-md-4 border-end">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold text-success mb-0 d-flex align-items-center gap-2">
              <CheckCircle size={16} /> Contratados ({activos.length})
            </h6>
          </div>

          {activos.length === 0 ? (
            <div className="card border-0 shadow-sm py-5 text-center">
              <div className="text-muted opacity-50 mb-2">
                <PackageOpen size={40} className="mx-auto" />
              </div>
              <small className="text-muted">Sin módulos asignados.</small>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {activos.map((rol) => (
                <div key={rol.id} className="card border">
                  <div className="card-body py-2 px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark small">
                        {rol.nombre}
                      </span>
                      <button
                        className="btn-eliminar p-0"
                        onClick={() => handleDetach(rol.id)}
                        disabled={loadingId === rol.id}
                      >
                        {loadingId === rol.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>

                    {/* Configuración Pivot */}
                    <div className="bg-light rounded p-2 d-flex align-items-center gap-3">
                      <div className="form-check form-switch mb-0 min-h-auto">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          style={{ width: "2em", height: "1em" }}
                          checked={Number(rol.pivot?.estado ?? 1) === 1}
                          onChange={(e) =>
                            handleUpdatePivot(
                              rol.id,
                              "estado",
                              e.target.checked ? 1 : 0
                            )
                          }
                        />
                        <label
                          className="form-check-label small ms-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {Number(rol.pivot?.estado ?? 1) === 1
                            ? "Activo"
                            : "Susp."}
                        </label>
                      </div>
                      <div className="vr opacity-25"></div>
                      <div className="d-flex align-items-center gap-1 flex-grow-1">
                        <Calendar size={12} className="text-muted" />
                        <input
                          type="date"
                          className="form-control form-control-sm border-0 bg-transparent p-0"
                          style={{ fontSize: "0.75rem", boxShadow: "none" }}
                          value={rol.pivot?.fecha_expiracion || ""}
                          onChange={(e) =>
                            handleUpdatePivot(
                              rol.id,
                              "fecha_expiracion",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: DISPONIBLES */}
        <div className="col-md-5 ps-md-4">
          <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
            <PlusCircle size={16} /> Catálogo ({disponibles.length})
          </h6>

          <div
            className="d-flex flex-column gap-2"
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {disponibles.map((rol) => (
              <div
                key={rol.id}
                className="card border-0 bg-white shadow-sm hover-shadow transition-all"
              >
                <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                  <span
                    className="text-dark fw-medium small text-uppercase"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {rol.nombre}
                  </span>

                  <button
                    className="btn-principal btn-sm rounded-pill py-0 px-3"
                    style={{ fontSize: "0.7rem", height: "24px" }}
                    onClick={() => handleAttach(rol.id)}
                    disabled={loadingId === rol.id}
                  >
                    {loadingId === rol.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={"auto"} />
                        Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
            {disponibles.length === 0 && (
              <div className="alert alert-success small py-2">
                ¡Todos asignados!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
