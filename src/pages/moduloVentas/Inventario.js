import { useCallback, useEffect, useState } from "react";
import { InventarioList } from "../../components/componenteInventario/InventarioList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GetInventario } from "../../service/GetInventario";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import {
  AlertCircleOutline,
  CashOutline,
  CodeSlashOutline,
  FileTrayStackedOutline,
  StorefrontOutline,
  TodayOutline,
} from "react-ionicons";

export function Inventario() {
  const [search, setSearch] = useState("");
  const [porVencer, setPorVencer] = useState("");
  const [stockTotal, setStockTotal] = useState("");
  const [valorTotal, setsetValorTotal] = useState("");
  const [productosConteo, setProductosConteo] = useState("");

  const calcularTotal = useCallback(async () => {
    const result = await GetInventario();
    if (result.success) {
      let sumaTotal = 0;
      let valorTotal = 0;
      let productPorVencer = 0;
      let inventario = result.data;
      const today = new Date(); // Fecha actual
      const oneMonthAhead = new Date(today);
      oneMonthAhead.setMonth(today.getMonth() + 1); // Fecha actual + 1 mes

      inventario.forEach((items) => {
        sumaTotal += items.stock;
        valorTotal += parseFloat(items.precio) * parseFloat(items.stock);
        const fechaVencimiento = new Date(items.fecha_vencimiento); // Fecha de vencimiento del producto

        // Verificar si el producto ya venció o si está cerca de vencer
        if (fechaVencimiento < today || fechaVencimiento <= oneMonthAhead) {
          productPorVencer += 1;
        }
      });
      let conteo = inventario.length;
      setProductosConteo(conteo);
      setPorVencer(productPorVencer);
      setStockTotal(sumaTotal);
      setsetValorTotal(valorTotal.toFixed(2));
      setHasError(true);
    }
  }, []);
  const { loading, error, execute } = useEstadoAsyn(calcularTotal);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);
  return (
    <div className="row g-3">
      <div className="col-lg-12">
        <div className="row g-3">
          <div className="col-sm-12 col-md-3 col-lg-3">
            <div className="card shadow-sm p-3">
              {loading ? (
                <Cargando />
              ) : error ? (
                <p>Error al cargar datos</p>
              ) : (
                <>
                  <div>
                    <span className="position-absolute opacity-50">
                      <StorefrontOutline
                        color={"#ea8d1c"}
                        width={"80px"}
                        height={"80px"}
                      />
                    </span>
                  </div>
                  <div className="text-end">
                    <h4 className="mb-1 text-dark">Productos</h4>
                    <p className="h1 mb-0">{productosConteo}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3">
            <div className="card shadow-sm p-3 d-flex flex-wrap">
              {loading ? (
                <Cargando />
              ) : error ? (
                <p>Error al cargar el stock</p>
              ) : (
                <>
                  <div>
                    <span className="position-absolute opacity-50">
                      <FileTrayStackedOutline
                        color={"#1c9fea"}
                        height="80px"
                        width={"80px"}
                        className="position-absolute text-dark"
                      />
                    </span>
                  </div>
                  <div className="text-end">
                    <h4 className="mb-1 text-dark">Stock Total</h4>
                    <p className="h1 mb-0">{stockTotal}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3">
            <div className="card shadow-sm p-3">
              {loading ? (
                <Cargando />
              ) : error ? (
                <p>Error al cargar datos</p>
              ) : (
                <>
                  <div>
                    <span className="position-absolute opacity-50">
                      <CashOutline
                        color={"#1eca74"}
                        width={"80px"}
                        height={"80px"}
                      />
                    </span>
                  </div>
                  <div className="text-end">
                    <h4 className="mb-1 text-dark">Valor Total</h4>
                    <p className="h1 mb-0">S/.{valorTotal}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3">
            <div className="card shadow-sm p-3">
              {loading ? (
                <Cargando />
              ) : error ? (
                <p>Error al cargar datos</p>
              ) : (
                <>
                  <div>
                    <span className="position-absolute opacity-50">
                      <AlertCircleOutline
                        color={"#ca1e1e"}
                        width={"80px"}
                        height={"80px"}
                      />
                    </span>
                  </div>
                  <div className="text-end">
                    <h4 className="mb-1 text-danger">Por Vencer</h4>
                    <p className="h1 mb-0">{porVencer}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="card shadow-sm">
          <div className="card-header p-0 border-bottom d-flex justify-content-between align-items-center">
            <div className="m-3">
              <h3 className="card-title mb-0 titulo-card-especial">
                Mi Inventario
              </h3>
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
              <button className="btn ms-2">
                <FontAwesomeIcon icon={faPlus} className="icon" />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <InventarioList search={search} />
          </div>
        </div>
      </div>
    </div>
  );
}
