import { SolicitudesList } from "../../components/componentesModuloVentas/SolicitudesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Solicitud() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleGoAddSolicitud = () => {
    navigate("/ventas/solicitud/realizarSolicitud");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="col-lg-12">
        <Card className="">
          <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2">
            <div className="d-flex align-items-center">
              <CardTitle asChild><h4 className="mb-0">
                Mis Solicitudes
                <span className="badge-header ms-2">Almacén</span>
              </h4></CardTitle>
            </div>

            <div className="d-flex  gap-2 mt-3 mt-md-0 align-items-center ms-auto">
              <div className="header-search-container">
                <Search className="search-icon" />
                <input
                  className="form-control"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                className="btn-principal px-3 w-100"
                onClick={() => handleGoAddSolicitud()}
               variant="default">
                <Plus size={18} className="me-1" />
                Nueva Solicitud
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <SolicitudesList search={search} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
