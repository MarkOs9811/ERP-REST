import { useQuery } from "@tanstack/react-query";
import { GetNomina } from "../../service/accionesPlanilla/GetNomina";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import { PerfilGeneralNomina } from "./PerfilGeneralNomina";

export function NominaUsuarios({ search = "", updateList }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalPerfilEmpleado, setModalPerfilEmpleado] = useState(false);
  const [idEmpleado, setIdEmpleado] = useState(null);
  console.log("ide del empelado", idEmpleado);
  const {
    data: usuariosData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["nomina", updateList],
    queryFn: GetNomina,
    retry: 1,
  });
  console.log("Usuarios Data:", usuariosData);

  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  useEffect(() => {
    const result = usuariosData.filter((usuario) => {
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
    setFilteredUsuarios(result);
  }, [search, usuariosData]);

  const getEditEmpleado = (id) => {
    // Lógica para editar empleado
    alert(`Editar empleado ${id}`);
  };
  const generarBoleta = (id) => {
    // Lógica para generar boleta
    alert(`Generar boleta para empleado ${id}`);
  };

  // Columnas para TablaGeneral
  const columns = [
    {
      name: "#",
      cell: (row) => <b>{row.id}</b>,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Foto",
      selector: (row) => row.usuario?.fotoPerfil || "No disponible",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {row.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row?.usuario?.fotoPerfil}`} // Aquí colocas la URL completa a la imagen (puede ser en 'public')
              alt="Foto de perfil"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }} // Ajusta el tamaño y el estilo
            />
          ) : (
            <span>No disponible</span> // Si no hay foto, muestra este texto
          )}
        </div>
      ),
    },
    {
      name: "Nombres y Apellidos",
      cell: (row) => (
        <div className="d-flex flex-column">
          <b>{row.nombre_completo}</b>
          <small>{row.documento_identidad}</small>
        </div>
      ),
    },
    {
      name: "Asistencia",
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
    },
    {
      name: "Area",
      cell: (row) => <span>{row.area || "N/A"}</span>,
    },
    {
      name: "Cargo",
      cell: (row) => <span>{row.cargo || "N/A"}</span>,
    },
    {
      name: "Tipo Contrato",
      cell: (row) => <span>{row.contrato || "N/A"}</span>,
    },
    {
      name: "Ultimo Pago",
      cell: (row) => <span>{row.salarioNeto || "N/A"}</span>,
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
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Cargando />
      ) : (
        <>
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
