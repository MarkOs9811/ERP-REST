import { useQuery } from "@tanstack/react-query";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { GetClientesLista } from "../../service/accionesClientes/GetClientes";
import { useState, useMemo } from "react";
import "../../css/estilosClientes/EstilosTablasClientes.css";
import { obtenerTiempoRelativo } from "../../utils/formatoFechas";

// 2. Micro-componente Avatar
const UserAvatar = ({ foto, nombre }) => {
  const [imgError, setImgError] = useState(false);
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "C";

  if (foto && !imgError) {
    return (
      <img
        src={foto}
        alt={`Avatar`}
        className="rounded-circle flex-shrink-0"
        style={{ width: "36px", height: "36px", objectFit: "cover" }}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="bg-fw-saffron-soft text-fw-saffron rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
      style={{ width: "36px", height: "36px", fontSize: "14px" }}
    >
      {inicial}
    </div>
  );
};

export function ListaClientes({ busqueda = "", filtros = {} }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const {
    data: respuestaPaginada,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clientes", paginaActual],
    queryFn: () => GetClientesLista(paginaActual),
    keepPreviousData: true,
  });

  const clientes = respuestaPaginada?.data || [];
  const meta = respuestaPaginada?.meta || {};

  // Función para normalizar texto (sin acentos, minúsculas)
  const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Función para convertir fecha a objeto Date
  const parsearFecha = (fechaString) => {
    if (!fechaString) return null;
    return new Date(fechaString);
  };

  // Filtrar clientes según búsqueda y filtros de fecha
  const clientesFiltrados = useMemo(() => {
    if (clientes.length === 0) return [];

    return clientes.filter((cliente) => {
      // Filtro por búsqueda (nombre, correo, teléfono)
      if (busqueda.trim()) {
        const busquedaNormalizada = normalizarTexto(busqueda);
        const nombre = normalizarTexto(
          cliente.persona?.nombre + " " + cliente.persona?.apellidos,
        );
        const correo = normalizarTexto(cliente.persona?.correo);
        const telefono = normalizarTexto(cliente.persona?.telefono);

        const coincideBusqueda =
          nombre.includes(busquedaNormalizada) ||
          correo.includes(busquedaNormalizada) ||
          telefono.includes(busquedaNormalizada);

        if (!coincideBusqueda) return false;
      }

      // Filtro por rango de fechas de última compra
      if (filtros.fechaDesde || filtros.fechaHasta) {
        let fechaVenta = null;

        if (cliente.ultima_venta) {
          fechaVenta = cliente.ultima_venta.created_at;
        } else if (cliente.ventas?.length > 0) {
          fechaVenta = cliente.ventas[cliente.ventas.length - 1].created_at;
        }

        if (fechaVenta) {
          const fecha = parsearFecha(fechaVenta);

          if (filtros.fechaDesde) {
            const desde = parsearFecha(filtros.fechaDesde);
            if (fecha < desde) return false;
          }

          if (filtros.fechaHasta) {
            const hasta = parsearFecha(filtros.fechaHasta);
            // Incluir el día completo
            hasta.setHours(23, 59, 59, 999);
            if (fecha > hasta) return false;
          }
        } else if (filtros.fechaDesde || filtros.fechaHasta) {
          // Si hay filtro de fecha pero no hay fecha de compra, excluir
          return false;
        }
      }

      return true;
    });
  }, [clientes, busqueda, filtros]);

  const columnasClientes = [
    {
      name: "NOMBRE",
      selector: (row) => (
        <div className="fw-cell-nombre">
          <div className="m-2">
            <UserAvatar foto={row.persona.foto} nombre={row.nombre} />
          </div>
          <span className="fw-nombre-texto">
            {row.persona?.nombre + " " + row.persona?.apellidos || "Sin Nombre"}
          </span>
        </div>
      ),
    },
    {
      name: "INFORMACIÓN",
      selector: (row) => (
        <div className="fw-cell-info">
          <span className="fw-email">
            {row.persona?.correo || "Sin correo"}
          </span>
          <span className="fw-telefono">
            {row.persona?.telefono || "Sin teléfono"}
          </span>
        </div>
      ),
    },
    {
      name: "ÚLTIMA COMPRA",
      selector: (row) => {
        let fechaVenta = null;

        if (row.ultima_venta) {
          fechaVenta = row.ultima_venta.created_at;
        } else if (row.ventas?.length > 0) {
          fechaVenta = row.ventas[row.ventas.length - 1].created_at;
        }

        const textoFecha = obtenerTiempoRelativo(fechaVenta, "Sin compras");

        return (
          <div className="fw-cell-compra">
            <i className="icon-calendar"></i>
            <span>{textoFecha}</span>
          </div>
        );
      },
    },
  ];

  const manejarCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  if (isError) return <div className="fw-error">Error al cargar clientes.</div>;

  return (
    <div>
      {busqueda || filtros.fechaDesde || filtros.fechaHasta ? (
        <div className="alert alert-info small mb-3" role="alert">
          Se encontraron <strong>{clientesFiltrados.length}</strong> cliente(s)
          que coinciden con tu búsqueda
        </div>
      ) : null}
      <TablasGenerales
        columnas={columnasClientes}
        datos={clientesFiltrados}
        cargando={isLoading}
        // Pasamos propiedades de paginación a tu componente reutilizable
        paginacion={{
          paginaActual: meta.current_page || 1,
          totalPaginas: meta.last_page || 1,
          totalRegistros: clientesFiltrados.length,
          alCambiarPagina: manejarCambioPagina,
        }}
      />
    </div>
  );
}
