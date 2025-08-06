import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";

import { Cargando } from "../componentesReutilizables/Cargando";

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import {
  BadgeCheck,
  CalendarCheck2,
  CircleAlert,
  CircleX,
  CloudDownload,
  Eye,
} from "lucide-react";

export function ListVentas({ search }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // React Query: obtener ventas con `useQuery`
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  console.log(listVentas);
  // Estado para la lista filtrada
  const [filteredVentas, setFilteredVentas] = useState([]);

  // Filtrado cuando cambia `search` o `listVentas`
  useEffect(() => {
    if (!search) {
      setFilteredVentas(listVentas);
      return;
    }

    const searchLower = search.toLowerCase();
    const result = listVentas.filter((venta) => {
      const { id, documento, total, metodoPago, user, fechaVenta } = venta;
      return [
        id && String(id),
        documento === "B" ? "Boleta" : documento === "F" ? "Factura" : "Otro",
        total && `S/. ${total.toFixed(2)}`,
        metodoPago?.nombre,
        user?.email,
        fechaVenta,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchLower));
    });

    setFilteredVentas(result);
  }, [search, listVentas]);

  const handleDescargarComprobante = (id) => {
    const url = `${BASE_URL}/storage/comprobantes/${id}.pdf`;
    window.open(url, "_blank");
  };

  const handleDetallesVenta = (id) => {
    console.log("Detalles de la venta con ID:", id);
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      center: true,
      grow: 0,
    },
    {
      name: "Detalles",
      cell: (row) => (
        <div className="d-flex ">
          {/* Botón para ver detalles */}
          <button
            className="btn-editar align-items-center "
            onClick={() => handleDetallesVenta(row.id)}
            title="Detalles"
          >
            <Eye height="16px" width="16px" className="text-auto" />
          </button>
          {/* Botón para descargar comprobante PDF */}
        </div>
      ),
      center: true,
      grow: 0,
    },
    {
      name: "Comprobante",
      selector: (row) => (
        <span
          className={`badge ${
            row.documento === "B"
              ? "bg-success"
              : row.documento === "F"
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {row.documento === "B"
            ? "Boleta"
            : row.documento === "F"
            ? "Factura"
            : "Otro"}
        </span>
      ),
      sortable: true,
      center: true,
      grow: 0,
    },
    {
      name: "Total",
      selector: (row) => `S/. ${parseFloat(row.total).toFixed(2)}`,
      sortable: true,
      center: true,
      grow: 0,
    },
    {
      name: "Metodo",
      selector: (row) => row.metodo_pago?.nombre,
      sortable: true,
      grow: 1,
    },
    {
      name: "Vendedor",
      selector: (row) => (
        <span className="d-flex align-items-center gap-2">
          <img
            src={`${BASE_URL}/storage/${row.usuario?.fotoPerfil}`}
            alt="Foto de perfil"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "2px solid silver",
            }}
          />
          <div className="d-flex flex-column">
            <span>{row.usuario?.email}</span>
            <small className="text-muted">
              {capitalizeFirstLetter(
                row.usuario?.empleado?.persona?.nombre.toLowerCase()
              )}{" "}
              {capitalizeFirstLetter(
                row.usuario?.empleado?.persona?.apellidos.toLowerCase()
              )}
            </small>
          </div>
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => (
        <span className="d-flex align-items-center gap-1">
          <CalendarCheck2 className="text-auto" height="16px" width="16px" />
          {new Intl.DateTimeFormat("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(row.created_at))}
        </span>
      ),
      sortable: true,
      center: true,
      grow: 1,
    },

    {
      name: "Estado SUNAT",
      selector: (row) => {
        const estado =
          row.documento === "B"
            ? row.boleta?.estado
            : row.documento === "F"
            ? row.factura?.estado
            : null;

        let icon = null;
        let text = "";

        if (estado === 1) {
          icon = <BadgeCheck className="text-auto" />;
          text = "Aceptado";
        } else if (estado === 0) {
          icon = <CircleX className="text-auto" />;
          text = "Rechazado";
        } else {
          icon = <CircleAlert className="text-auto" />;
          text = "Aceptado con Observaciones";
        }

        return (
          <span
            className={`badge rounded-pill d-flex align-items-center justify-content-center ${
              estado === 1
                ? "badge-ok"
                : estado === 0
                ? "badge-fail"
                : "badge-alert"
            }`}
          >
            {icon}
            {text}
          </span>
        );
      },
      sortable: true,
      right: true,
      grow: 1,
    },

    {
      name: "Descargas",
      cell: (row) => {
        const rutaXml =
          row.documento === "B"
            ? row.boleta?.rutaXml
            : row.documento === "F"
            ? row.factura?.rutaXml
            : null;

        const rutaCdr =
          row.documento === "B"
            ? row.boleta?.rutaCdr
            : row.documento === "F"
            ? row.factura?.rutaCdr
            : null;

        return (
          <div className="d-flex align-items-center gap-2 p-2">
            {rutaXml ? (
              <a
                href={`${BASE_URL}/storage/${rutaXml}`}
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CloudDownload className="text-auto" /> XML
              </a>
            ) : (
              <span className="text-muted small">XML no disponible</span>
            )}
            {rutaCdr ? (
              <a
                href={`${BASE_URL}/storage/${rutaCdr}`}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CloudDownload className="text-auto" /> CDR
              </a>
            ) : (
              <span className="text-muted small">CDR no disponible</span>
            )}
          </div>
        );
      },
      center: true,
      grow: 1,
    },
  ];

  return (
    <div className="card">
      {isLoading && <Cargando />}
      {isError && <div className="error">Error al cargar ventas</div>}
      <TablasGenerales columnas={columns} datos={filteredVentas} />
    </div>
  );
}
