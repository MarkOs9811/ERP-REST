import { useQuery } from "@tanstack/react-query";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetPlanillaCargo } from "../../service/GetTrabajadorCargo";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { TablasGenerales } from "../../components/componentesReutilizables/TablasGenerales";
import { Eye, FileText, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ListaTrabajador() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { idCargo } = useParams();
  const {
    data: listaTrabajador,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listaTrabajadores", idCargo],
    queryFn: () => GetPlanillaCargo(idCargo), // Pasa el string directamente
    enabled: !!idCargo && !isNaN(idCargo), // Asegura que sea número

    retry: 1,
  });

  const handleGenerarBoleta = () => {
    alert("generando boleta...");
  };

  const handleVerDetalles = () => {
    alert("Ver detalles...");
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: true,
      width: "80px",
    },
    {
      name: "Foto",
      selector: (row) => row.usuario?.foto_url || "No disponible",
      cell: (row) => (
        <div className="flex justify-center">
          {row.usuario?.fotoPerfil ? (
            <img
              src={`${row.usuario?.foto_url}`}
              alt="Foto perfil"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
              onError={(e) => {
                e.target.src = `${BASE_URL}/images/avatar-default.png`;
              }}
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ddd",
              }}
            >
              <i className="bi bi-person text-xl text-muted-foreground"></i>
            </div>
          )}
        </div>
      ),
      width: "100px",
      center: true,
    },
    {
      name: "Nombre Completo",
      selector: (row) => row.nombre_completo,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>
          <strong>{row.nombre_completo}</strong>
          <div className="text-muted-foreground text-sm">
            {row.documento_identidad}
          </div>
        </div>
      ),
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo,
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Área",
      selector: (row) => row.area,
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Días Trabajados",
      selector: (row) => row.dias_trabajados,
      sortable: true,
      center: true,
      cell: (row) => (
        <div>
          <div className="progress" style={{ height: "20px", width: "100px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${row.porcentaje_dias_trabajados}%`,
                backgroundColor:
                  row.porcentaje_dias_trabajados >= 80
                    ? "#28a745"
                    : row.porcentaje_dias_trabajados >= 50
                      ? "#ffc107"
                      : "#dc3545",
              }}
              aria-valuenow={row.porcentaje_dias_trabajados}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {row.dias_trabajados}
            </div>
          </div>
          <small className="text-muted-foreground">
            {row.porcentaje_dias_trabajados.toFixed(1)}%
          </small>
        </div>
      ),
      width: "180px",
    },
    {
      name: "Salario Neto",
      selector: (row) => row.salario_neto,
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="font-bold">
          {row.salario_neto
            ? `S/. ${parseFloat(row.salario_neto).toFixed(2)}`
            : "No registrado"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Contrato",
      selector: (row) => row.contrato,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80"
            onClick={() => handleVerDetalles(row.id)}
            title="Ver detalles"
            variant="default"
          >
            <Eye color={"auto"} height="20px" width="20px" />
          </Button>

          <Button
            className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80"
            onClick={() => handleGenerarBoleta(row.id)}
            title="Generar boleta"
            variant="default"
          >
            <FileText color={"auto"} height="20px" width="20px" />
          </Button>
        </div>
      ),
      width: "120px",
    },
  ];

  const handleRegistrarEmpleado = () => {
    navigate("/rr-hh/ingreso-a-planilla");
  };

  return (
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">Panel Planilla</h4>
            </CardTitle>
            <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {listaTrabajador?.length > 0
                ? `${listaTrabajador[0].cargo}`
                : `${idCargo ? `(Cargo ID: ${idCargo})` : "Trabajadores"}`}
            </span>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar trabajador..."
                className="h-9 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button size="lg"
              type="button"
              className="gap-2 px-3 w-full sm:w-auto"
              onClick={handleRegistrarEmpleado}
              variant="default"
            >
              <Plus size={18} />
              Agregar
            </Button>
          </div>
        </CardHeader>
        {isLoading && <p>Cargando Trabajador...</p>}
        {isError && <p>Error al cargar los Trabajador.</p>}
        <CardContent className="p-0">
          <TablasGenerales columnas={columns} datos={listaTrabajador} />
        </CardContent>
      </Card>
    </div>
  );
}
