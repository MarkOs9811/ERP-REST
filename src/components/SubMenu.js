import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Importa useLocation
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import { PedidosWsp } from "./PedidosWsp";

export function SubMenu() {
  const moduloAplicado = useSelector((state) => state.subMenu.moduloAplicado);
  const location = useLocation(); // Obtiene la URL actual
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
  return (
    <div className="row ps-3 my-0 w-100 h-100">
      <div className={`col-md-12 col-sm-12 p-0`} style={{ height: "auto" }}>
        <div className="card  justify-content-center bg-transparent flex-grow-1  d-flex flex-column m-0">
          <p className="h6 align-middle my-3 mx-3 fw-bold">
            {capitalizeFirstLetter(moduloAplicado)}
          </p>
          <div className="subMenu card-body w-100 px-2">
            {moduloAplicado && (
              <ul className="list-unstyled ">
                {moduloAplicado === "rr-hh" && (
                  <>
                    <li
                      className={
                        location.pathname === "/rr.hh/planilla" ? "active" : ""
                      }
                    >
                      <Link to="/rr.hh/planilla">Planilla</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/ingreso-a-planilla"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/rr.hh/ingreso-a-planilla">
                        Ingreso a Planilla
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/asistencia"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/rr.hh/asistencia">Asistencia</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/horas-extras"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/rr.hh/horas-extras">Horas Extras</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/adelanto-sueldo"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/rr.hh/adelanto-sueldo">
                        Adelanto de Sueldo
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/vacaciones"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/rr.hh/vacaciones">Vacaciones</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/reportes" ? "active" : ""
                      }
                    >
                      <Link to="/rr.hh/reportes">Reportes</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/rr.hh/ajustes" ? "active" : ""
                      }
                    >
                      <Link to="/rr.hh/ajustes">Ajustes</Link>
                    </li>
                  </>
                )}
                {moduloAplicado === "ventas" && (
                  <>
                    <li
                      className={
                        location.pathname === "/ventas/misVentas"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/ventas/misVentas">Mis Ventas</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/ventas/inventario"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/ventas/inventario">Inventario</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/ventas/cajas" ? "active" : ""
                      }
                    >
                      <Link to="/ventas/cajas">Cajas</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/ventas/solicitud"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/ventas/solicitud">Solicitud</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/ventas/reportes" ? "active" : ""
                      }
                    >
                      <Link to="/ventas/reportes">Reportes</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/ventas/ajustes-ventas"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/ventas/ajustes-ventas">Ajustes Ventas</Link>
                    </li>
                  </>
                )}
                {moduloAplicado === "vender" && (
                  <>
                    <li
                      className={
                        location.pathname === "/vender/ventasMesas"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/vender/ventasMesas">Mesas</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/vender/ventasLlevar"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/vender/ventasLlevar">Llevar</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/vender/pedidosWeb"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/vender/pedidosWeb">Pedidos</Link>
                    </li>
                  </>
                )}
                {moduloAplicado === "finanzas" && (
                  <>
                    <li
                      className={
                        location.pathname === "/finanzas/informes-financieros"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/informes-financieros">
                        Informes Financieros
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/libro-diario"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/libro-diario">Libro Diario</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/libro-mayor"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/libro-mayor">Libro Mayor</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/cuentas-por-cobrar"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/cuentas-por-cobrar">
                        Cuentas por Cobrar
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/cuentas-por-pagar"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/cuentas-por-pagar">
                        Cuentas por Pagar
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/presupuestacion"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/presupuestacion">
                        Presupuestación
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/firmar-solicitud"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/firmar-solicitud">
                        Firmar Solicitud
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/finanzas/ajustes"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/finanzas/ajustes">Ajustes</Link>
                    </li>
                  </>
                )}
                {moduloAplicado === "almacen" && (
                  <>
                    <li
                      className={
                        location.pathname === "/almacen/productos"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/productos">Almacen</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/registro"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/registro">Registro</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/transferencia"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/transferencia">Transferencia</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/solicitud"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/solicitud">Solicitud</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/movimientos"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/movimientos">Movimientos</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/kardex" ? "active" : ""
                      }
                    >
                      <Link to="/almacen/kardex">Kardex</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/reportes"
                          ? "active"
                          : ""
                      }
                    >
                      <Link to="/almacen/reportes">Reportes</Link>
                    </li>
                    <li
                      className={
                        location.pathname === "/almacen/ajustes" ? "active" : ""
                      }
                    >
                      <Link to="/almacen/ajustes">Ajustes</Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Sección de PedidosWsp separada del menú */}
      {/* <div
        className="col-md-12 col-sm-12 p-0 "
        style={{ height: "calc(100vh - 553px)" }}
      > */}
      {/* {moduloAplicado === "vender" && <PedidosWsp />} */}
      {/* </div> */}
    </div>
  );
}
