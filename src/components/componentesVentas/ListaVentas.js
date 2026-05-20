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
import ModalRight from "../componentesReutilizables/ModalRight";
import { ModalDetallesVentas } from "./ModalDetallesVentas";
import { BtnVer } from "../componentesReutilizables/BotonesAccion";

export function ListVentas({ search }) {
  const [modalDetallesVenta, setModalDetallesVenta] = useState(false);
  const [dataVentas, setDataVentas] = useState([]);

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
    const formatToDMY = (isoDate) => {
      if (!isoDate) return "";
      const [year, month, day] = isoDate.split("-");
      const shortYear = year.slice(2);
      return `${parseInt(day)}/${parseInt(month)}/${shortYear}`;
    };

    if (!search) {
      setFilteredVentas(listVentas);
      return;
    }

    const searchLower = search.toLowerCase();

    const result = listVentas.filter((venta) => {
      const {
        id,
        documento,
        total,
        metodo_pago: metodoPago,
        usuario: user,
        fechaVenta,
      } = venta;

      const camposAFiltrar = [
        id !== undefined ? String(id) : "",
        documento === "B" ? "Boleta" : documento === "F" ? "Factura" : "Otro",
        !isNaN(Number(total)) ? `S/. ${Number(total).toFixed(2)}` : "",
        metodoPago?.nombre || "",
        user?.email || "",
        fechaVenta || "", // formato ISO
        formatToDMY(fechaVenta) || "", // formato dd/mm/yy
      ];

      return camposAFiltrar.some((campo) =>
        String(campo).toLowerCase().includes(searchLower),
      );
    });

    setFilteredVentas(result);
  }, [search, listVentas]);

  // const handleDescargarComprobante = (id) => {
  //   const url = `${BASE_URL}/storage/comprobantes/${id}.pdf`;
  //   window.open(url, "_blank");
  // };

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
          <BtnVer
            onClick={() => {
              setDataVentas(row);
              setModalDetallesVenta(true);
            }}
            title="Ver Detalles de Venta"
          />
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
      selector: (row) => {
        const usuario = row.usuario;

        // Caso 1: Venta por web
        if (!usuario?.email) {
          return (
            <span className="text-muted fw-medium small">
              Se vendió por web
            </span>
          );
        }

        const persona = usuario.empleado?.persona;

        const nombre = persona?.nombre
          ? capitalizeFirstLetter(persona.nombre.toLowerCase())
          : "";

        const apellidos = persona?.apellidos
          ? capitalizeFirstLetter(persona.apellidos.toLowerCase())
          : "";

        return (
          <div className="d-flex align-items-center gap-3">
            <img
              // AHORA USAMOS foto_url DIRECTAMENTE
              src={
                usuario.foto_url
                  ? usuario.foto_url
                  : "/images/default-avatar.png"
              }
              alt="Perfil"
              className="rounded-circle shadow-sm"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "cover",
                border: "1px solid #e2e8f0",
              }}
              onError={(e) => {
                if (!e.target.src.includes("default-avatar.png")) {
                  e.target.src = "/images/default-avatar.png";
                }
              }}
            />

            <div
              className="d-flex flex-column text-start"
              style={{ minWidth: 0 }}
            >
              <span
                className="fw-medium text-dark text-truncate"
                title={usuario.email}
              >
                {usuario.email}
              </span>
              <small className="text-muted text-truncate">
                {`${nombre} ${apellidos}`.trim() || "Usuario sin nombre"}
              </small>
            </div>
          </div>
        );
      },
      sortable: true,
      center: false, // Cambiado a false (o elimínalo) para alinear a la izquierda y mejorar la lectura del diseño
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
        // Extraemos las URLs virtuales en lugar de las rutas cortas
        const xmlUrl =
          row.documento === "B"
            ? row.boleta?.xml_url
            : row.documento === "F"
              ? row.factura?.xml_url
              : null;

        const cdrUrl =
          row.documento === "B"
            ? row.boleta?.cdr_url
            : row.documento === "F"
              ? row.factura?.cdr_url
              : null;

        return (
          <div className="d-flex align-items-center gap-2 p-2">
            {xmlUrl ? (
              <a
                href={xmlUrl} // <-- Usamos el enlace limpio de Cloudflare
                className="btn-ver d-flex align-items-center gap-1 btn-sm"
                target="_blank" // Agregado para que abra en nueva pestaña
                rel="noopener noreferrer"
              >
                <Eye className="text-auto" size={15} />{" "}
                <span className="small">XML</span>{" "}
                {/* Corregí el typo 'spam' a 'span' 😉 */}
              </a>
            ) : (
              <span className="text-muted small">XML no disponible</span>
            )}

            {cdrUrl ? (
              <a
                href={cdrUrl} // <-- Usamos el enlace limpio de Cloudflare
                className="btn-ver d-flex align-items-center gap-1 btn-sm"
                target="_blank" // Agregado para que abra en nueva pestaña
                rel="noopener noreferrer"
              >
                <CloudDownload className="text-auto" size={15} />{" "}
                <span className="small"> CDR</span>
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
    <div className="card shadow-none border-0">
      {isLoading && <Cargando />}
      {isError && <div className="error">Error al cargar ventas</div>}
      <TablasGenerales columnas={columns} datos={filteredVentas} />

      <ModalRight
        isOpen={modalDetallesVenta}
        onClose={() => setModalDetallesVenta(false)}
        title="Detalles de la Venta"
        submitText="Imprimir"
        cancelText="Cerrar"
        hideFooter={true}
      >
        <ModalDetallesVentas dataVentas={dataVentas} />
      </ModalRight>
    </div>
  );
}
