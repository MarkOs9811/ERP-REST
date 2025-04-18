import { useEffect, useState } from "react";
import { KardexList } from "../../components/componentesKardex/KardexList";
import { useCallback } from "react";
import { GetKardex } from "../../service/GetKardex";
import {
  ArrowDownOutline,
  ArrowUpOutline,
  DocumentTextOutline,
} from "react-ionicons";

export function Kardex() {
  const [search, setSearch] = useState("");

  const [entradas, setEntradas] = useState(0);
  const [salidas, setSalidas] = useState(0);

  const listaKardex = useCallback(async () => {
    try {
      const response = await GetKardex();
      if (response.success) {
        const data = response.data;

        const totalEntradas = data.filter(
          (item) => item.tipo_movimiento == "entrada"
        ).length;

        const totalSalidas = data.filter(
          (item) => item.tipo_movimiento == "salida"
        ).length;

        setEntradas(totalEntradas);
        setSalidas(totalSalidas);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error al obtener el kardex:", error);
    }
  }, []);
  useEffect(() => {
    listaKardex();
  }, [listaKardex]);

  return (
    <div className="contianer-flui w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="row g-2">
            <div className="col-sm-12 col-md-6">
              <div className="card h-100 shadow-sm d-flex flex-row align-items-center justify-content-between p-3">
                <div
                  className="rounded-pill d-flex align-items-center justify-content-center p-3"
                  style={{
                    backgroundColor: "#B3E5FC",
                    width: "auto",
                    height: "50px",
                  }}
                >
                  <ArrowUpOutline
                    color="#0288D1"
                    height="50px"
                    width="50px"
                    style={{ transform: "rotate(45deg)" }}
                  />
                </div>
                <p
                  className="mb-0 ms-2 text-center h3"
                  style={{ color: "#0288D1" }}
                >
                  Entradas
                </p>

                <div className="d-flex align-items-center">
                  <p className="mx-4 h1"> {entradas}</p>
                  <button className="btn btn-sm">
                    <DocumentTextOutline
                      color="#0288D1"
                      width="24px"
                      height="24px"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6">
              <div className="card h-100 shadow-sm d-flex flex-row align-items-center justify-content-between p-3">
                {/* Ícono y texto de Salidas */}
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-pill d-flex align-items-center justify-content-center p-3"
                    style={{
                      backgroundColor: "#FFCDD2",
                      minWidth: "auto",
                      height: "50px",
                    }}
                  >
                    <ArrowDownOutline
                      color="#D32F2F"
                      height="50px"
                      width="50px"
                      style={{ transform: "rotate(45deg)" }}
                    />
                  </div>
                </div>
                <p
                  className="mb-0 ms-2 text-center h3"
                  style={{ color: "#7a5151" }}
                >
                  Salidas
                </p>

                {/* Número de Salidas y Botón */}
                <div className="d-flex align-items-center">
                  <p className="mx-4 h1 mb-0">{salidas}</p>
                  <button className="btn btn-sm">
                    <DocumentTextOutline
                      color="#D32F2F"
                      width="24px"
                      height="24px"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card shadow-sm">
                <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                  <div className="">
                    <h5> Kardex</h5>
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
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <KardexList search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
