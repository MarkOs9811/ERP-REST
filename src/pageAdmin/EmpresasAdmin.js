import { useQuery } from "@tanstack/react-query";
import { GetEmpresas } from "../serviceAdmin/GetEmpresas";
import { TablasGenerales } from "../components/componentesReutilizables/TablasGenerales";
import { useMemo, useState } from "react";
import { wrap } from "framer-motion";
import {
  Check,
  Eye,
  Grab,
  LayoutDashboard,
  MoreVertical,
  MoreVerticalIcon,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { BotonMotionGeneral } from "../components/componentesReutilizables/BotonMotionGeneral";
import ModalRight from "../components/componentesReutilizables/ModalRight";
import { FormularioEmpresaAdmin } from "../componentesSuperAdmin/componentesEmpresaAdmin/FormularioEmpresaAdmin";
import { DashboardEmpresa } from "../componentesSuperAdmin/componentesEmpresaAdmin/DashboardEmpresa";
import { ModulosEmpresa } from "../componentesSuperAdmin/componentesEmpresaAdmin/ModulosEmpresa";

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

  console.log("Empresas List:", empresasList);

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
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => console.log("Click en asignar", row)}
          >
            <Plus size={16} />
            Asignar Usuario
          </button>
        ) : (
          <span className="text-dark">{row.userAdmin}</span>
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
          <span className="badge bg-success bg-opacity-75">Activo</span>
        ) : (
          <span className="badge bg-danger bg-opacity-75">Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      allowOverflow: true, // Obligatorio para React Data Table
      button: true,
      width: "80px",
      cell: (row) => (
        <div className="dropdown m-2">
          <button
            className="btn bg-transparent btn-sm text-dark"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-boundary="window"
            data-bs-popper-config='{"strategy":"fixed"}'
          >
            <MoreVertical size={18} />
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0">
            {/* --- Opciones si está ACTIVO --- */}
            {row.estado == 1 ? (
              <>
                <li>
                  <button
                    className="btn-editar dropdown-item align-items-center gap-2"
                    onClick={() => {
                      setFormularioAbierto(true);
                      setDataEmpresa(row);
                    }}
                  >
                    <Pen size={16} /> Editar
                  </button>
                </li>
                <li>
                  <button
                    className="btn-principal dropdown-item align-items-center gap-2"
                    onClick={() => {
                      setDataEmpresa(row);
                      setDashboardEmpresa(true);
                    }}
                  >
                    <Eye size={16} /> Ver Detalles
                  </button>
                </li>
                <li>
                  <button
                    className="btn-principal dropdown-item align-items-center gap-2"
                    onClick={() => {
                      setModulosEmpresa(true);
                      setDataEmpresa(row);
                    }}
                  >
                    <LayoutDashboard size={16} /> Ver Módulos
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="btn-eliminar dropdown-item align-items-center gap-2 text-danger">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </li>
              </>
            ) : (
              /* --- Opciones si está INACTIVO --- */
              <>
                <li>
                  <button className="btn-activar dropdown-item align-items-center gap-2 text-success">
                    <Check size={16} /> Activar Empresa
                  </button>
                </li>
                <li>
                  <button className="btn-principal dropdown-item align-items-center gap-2">
                    <LayoutDashboard size={16} /> Ver Módulos
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      ),
    },
  ];
  return (
    <div className="card  border py-2">
      <div className="card-header d-flex ">
        <h3 className="card-title">Listado de Empresas</h3>
        <div className="d-flex ms-auto gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar empresa..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <BotonMotionGeneral
            text="Crear nueva empresa"
            icon={<Plus />}
            classDefault="d-flex w-100 align-items-center border-0 rounded-3 "
            onClick={() => {
              setFormularioAbierto(true);
              setDataEmpresa(null);
            }}
          />
        </div>
      </div>
      <div className="card-body p-0">
        <TablasGenerales datos={empresasFiltradas} columnas={columnas} />
      </div>

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
    </div>
  );
}
