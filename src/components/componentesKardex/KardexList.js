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
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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
          value?.toString().toLowerCase().includes(searchLower)
        );
      }
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
          <div
            className="d-flex align-items-center justify-content-center rounded-pill px-2"
            style={{
              backgroundColor: isEntrada ? "#B3E5FC" : "#FFCDD2", // Azul bebé o rojo suave
              width: "auto",
              height: "30px",
            }}
          >
            {isEntrada ? (
              <>
                <ArrowUpRight color="#0288D1" height="30px" width="30px" />
                <p className="d-flex center text-center m-auto text-muted">
                  Entrada
                </p>
              </>
            ) : (
              <>
                <ArrowDownLeft color="#D32F2F" height="30px" width="30px" />
                <p className="d-flex center text-center m-auto text-muted">
                  Salida
                </p>
              </>
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
          <div
            className=" w-auto  d-flex align-items-center justify-content-center"
            style={{
              color: "auto",
            }}
          >
            <p className="mx-1 mb-0 fw-bold h6">{row.cantidad}</p>
          </div>
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
          <div
            className="w-auto  d-flex align-items-center justify-content-center"
            style={{
              color: "auto",
            }}
          >
            <p className="mx-1 mb-0 fw-bold h6">{row.stock_anterior}</p>
          </div>
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
          <div
            className="w-auto  d-flex align-items-center justify-content-center"
            style={{
              color: "auto",
            }}
          >
            <p className="mx-1 mb-0 fw-bold h6">{row.stock_actual}</p>
          </div>
        );
      },
      center: true,
      sortable: true,
    },
    {
      name: "Fecha",
      grow: 1,
      selector: (row) => {
        return (
          <div
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ textAlign: "center" }}
          >
            <CalendarDays color={"auto"} width="20px" height="20px" />
            <p className="mx-1 mb-0">{row.fecha_movimiento}</p>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Detalles",
      grow: 1,
      selector: (row) => {
        return (
          <div
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ textAlign: "center" }}
          >
            <a
              href={`${BASE_URL}/${row.documento}`}
              target="_blank"
              rel="noopener noreferrer"
              className=" btn mx-2 mb-0"
            >
              <FileText color={"#1591c6"} width="30px" height="30px" />
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
