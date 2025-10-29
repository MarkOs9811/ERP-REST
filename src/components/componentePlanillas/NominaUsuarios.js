import { useQuery } from "@tanstack/react-query";
import { GetNomina } from "../../service/accionesPlanilla/GetNomina";
import { useEffect, useState, useMemo } from "react"; // 1. Importar useMemo
import { Eye } from "lucide-react";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import { PerfilGeneralNomina } from "./PerfilGeneralNomina";

export function NominaUsuarios({ search = "", updateList }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalPerfilEmpleado, setModalPerfilEmpleado] = useState(false);
  const [idEmpleado, setIdEmpleado] = useState(null);

  const {
    data: usuariosData = [],
    isLoading,
    isError,
    // refetch, // (No lo estás usando, pero está bien)
  } = useQuery({
    queryKey: ["nomina", updateList],
    queryFn: GetNomina,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 2. (Recomendado) Añade 5 min de staleTime
  });

  // 3. ELIMINAMOS EL useEffect y useState PARA EL FILTRADO
  // const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  // useEffect(() => { ... });

  // 4. USAMOS useMemo para filtrar. Es más rápido y no causa bucles.
  const filteredUsuarios = useMemo(() => {
    return usuariosData.filter((usuario) => {
      const {
        usuario: user,
        nombre_completo,
        documento_identidad,
        area,
        cargo,
      } = usuario;
      const searchLower = search.toLowerCase();
      return (
        (user?.email && user.email.toLowerCase().includes(searchLower)) ||
        (nombre_completo &&
          nombre_completo.toLowerCase().includes(searchLower)) ||
        (documento_identidad &&
          documento_identidad.toLowerCase().includes(searchLower)) ||
        (area && area.toLowerCase().includes(searchLower)) ||
        (cargo && cargo.toLowerCase().includes(searchLower))
      );
    });
  }, [search, usuariosData]); // Solo se recalcula si 'search' o 'usuariosData' cambian

  const generarBoleta = (id) => {
    alert(`Generar boleta para empleado ${id}`);
  };

  // 5. CORREGIMOS LAS COLUMNAS (cell vs selector)
  const columns = [
    {
      name: "#",
      selector: (row) => row.id, // <-- CORREGIDO
      sortable: true,
      wrap: true,
      center: true,
      width: "60px",
    },
    {
      name: "Foto",
      selector: (row) => row.usuario?.fotoPerfil, // Selector para ordenar
      cell: (row) => (
        <div style={{ textAlign: "center", padding: "5px 0" }}>
          {row.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row?.usuario?.fotoPerfil}`}
              alt="Foto de perfil"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <span className="text-muted small">N/A</span>
          )}
        </div>
      ),
    },
    {
      name: "Nombres y Apellidos",
      selector: (row) => row.nombre_completo, // Selector para ordenar
      cell: (row) => (
        <div className="d-flex flex-column">
          <b>{row.nombre_completo}</b>
          <small>{row.documento_identidad}</small>
        </div>
      ),
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Asistencia",
      selector: (row) => row.dias_trabajados, // Selector para ordenar
      cell: (row) => (
        <div style={{ minWidth: 120 }}>
          <span>{row.dias_trabajados} Días</span>
          <div className="progress ms-2 w-100" style={{ height: 20 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${row.porcentaje_dias_trabajados}%`,
                background: "#da4444ff",
              }}
            ></div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Area",
      selector: (row) => row.area || "N/A", // <-- CORREGIDO
      sortable: true,
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo || "N/A", // <-- CORREGIDO
      sortable: true,
    },
    {
      name: "Tipo Contrato",
      selector: (row) => row.contrato || "N/A", // <-- CORREGIDO
      sortable: true,
    },
    {
      name: "Ultimo Pago",
      // CORREGIDO: snake_case de tu API
      selector: (row) => row.salario_neto || "N/A",
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            className="btn-editar me-1"
            onClick={() => {
              setModalPerfilEmpleado(true);
              setIdEmpleado(row.id);
            }}
            title="Ver información"
          >
            <Eye className="text-auto" />
          </button>
          <button
            className="btn-sm btn-principal d-flex justify-content-center align-items-center gap-1"
            onClick={() => generarBoleta(row.id)}
            title="Generar boleta de pago"
          >
            <span>Generar boleta</span>
          </button>
        </>
      ),
      minWidth: "180px",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Cargando />
      ) : (
        <>
          {/* 6. AHORA 'filteredUsuarios' es de useMemo y 'columns' está corregido */}
          <TablasGenerales columnas={columns} datos={filteredUsuarios} />
        </>
      )}

      <ModalRight
        isOpen={modalPerfilEmpleado}
        onClose={() => setModalPerfilEmpleado(false)}
        title="Perfil del empleado"
        width="70%"
      >
        <PerfilGeneralNomina idEmpleado={idEmpleado} />
      </ModalRight>
    </div>
  );
}
