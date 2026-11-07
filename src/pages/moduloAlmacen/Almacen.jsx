import { AlmacenList } from "../../components/componenteAlmacen/AlmacenList";
import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { FileText, Plus, Search, Upload } from "lucide-react";
import { useState } from "react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModalCargaMasiva } from "@/components/componenteAlmacen/ModalCargaMasiva";
import ModalRight from "@/components/componentesReutilizables/ModalRight";
import { useQueryClient } from "@tanstack/react-query";

export function Almacen() {
  const [updateList, setUpdateList] = useState(false);
  const [modalCargaAbierto, setModalCargaAbierto] = useState(false); // Estado para el modal
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleCloseModal = () => {
    setUpdateList((prev) => !prev);
  };

  const handleAgregar = () => {
    navigate("/almacen/registro");
  };
  const recargarTabla = () => {
    queryClient.invalidateQueries({ queryKey: ["almacen"] });
  };
  return (
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 flex flex-col py-2">
        <CardHeader className="flex flex-col items-start gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Panel de Almacen
              </h4>
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              ítems
            </span>
          </div>

          {/* Bloque Derecho: Buscador y Botones (Cambiamos me-auto por sm:ml-auto si es necesario, o simplemente el justify-between de arriba se encarga) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar en almacen..."
                className="h-9 pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Button
                size="lg"
                type="button"
                className="flex-1 sm:flex-none gap-2 px-3 h-9"
                onClick={() => GetReporteExcel("/reporteAlmacenTodo")}
                variant="ghostOutline"
              >
                <FileText size={18} />
                Reporte
              </Button>
              <Button
                size="lg"
                className="flex-1 sm:flex-none gap-2 px-3 h-9"
                onClick={() => handleAgregar()}
                variant="default"
              >
                <Plus size={18} />
                Agregar
              </Button>
              <Button
                size="lg"
                type="button"
                className="flex-1 sm:flex-none gap-2 px-3 h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setModalCargaAbierto(true)}
              >
                <Upload size={18} />
                Importar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent
          className="overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <AlmacenList search={search} updateList={updateList} />
        </CardContent>
      </Card>

      {/* RENDERIZAR EL MODAL AQUÍ */}
      <ModalRight
        isOpen={modalCargaAbierto}
        onClose={() => setModalCargaAbierto(false)}
        title="Importar Catálogo de DIGEMID"
        width="30%"
        hideFooter
      >
        <ModalCargaMasiva
          handleClose={() => setModalCargaAbierto(false)}
          onUpdate={recargarTabla}
        />
      </ModalRight>
    </div>
  );
}
