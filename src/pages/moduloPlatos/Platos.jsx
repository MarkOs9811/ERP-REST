import { useState } from "react";

import { FileText, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { CategoriaPlatos } from "../../components/componenteVender/tareasVender/CategoriaPlatos";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { PlatoList } from "../../components/componentePlatos/PlatoList";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { PlatoAdd } from "../../components/componentePlatos/PlatoAdd";
import { PlatoMasVendido } from "../../components/componentesHome/PlatosMasVendidos";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Platos() {
  const [search, setSearch] = useState("");
  const [upDateList, setUpDateList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const categoriaActual = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="md:col-span-12 col-span-full">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 h-full py-2">
            <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex items-center">
                <CardTitle asChild>
                  <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">Panel de Menú</h4>
                </CardTitle>
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Platos</span>
              </div>
              <div className="overflow-auto">
                {/* AQUI ENLAZAMOS EL SETSEARCH AL COMPONENTE CATEGORIA */}
                <CategoriaPlatos
                  claveVenta="restaurante"
                  clearSearch={setSearch}
                />
              </div>
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative w-full min-w-0 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar plato..."
                    className="h-9 pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Button size="lg"
                  type="button"
                  className="w-full gap-2 px-3 sm:w-auto"
                  onClick={() => GetReporteExcel("/reportePlatosTodos")}
                  variant="ghostOutline"
                >
                  <FileText size={20} />
                  Reporte
                </Button>

                <Button size="lg"
                  type="button"
                  className="gap-2 px-3 w-full sm:w-auto"
                  onClick={() => setShowModal(true)}
                  variant="default"
                >
                  <Plus size={20} />
                  Crear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PlatoList
                search={search}
                upDateList={upDateList}
                categoriaActual={categoriaActual}
              />
            </CardContent>
          </Card>
        </CondicionCarga>
      </div>
      <div className="col-span-full md:col-span-12">
        <PlatoMasVendido />
      </div>

      <ModalRight
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar Nuevo Plato"
        hideFooter={true}
      >
        {({ handleClose }) => <PlatoAdd handleCloseModal={handleClose} />}
      </ModalRight>
    </div>
  );
}
