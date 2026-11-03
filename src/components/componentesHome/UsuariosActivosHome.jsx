import { useQuery } from "@tanstack/react-query";
import { GetAsistencia } from "../../service/GetAsistencia";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";


export function UsuariosActivosHome() {
  const navigate = useNavigate(); // Inicializa useNavigate

  const {
    data: usuariosActivos = [],
    isLoading: isLoadingUsuarios,
    isError: isErrorUsuarios,
  } = useQuery({
    queryKey: ["usuariosActivos"],
    queryFn: GetAsistencia,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const listaAsistenciaHoy = usuariosActivos?.listaAsistenciaHoy || [];

  return (
    <CondicionCarga isLoading={isLoadingUsuarios} isError={isErrorUsuarios}>
      <Card className="h-full overflow-auto rounded-xl border border-border bg-card p-0 text-card-foreground">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <span
            className="inline-flex rounded-full p-2 text-white"
            style={{ background: "var(--fw-strawberry)" }}
          >
            <UserRound size={18} />
          </span>
          <div>
            <h2 className="mb-0 text-sm font-semibold">
              Usuarios activos
            </h2>
            <p className="mb-0 text-xs text-muted-foreground">
              {listaAsistenciaHoy.length} en asistencia hoy
            </p>
          </div>
        </div>
        <div className="p-4">
          {listaAsistenciaHoy.length > 0 ? (
            <>
              <ul className="m-0 list-none p-0">
                {listaAsistenciaHoy.slice(0, 4).map((usuario) => (
                  <li
                    key={usuario.id}
                    className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0"
                  >
                    <img
                      src={`${usuario.empleado?.empleado?.usuario?.foto_url}`}
                      alt="Foto de perfil"
                      className="size-11 rounded-full border-2 border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="mb-0 truncate text-sm font-semibold text-foreground">
                        {capitalizeFirstLetter(
                          (usuario?.empleado?.nombre || "").toLowerCase(),
                        )}{" "}
                        {capitalizeFirstLetter(
                          (usuario?.empleado?.apellidos || "").toLowerCase(),
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {listaAsistenciaHoy.length > 4 && (
                <div className="mt-3 flex items-center gap-2">
                  <p className="mb-0 text-sm text-muted-foreground">
                    +{listaAsistenciaHoy.length - 4} más...
                  </p>
                  <Button
                    className="p-0 text-sm font-semibold text-primary hover:underline"
                    onClick={() => navigate("/rr.hh/asistencia")}
                   variant="default">
                    Ver todos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="mb-0 text-sm text-muted-foreground">
              No hay usuarios activos hoy.
            </p>
          )}
        </div>
      </Card>
    </CondicionCarga>
  );
}
