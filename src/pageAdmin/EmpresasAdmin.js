import { useQuery } from "@tanstack/react-query";
import { GetEmpresas } from "../serviceAdmin/GetEmpresas";
import { TablasGenerales } from "../components/componentesReutilizables/TablasGenerales";
import { useMemo, useState } from "react";
import { wrap } from "framer-motion";
import { Check, Eye, Pen, Plus, Trash2 } from "lucide-react";
import { BotonMotionGeneral } from "../components/componentesReutilizables/BotonMotionGeneral";
import ModalRight from "../components/componentesReutilizables/ModalRight";
import { FormularioEmpresaAdmin } from "../componentesSuperAdmin/componentesEmpresaAdmin/FormularioEmpresaAdmin";
import { DashboardEmpresa } from "../componentesSuperAdmin/componentesEmpresaAdmin/DashboardEmpresa";

export function EmpresasAdmin() {
  const [filtro, setFiltro] = useState("");

  const [dataEmpresa, setDataEmpresa] = useState(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const [dashboardEmpresa, setDashboardEmpresa] = useState(false);

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
      wrap: true,
      width: "70px",
    },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "RUC", selector: (row) => row.ruc, sortable: true },
    { name: "Correo", selector: (row) => row.correo, sortable: true },
    { name: "Número", selector: (row) => row.numero, sortable: true },
    {
      name: "Usuario Administrador",
      cell: (row) =>
        row.userAdmin === "" ? (
          <>
            <button className="btn-principal">
              <Plus />
              Asignar Usuario
            </button>
          </>
        ) : (
          `${row.userAdmin}`
        ),

      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) =>
        row.estado == 1 ? (
          <span className="badge bg-success">Activo</span>
        ) : (
          <span className="badge bg-danger">Inactivo</span>
        ),
      sortable: true,
    },
    {
      name: "Acciones",
      selector: (row) =>
        row.estado == 1 ? (
          <>
            <div className="d-flex m-2 gap-2">
              <button
                className="btn-editar"
                onClick={() => {
                  setFormularioAbierto(true);
                  setDataEmpresa(row);
                }}
              >
                <Pen size={"auto"} />
              </button>
              <button className="btn-eliminar">
                <Trash2 size={"auto"} />
              </button>
              <button
                className="btn-principal"
                onClick={() => {
                  setDataEmpresa(row);
                  setDashboardEmpresa(true);
                }}
              >
                <Eye size={"auto"} />
              </button>
            </div>
          </>
        ) : (
          <button className="btn-activar">
            <Check />
          </button>
        ),
      sortable: false,
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
    </div>
  );
}
