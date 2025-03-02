import { useEffect, useState } from "react";
import { getPreventaMesa } from "../../../service/preventaService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowBackOutline } from "react-ionicons";

export function DetallePedido({
  preVentas,
  estadoTipoVenta,
  totalPreventa,
  mesa,
  igv,
}) {
  // CAPTURAR SI ES QUE EXISTE LOS ESTADOS EN REDUX

  const navigate = useNavigate();

  const handleVolverPreVenta = () => {
    navigate(`/vender/ventasMesas/preVenta`);
  };
  const handleVolverLlevar = () => {
    navigate(`/vender/ventasLlevar`);
  };
  return (
    <div className="card p-3 shadow-sm" style={{ height: "100%" }}>
      <div className="card-header d-flex align-items-center justify-content-cente">
        <button
          className="btn btn-outline-dark me-auto"
          onClick={() =>
            estadoTipoVenta == "llevar"
              ? handleVolverLlevar()
              : handleVolverPreVenta()
          }
        >
          <ArrowBackOutline color={"auto"} />
          Volver
        </button>
        <h4 className="text-center text-auto align-middle mx-3">Cuenta </h4>
        <h6 className="text-center fw-bold align-middle h2 text-success">
          {estadoTipoVenta == "llevar" ? "Llevar" : "Mesa" + mesa + " "}
        </h6>
      </div>

      {preVentas.length > 0 ? (
        <>
          <div className="tabla-scroll">
            <table className="table table-borderless table-sm">
              <tbody>
                {preVentas.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="plato-row">
                    <td className="d-flex justify-content-between align-items-center">
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
          <div className="border-top pt-3">
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
