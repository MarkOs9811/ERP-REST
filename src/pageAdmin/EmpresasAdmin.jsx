import { useQuery } from "@tanstack/react-query";
import { GetEmpresas } from "../serviceAdmin/GetEmpresas";
import { TablasGenerales } from "../components/componentesReutilizables/TablasGenerales";
import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  LayoutDashboard,
  MoreVertical,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { BotonMotionGeneral } from "../components/componentesReutilizables/BotonMotionGeneral";
import ModalRight from "../components/componentesReutilizables/ModalRight";
import { FormularioEmpresaAdmin } from "../componentesSuperAdmin/componentesEmpresaAdmin/FormularioEmpresaAdmin";
import { DashboardEmpresa } from "../componentesSuperAdmin/componentesEmpresaAdmin/DashboardEmpresa";
import { ModulosEmpresa } from "../componentesSuperAdmin/componentesEmpresaAdmin/ModulosEmpresa";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function EmpresasAdmin() {
  const [filtro, setFiltro] = useState("");

  const [dataEmpresa, setDataEmpresa] = useState(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const [dashboardEmpresa, setDashboardEmpresa] = useState(false);
  const [modulosEmpresa, setModulosEmpresa] = useState(false);

  const {
    data: empresasList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["empresasAdmin"],
    queryFn: GetEmpresas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log("Empresas List:", error);

  const empresasFiltradas = useMemo(() => {
    if (!empresasList) {
      return [];
    }
    const termino = filtro.toLowerCase();
    if (termino === "") {
      return empresasList;
    }
    return empresasList.filter((dato) => {
      const nombre = (dato?.nombre || "").toLowerCase();
      const ruc = (dato?.ruc || "").toLowerCase();
      const correo = (dato?.correo || "").toString();
      const numero = (dato.numero || "").toString();
      const direccion = (dato.direccion || "").toString();

      return (
        nombre.includes(termino) ||
        ruc.includes(termino) ||
        correo.includes(termino) ||
        numero.includes(termino) ||
        direccion.includes(termino)
      );
    });
  }, [empresasList, filtro]);

  const columnas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "60px", // Ancho fijo pequeño
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      minWidth: "200px", // Forzamos ancho para evitar saltos de línea feos
      wrap: true,
    },
    {
      name: "RUC",
      selector: (row) => row.ruc,
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      sortable: true,
      minWidth: "250px", // Los correos son largos, damos espacio
      wrap: true,
    },
    {
      name: "Número",
      selector: (row) => row.numero,
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Usuario Administrador",
      selector: (row) => row.userAdmin || "",
      minWidth: "220px",
      cell: (row) =>
        !row.userAdmin ? (
          <Button
            className="border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs flex items-center gap-1"
            onClick={() => console.log("Click en asignar", row)}
            variant="default"
          >
            <Plus size={16} />
            Asignar Usuario
          </Button>
        ) : (
          <span className="text-foreground">{row.userAdmin}</span>
        ),
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      width: "110px",
      cell: (row) =>
        row.estado == 1 ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600/75">
            Activo
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-destructive/75">
            Inactivo
          </span>
        ),
    },
    {
      name: "Acciones",
      allowOverflow: true, // Obligatorio para React Data Table
      button: true,
      width: "80px",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="m-2 text-foreground"
              aria-label={`Acciones de ${row.nombre}`}
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* --- Opciones si está ACTIVO --- */}
            {row.estado == 1 ? (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    setFormularioAbierto(true);
                    setDataEmpresa(row);
                  }}
                >
                  <Pen size={16} />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setDataEmpresa(row);
                    setDashboardEmpresa(true);
                  }}
                >
                  <Eye size={16} />
                  Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setModulosEmpresa(true);
                    setDataEmpresa(row);
                  }}
                >
                  <LayoutDashboard size={16} />
                  Ver Módulos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 size={16} />
                  Eliminar
                </DropdownMenuItem>
              </>
            ) : (
              /* --- Opciones si está INACTIVO --- */
              <>
                <DropdownMenuItem>
                  <Check size={16} />
                  Activar Empresa
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutDashboard size={16} />
                  Ver Módulos
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <Card className="border py-2">
      <CardHeader className="flex">
        <CardTitle asChild>
          <h3 className="">Listado de Empresas</h3>
        </CardTitle>
        <div className="flex ms-auto gap-2">
          <input
            type="text"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Buscar empresa..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <BotonMotionGeneral
            text="Crear nueva empresa"
            icon={<Plus />}
            classDefault="btn-generico w-full items-center"
            onClick={() => {
              setFormularioAbierto(true);
              setDataEmpresa(null);
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TablasGenerales datos={empresasFiltradas} columnas={columnas} />
      </CardContent>

      <ModalRight
        isOpen={formularioAbierto}
        onClose={() => setFormularioAbierto(false)}
        title={dataEmpresa ? "Editar Empresa" : "Crear Nueva Empresa"}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioEmpresaAdmin
            dataEmpresa={dataEmpresa}
            onClose={handleClose}
          />
        )}
      </ModalRight>

      <ModalRight
        isOpen={dashboardEmpresa}
        onClose={() => setDashboardEmpresa(false)}
        title="Dashboard Empresa"
        hideFooter={true}
        width="80%"
      >
        {({ handleClose }) => (
          <DashboardEmpresa dataEmpresa={dataEmpresa} onClose={handleClose} />
        )}
      </ModalRight>

      <ModalRight
        isOpen={modulosEmpresa}
        onClose={() => setModulosEmpresa(false)}
        title="Modulos de la empresa"
        hideFooter={true}
        width="80%"
      >
        {({ handleClose }) => (
          <ModulosEmpresa dataEmpresa={dataEmpresa} onClose={handleClose} />
        )}
      </ModalRight>
    </Card>
  );
}
