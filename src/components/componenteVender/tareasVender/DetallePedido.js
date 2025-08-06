
import { CircleChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function DetallePedido({
  preVentas,
  estadoTipoVenta,
  totalPreventa,
  mesa,
  igv,
}) {
  const navigate = useNavigate();

  const handleVolverPreVenta = () => {
    navigate(`/vender/ventasMesas/preVenta`);
  };
  const handleVolverLlevar = () => {
    navigate(`/vender/ventasLlevar`);
  };
  const handleVolverPedidoWeb = () => {
    navigate(`/vender/pedidosWeb`);
  };
  return (
    <div className="card p-3 shadow-sm" style={{ height: "100%" }}>
      <div className="card-header d-flex align-items-center justify-content-cente">
        <button
          className="btn btn-outline-dark me-auto"
          onClick={() =>
            estadoTipoVenta === "llevar"
              ? handleVolverLlevar()
              : estadoTipoVenta === "web"
              ? handleVolverPedidoWeb()
              : handleVolverPreVenta()
          }
        >
          <CircleChevronLeft color={"auto"} />
          Volver
        </button>
        <h4 className="text-center text-auto align-middle mx-3">Cuenta </h4>
        <h6 className="text-center fw-bold align-middle h4 text-success">
          {estadoTipoVenta === "llevar"
            ? "Llevar"
            : mesa
            ? `Mesa ${mesa}`
            : "Web Pedido"}
        </h6>
      </div>

      {preVentas.length > 0 ? (
        <>
          <div className="tabla-scroll rounded p-3 ">
            <table className=" table-borderless table-sm w-100">
              <tbody>
                {preVentas.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="plato-row">
                    <td className="d-flex justify-content-between align-items-center px-2">
                      <div>
                        <span className="d-block fw-bold">
                          {item.plato?.nombre || item.nombre}
                        </span>
                        <small>
                          {item.cantidad} x S/.{" "}
                          {Number(item.plato?.precio || item.precio).toFixed(2)}
                        </small>
                      </div>
                    </td>
                    <td className="text-right align-middle">
                      <span>
                        S/.{" "}
                        {Number(
                          item.cantidad * (item.plato?.precio || item.precio)
                        ).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Total */}
          <div className=" pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="h5">Total</span>
              <span className="h5 fw-bold text-success">
                S/. {totalPreventa}
              </span>
            </div>
            <small className="text-muted d-block text-end">
              IGV: S/. {igv}
            </small>
          </div>
          {/* Puntos de lealtad */}
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <div className="bg-light rounded p-2 text-center flex-fill mr-2">
                <small>Total de Platos</small>
                <h6 className="text-success mb-0">{preVentas.length}</h6>
              </div>
              <div className="bg-light rounded p-2 text-center flex-fill ml-2">
                <small>Cantidad x Plato</small>
                <h6 className="text-dark mb-0">
                  {preVentas.reduce((acc, item) => acc + item.cantidad, 0)}
                </h6>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-muted">No hay productos en esta mesa.</p>
      )}
    </div>
  );
}
