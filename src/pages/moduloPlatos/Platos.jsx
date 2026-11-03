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


export function Platos() {
  const [search, setSearch] = useState("");
  const [upDateList, setUpDateList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const categoriaActual = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 ">
      <div className="md:col-span-12 col-lg-12">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <Card className="h-full py-2">
            <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center mb-2">
              <div className="d-flex align-items-center">
                <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                  Panel de Menú
                </h4></CardTitle>
                <span className="badge-header ms-2">Platos</span>
              </div>
              <div className="overflow-auto">
                {/* AQUI ENLAZAMOS EL SETSEARCH AL COMPONENTE CATEGORIA */}
                <CategoriaPlatos
                  claveVenta="restaurante"
                  clearSearch={setSearch}
                />
              </div>
              <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                <div className="header-search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar plato..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Button
                  type="button"
                  className="btn btn-outline-dark px-3"
                  onClick={() => GetReporteExcel("/reportePlatosTodos")}
                 variant="default">
                  <FileText size={20} />
                  Reporte
                </Button>

                <Button
                  type="button"
                  className="btn btn-dark px-3"
                  onClick={() => setShowModal(true)}
                 variant="default">
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
      <div className="md:col-span-12">
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
