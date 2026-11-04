import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import {
  BadgeCheck,
  CalendarCheck2,
  CircleAlert,
  CircleX,
  Clock1,
  CloudDownload,
  Eye,
  Layers2Icon,
} from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { ModalDetallesVentas } from "./ModalDetallesVentas";
import { BtnVer } from "../componentesReutilizables/BotonesAccion";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

export function ListVentas({ search, ventas }) {
  const [modalDetallesVenta, setModalDetallesVenta] = useState(false);
  const [dataVentas, setDataVentas] = useState([]);

  const listVentas = Array.isArray(ventas) ? ventas : [];
  // Estado para la lista filtrada
  const [filteredVentas, setFilteredVentas] = useState([]);

  // La búsqueda refina el período que ya recibió la tabla.
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
        <div className="flex">
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
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
            row.documento === "B"
              ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950"
              : row.documento === "F"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
          }`}
        >
          {row.documento === "B"
            ? "Boleta"
            : row.documento === "F"
              ? "Factura"
              : "Boleta Simple"}
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
      selector: (row) => row?.idMetodo,
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
            <span className="text-muted-foreground font-medium text-sm">
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
          <div className="flex items-center gap-3">
            <img
              // AHORA USAMOS foto_url DIRECTAMENTE
              src={
                usuario.foto_url
                  ? usuario.foto_url
                  : "/images/default-avatar.png"
              }
              alt="Perfil"
              className="size-8 shrink-0 rounded-full border border-border object-cover shadow-sm"
              onError={(e) => {
                if (!e.target.src.includes("default-avatar.png")) {
                  e.target.src = "/images/default-avatar.png";
                }
              }}
            />

            <div className="flex min-w-0 flex-col text-left">
              <span
                className="font-medium text-foreground truncate"
                title={usuario.email}
              >
                {usuario.email}
              </span>
              <small className="text-muted-foreground truncate">
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
        <span className="flex items-center gap-1">
          <CalendarCheck2 className="size-4 shrink-0 text-muted-foreground" />
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
      cell: (row) => {
        // 1. Si es Boleta Simple (Uso interno), NO va a SUNAT
        if (row.documento === "S") {
          return (
            <BadgeComponent
              label="Uso Interno"
              variant="secondary"
              icon={<Layers2Icon />} // O el ícono de lucide-react que prefieras (ej. FileText)
            />
          );
        }

        // 2. Extraemos el estado para Facturas o Boletas electrónicas
        const estado =
          row.documento === "B"
            ? row.boleta?.estado
            : row.documento === "F"
              ? row.factura?.estado
              : null;

        // 3. Validaciones exactas
        if (estado === 1) {
          return (
            <BadgeComponent
              label="Aceptado"
              variant="success"
              icon={<BadgeCheck />}
            />
          );
        }

        if (estado === 0) {
          return (
            <BadgeComponent
              label="Rechazado"
              variant="danger"
              icon={<CircleX />}
            />
          );
        }

        if (estado === 2 || estado === "2") {
          // Ajusta el '2' según cómo guardes la observación en BD
          return (
            <BadgeComponent
              label="Observaciones"
              variant="warning"
              icon={<CircleAlert />}
            />
          );
        }

        // 4. Si es B o F pero el estado es null/indefinido (aún no responde SUNAT o hubo error local)
        return (
          <BadgeComponent
            label="Pendiente"
            variant="dark" // O "info", dependiendo de tu componente
            icon={<Clock1 />}
          />
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
          <div className="flex items-center gap-2 p-2">
            {xmlUrl ? (
              <Button
                asChild
                size="sm"
                variant="ghostOutline"
                className="gap-1 px-2"
              >
                <a href={xmlUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="size-3.5" />
                  <span>XML</span>
                </a>
              </Button>
            ) : (
              <span className="text-muted-foreground text-sm">
                XML no disponible
              </span>
            )}

            {cdrUrl ? (
              <Button
                asChild
                size="sm"
                variant="ghostOutline"
                className="gap-1 px-2"
              >
                <a href={cdrUrl} target="_blank" rel="noopener noreferrer">
                  <CloudDownload className="size-3.5" />
                  <span>CDR</span>
                </a>
              </Button>
            ) : (
              <span className="text-muted-foreground text-sm">
                CDR no disponible
              </span>
            )}
          </div>
        );
      },
      center: true,
      grow: 1,
    },
  ];

  return (
    <Card className="min-w-0 border-0 bg-transparent p-0 shadow-none">
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
    </Card>
  );
}
