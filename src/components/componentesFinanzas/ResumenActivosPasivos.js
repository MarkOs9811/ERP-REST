import { useQuery } from "@tanstack/react-query";
import { GetPresupuestos } from "../../service/serviceFinanzas/GetPresupuestos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShopify } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { subMenuClick } from "../../redux/subMenuSlice";
import { useDispatch } from "react-redux";

export function ResumenActivosPasivos() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["presupuestos"],
    queryFn: GetPresupuestos,
    refetchOnWindowFocus: false,
    retry: false,
  });
  // let valorAlmacen = data?.valorAlmacen || {};
  // let valorInventario = data?.valorInventario || {};
  // let deudas = data?.valorPagar || {};

  return (
    <ul className="list-group bg-dark">
      <li
        className="list-group-item bg-auto list-group-item-action p-4"
        onClick={() => {
          navigate("/almacen");
          dispatch(subMenuClick("almacen"));
        }}
        style={{ cursor: "pointer" }}
      >
        <p className="h6">Valor Almacen</p>
        <p className="h3">S/.{Number(data?.valorAlmacen ?? 0).toFixed(2)}</p>
        <FontAwesomeIcon icon={faBoxOpen} className="icon-background" />
      </li>
      <li
        className="list-group-item list-group-item-action p-4"
        onClick={() => {
          navigate("/ventas/inventario");
          dispatch(subMenuClick("ventas"));
        }}
        style={{ cursor: "pointer" }}
      >
        <p className="h6">Valor Inventario</p>
        <p className="h3">S/.{Number(data?.valorInventario ?? 0).toFixed(2)}</p>
        <FontAwesomeIcon icon={faShopify} className="icon-background" />
      </li>
      <li
        className="list-group-item list-group-item-action p-4"
        onClick={() => {
          navigate("/finanzas/cuentas-por-pagar");
          dispatch(subMenuClick("finanzas"));
        }}
        style={{ cursor: "pointer" }}
      >
        <p className="h6">Deudas</p>
        <p className="h3">S/.{Number(data?.valorPagar ?? 0).toFixed(2)}</p>
        <FontAwesomeIcon icon={faCreditCard} className="icon-background" />
      </li>
    </ul>
  );
}
