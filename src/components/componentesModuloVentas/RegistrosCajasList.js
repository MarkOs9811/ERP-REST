import { useEffect, useState } from "react";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { useQuery } from "@tanstack/react-query";
import { GetRegistrosCajas } from "../../service/accionesVentas/GetRegistrosCajas";

export function RegistrosCajasList({ search }) {
  const [registrosCajasFilter, setRegistrosCajasFilter] = useState([]);

  const {
    data: registrosCajasData = [],
    isLoading: loadingRegistrosCajas,
    error: errorRegistrosCajas,
  } = useQuery({
    queryKey: ["registrosCajas"],
    queryFn: GetRegistrosCajas,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (!registrosCajasData) return;
    const searchLower = search?.toLowerCase() || "";
    const resultado = registrosCajasData.filter((items) => {
      const { usuario, caja, fechaApertura } = items;
      const usuarioNombreCompleto = `${
        usuario?.empleado?.persona?.nombre || ""
      } ${usuario?.empleado?.persona?.apellidos || ""}`.toLowerCase();

      const cajaNombre = caja?.nombreCaja?.toLowerCase() || "";
      // Convierte la fecha a string y también busca por año, mes o día
      const fechaAperturaStr = fechaApertura
        ? fechaApertura.toString().toLowerCase()
        : "";

      return (
        usuarioNombreCompleto.includes(searchLower) ||
        cajaNombre.includes(searchLower) ||
        fechaAperturaStr.includes(searchLower)
      );
    });

    setRegistrosCajasFilter(resultado);
  }, [search, registrosCajasData]);

  const column = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Estado",
      cell: (row) => {
        const abierta = row.fechaCierre === null && row.horaCierre === null;
        return (
          <span
            style={{
              backgroundColor: abierta ? "#d1fae5" : "#f3f4f6", // verde suave si abierta, gris claro si cerrada
              color: abierta ? "#065f46" : "#374151", // verde oscuro / gris oscuro
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "12px",
              display: "inline-block",
              textTransform: "capitalize",
            }}
          >
            {abierta ? "En venta" : "Cerrada"}
          </span>
        );
      },
    },
    {
      name: "Usuario",
      selector: (row) =>
        `${row.usuario?.empleado?.persona?.nombre || ""} ${
          row.usuario?.empleado?.persona?.apellidos || ""
        }`,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Caja",
      selector: (row) => row.caja?.nombreCaja || "",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Inicial",
      selector: (row) => "S/." + (row.montoInicial ?? ""),
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Final",
      selector: (row) => "S/." + (row.montoFinal ?? ""),
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Dejado",
      selector: (row) => "S/." + (row.montoDejado ?? ""),
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha Apertura",
      selector: (row) => row.fechaApertura ?? "",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Hora Apertura",
      selector: (row) => row.horaApertura ?? "",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha Cierre",
      selector: (row) => row.fechaCierre ?? "",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Hora Cierre",
      selector: (row) => row.horaCierre ?? "",
      sortable: true,
      wrap: true,
      center: true,
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.fechaCierre === null && row.horaCierre === null,
      style: {
        color: "#065f46",
        fontWeight: "bold",
      },
    },
    {
      when: (row) => row.fechaCierre !== null && row.horaCierre !== null,
      style: {
        backgroundColor: "#f9fafb", // gris claro
        color: "#374151",
      },
    },
  ];
  return (
    <div>
      <TablasGenerales
        datos={registrosCajasFilter}
        columnas={column}
        conditionalRowStyles={conditionalRowStyles}
      />
      {loadingRegistrosCajas && <div>Cargando registros...</div>}
      {errorRegistrosCajas && <div>Error al cargar registros</div>}
    </div>
  );
}
