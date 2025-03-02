import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";

export function RegistroCajas({ search }) {
  const [registrosCajas, setRegistrosCajas] = useState([]);
  const [registrosCajasFilter, setRegistrosCajasFilter] = useState([]);
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados

  // para poner colores random a la tabla borde
  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: (row) => {
        const index = row.id % rowColors.length; // Alterna colores según el ID
        return {
          borderLeftColor: rowColors[index],
        };
      },
    },
  ];
  const fetchRegistrosCajas = async () => {
    try {
      const response = await axiosInstance.get("/registrosCajas");
      if (response.data.success) {
        setRegistrosCajasFilter(response.data.data);
        setRegistrosCajas(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const resultado = registrosCajas.filter((items) => {
      const { usuario, caja } = items;
      const searchLower = search?.toLowerCase();

      const usuarioNombreCompleto = `${
        usuario?.empleado?.persona?.nombre || ""
      } ${usuario?.empleado?.persona?.apellidos || ""}`.toLowerCase();

      const cajaNombre = caja?.nombreCaja?.toLowerCase() || "";

      return (
        usuarioNombreCompleto.includes(searchLower) ||
        cajaNombre.includes(searchLower)
      );
    });

    setRegistrosCajasFilter(resultado);
  }, [search, registrosCajas]);

  useEffect(() => {
    fetchRegistrosCajas();
  }, []);

  const column = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Usuario",
      selector: (row) =>
        row.usuario?.empleado?.persona?.nombre +
        " " +
        row.usuario?.empleado?.persona?.apellidos,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Caja",
      selector: (row) => row.caja.nombreCaja,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Inicial",
      selector: (row) => "S/." + row.montoInicial,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Final",
      selector: (row) => "S/." + row.montoFinal,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Monto Dejado",
      selector: (row) => "S/." + row.montoDejado,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha Apertura",
      selector: (row) => row.fechaApertura,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Hora Apertura",
      selector: (row) => row.horaApertura,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha Cierre",
      selector: (row) => row.fechaCierre,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "hora Cierre",
      selector: (row) => row.horaCierre,
      sortable: true,
      wrap: true,
      center: true,
    },
  ];
  return (
    <div>
      <DataTable
        className="tablaGeneral"
        columns={column}
        data={registrosCajasFilter || []}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        conditionalRowStyles={conditionalRowStyles}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />
    </div>
  );
}
