import { useCallback, useEffect, useState } from "react";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";

import { GetKardex } from "../../service/GetKardex";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  FileText,
} from "lucide-react";

export function KardexList({ search }) {
  const [kardex, setKardex] = useState([]);
  const [filterKardexList, setFilterKardexList] = useState();

  const fetchKardex = useCallback(async () => {
    try {
      const response = await GetKardex();
      if (response.success) {
        setKardex(response.data);
        setFilterKardexList(response.data);
      } else {
        setHasError(true);
      }
    } catch (error) {}
  }, []);

  // CODIGO PARA BUSCAR KARDEX
  useEffect(() => {
    const searchLower = search.toLowerCase();

    const result = kardex.filter(
      ({
        id,
        tipo_movimiento,
        producto,
        descripcion,
        cantidad,
        stock_anterior,
        stock_actual,
        fecha_movimiento,
        documento,
      }) => {
        const tipo = tipo_movimiento.toLowerCase();
        const nombreProducto = producto?.nombre?.toLowerCase() || "";

        return [
          id,
          tipo,
          nombreProducto,
          descripcion,
          cantidad,
          stock_anterior,
          stock_actual,
          fecha_movimiento,
        ].some((value) =>
          value?.toString().toLowerCase().includes(searchLower),
        );
      },
    );

    setFilterKardexList(result);
  }, [search, kardex]);

  //  ===================

  const { loading, error, execute } = useEstadoAsyn(fetchKardex);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);

  const columns = [
    {
      name: "ID",
      grow: 0,
      selector: (row) => row.id,

      center: true,
    },
    {
      name: "Tipo",
      grow: 1,
      sortable: true,
      cell: (row) => {
        const isEntrada = row.tipo_movimiento.toLowerCase() === "entrada";

        return (
          <div className="d-flex align-items-center justify-content-center">
            {isEntrada ? (
              <span className="kardex-chip-tipo kardex-chip-tipo-entrada">
                <ArrowUpRight size={16} /> Entrada
              </span>
            ) : (
              <span className="kardex-chip-tipo kardex-chip-tipo-salida">
                <ArrowDownLeft size={16} /> Salida
              </span>
            )}
          </div>
        );
      },
      center: true,
    },
    {
      name: "Activo",
      grow: 1,
      selector: (row) => row.producto?.nombre,
      sortable: true,
    },
    {
      name: "Descripcion",
      grow: 1,
      selector: (row) => row.descripcion,
      sortable: true,
    },

    {
      name: "Cantidad",
      grow: 1,
      cell: (row) => {
        return (
          <p className="mb-0 fw-bold kardex-numeric-chip">{row.cantidad}</p>
        );
      },
      sortable: true,
      center: true,
    },

    {
      name: "Stock anterior",
      grow: 1,
      cell: (row) => {
        return (
          <p className="mb-0 fw-bold kardex-numeric-chip">
            {row.stock_anterior}
          </p>
        );
      },
      center: true,
      sortable: true,
    },
    {
      name: "Stock Actual",
      grow: 1,
      cell: (row) => {
        return (
          <p className="mb-0 fw-bold kardex-numeric-chip">{row.stock_actual}</p>
        );
      },
      center: true,
      sortable: true,
    },
    {
      name: "Fecha",
      grow: 1,
      cell: (row) => {
        return (
          <div className="w-100 d-flex align-items-center justify-content-center kardex-fecha-cell">
            <CalendarDays size={16} />
            <p className="mx-1 mb-0">{row.fecha_movimiento}</p>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Detalles",
      grow: 1,
      cell: (row) => {
        return (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <a
              href={row.kardex_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ver kardex-detalle-btn"
              title="Ver detalle del documento"
            >
              <FileText size={16} />
            </a>
          </div>
        );
      },
      sortable: true,
      center: true,
    },
  ];
  return (
    <div className="">
      {loading && <Cargando />}
      {error && <div className="error">{error}</div>}
      <TablasGenerales datos={filterKardexList} columnas={columns} />
    </div>
  );
}
