import { useQuery } from "@tanstack/react-query";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetPlanillaCargo } from "../../service/GetTrabajadorCargo";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import { useParams, useSearchParams } from "react-router-dom";
import { wrap } from "framer-motion";
import { DocumentTextOutline, EyeOutline } from "react-ionicons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export function ListaTrabajador() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [search, setSearch] = useState("");
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados
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
      selector: (row) => row.usuario?.fotoPerfil || "No disponible",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          {row.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row.usuario.fotoPerfil}`}
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
              <i className="bi bi-person fs-4 text-muted"></i>
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
          <div className="text-muted small">{row.documento_identidad}</div>
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
          <small className="text-muted">
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
        <span className="fw-bold">
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
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-light"
            onClick={() => handleVerDetalles(row.id)}
            title="Ver detalles"
          >
            <EyeOutline color={"#333"} height="20px" width="20px" />
          </button>

          <button
            className="btn btn-sm btn-light"
            onClick={() => handleGenerarBoleta(row.id)}
            title="Generar boleta"
          >
            <DocumentTextOutline color={"#333"} height="20px" width="20px" />
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <ContenedorPrincipal>
      <div className="card shadow-sm h-100 m-0 p-0">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <div className="m-2">
            <h4 className="card-title mb-0 titulo-card-especial">Planilla</h4>
            <h6>
              {listaTrabajador?.length > 0
                ? `${listaTrabajador[0].cargo}`
                : `${idCargo ? `(Cargo ID: ${idCargo})` : ""}`}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn ms-2">
                <FontAwesomeIcon icon={faPlus} className="icon" />
              </button>
            </div>
          </div>
        </div>
        {isLoading && <p>Cargando Trabajador...</p>}
        {isError && <p>Error al cargar los Trabajador.</p>}
        <div className="card-body p-0">
          <DataTable
            className="tablaGeneral"
            columns={columns}
            data={listaTrabajador}
            pagination
            responsive
            dense
            fixedHeader
            customStyles={customDataTableStyles}
            fixedHeaderScrollHeight="100vh"
            striped={true}
            conditionalRowStyles={conditionalRowStyles}
            //selectableRows={true} //con este se activa un check  porc ada fila selccionble
            //selectableRowsHighlight={true} //resaltar la fila selecionada

            // onRowClicked={(row) => console.log(row)} para ejecutar cuandos e hace click en cada fila
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página:",
              rangeSeparatorText: "de",
              selectAllRowsItem: true,
              selectAllRowsItemText: "Todos",
            }}
          />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
