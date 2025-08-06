import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importa useLocation
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";

import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import {
  BadgeEuro,
  Hamburger,
  Megaphone,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react";

export function SubMenu() {
  const moduloAplicado = useSelector((state) => state.subMenu.moduloAplicado);
  const location = useLocation(); // Obtiene la URL actual
  const navigate = useNavigate();

  const cargo = JSON.parse(localStorage.getItem("user")) || {};
  return (
    <div className="card p-0">
      <div
        className="card-header  mb-0 w-100 rounded-0"
        style={{
          backgroundImage: "url('/images/fondo_submenu.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          color: "white",
        }}
      >
        <p
          className="h6 align-middle fw-bold "
          style={{ textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)" }}
        >
          {capitalizeFirstLetter(moduloAplicado)}
        </p>
      </div>
      <div className="subMenu card-body ">
        {moduloAplicado && (
          <ul className="list-unstyled ">
            {moduloAplicado === "accesos rapido" && (
              <div className="container p-0">
                <div className="row g-3 d-flex">
                  {[
                    {
                      icon: (
                        <ShoppingCart
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Nueva Venta",
                      className: "access-sales",
                      path: "/vender/ventasMesas",
                      show: ["administrador", "atencion al cliente"].includes(
                        cargo?.empleado?.cargo?.nombre
                      ),
                    },
                    {
                      icon: (
                        <Hamburger
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Gestión Platos",
                      className: "access-menu",
                      path: "/platos",
                      show: cargo?.empleado?.cargo?.nombre === "administrador",
                    },
                    {
                      icon: (
                        <Store
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Almacén",
                      className: "access-inventory",
                      path: "/almacen",
                      show: cargo?.empleado?.cargo?.nombre === "administrador",
                    },
                    {
                      icon: (
                        <BadgeEuro
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Finanzas",
                      className: "access-finance",
                      path: "/finanzas",
                      show: cargo?.empleado?.cargo?.nombre === "administrador",
                    },
                    {
                      icon: (
                        <UserRound
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Recursos Humanos",
                      className: "access-hr",
                      path: "/rr-hh",
                      show: cargo?.empleado?.cargo?.nombre === "administrador",
                    },
                    {
                      icon: (
                        <Megaphone
                          className="text-auto"
                          height="25px"
                          width="25px"
                        />
                      ),
                      title: "Incidencias",
                      className: "access-issues",
                      path: "/incidencias",
                      show: cargo?.empleado?.cargo?.nombre === "administrador",
                    },
                  ]
                    .filter((item) => item.show)
                    .map((item, index) => (
                      <div key={index}>
                        <div
                          className={` ${item.className} text-dark w-100 text-left`}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(item.path)}
                        >
                          <RippleWrapper>
                            <div className="btn d-flex w-100 p-2 m-0 align-items-center">
                              <div className="border rounded-pill p-2 mx-3 border-secondary">
                                {item.icon}
                              </div>
                              <small>{item.title}</small>
                            </div>
                          </RippleWrapper>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {moduloAplicado === "rr-hh" &&
              (() => {
                const subrutas = [
                  "/rr-hh/ingreso-a-planilla",
                  "/rr-hh/asistencia",
                  "/rr-hh/horas-extras",
                  "/rr-hh/adelanto-sueldo",
                  "/rr-hh/vacaciones",
                  "/rr-hh/reportes",
                  "/rr-hh/ajustes",
                ];

                const esSubruta = subrutas.some((ruta) =>
                  location.pathname.startsWith(ruta)
                );
                const esPlanilla =
                  location.pathname === "/rr-hh" ||
                  (location.pathname.startsWith("/rr-hh") && !esSubruta);

                return (
                  <>
                    <li className={`p-0 d-flex ${esPlanilla ? "active" : ""}`}>
                      <Link to="/rr-hh" className="w-100 p-2">
                        Planilla
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith(
                          "/rr-hh/ingreso-a-planilla"
                        )
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="/rr-hh/ingreso-a-planilla"
                        className="w-100 p-2"
                      >
                        Ingreso a Planilla
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/asistencia")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/asistencia" className="w-100 p-2">
                        Asistencia
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/horas-extras")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/horas-extras" className="w-100 p-2">
                        Horas Extras
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/adelanto-sueldo")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/adelanto-sueldo" className="w-100 p-2">
                        Adelanto de Sueldo
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/vacaciones")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/vacaciones" className="w-100 p-2">
                        Vacaciones
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/reportes")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/reportes" className="w-100 p-2">
                        Reportes
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/rr-hh/ajustes")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/rr-hh/ajustes" className="w-100 p-2">
                        Ajustes
                      </Link>
                    </li>
                  </>
                );
              })()}

            {moduloAplicado === "ventas" &&
              (() => {
                const subrutasVentas = [
                  "/ventas/inventario",
                  "/ventas/cajas",
                  "/ventas/solicitud",
                  "/ventas/reportes",
                  "/ventas/ajustes-ventas",
                ];

                const esSubrutaVentas = subrutasVentas.some((ruta) =>
                  location.pathname.startsWith(ruta)
                );
                const esMisVentas =
                  location.pathname === "/ventas" ||
                  (location.pathname.startsWith("/ventas") && !esSubrutaVentas);

                return (
                  <>
                    <li className={`p-0 d-flex ${esMisVentas ? "active" : ""}`}>
                      <Link to="/ventas" className="w-100 p-2">
                        Mis Ventas
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/ventas/inventario")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/ventas/inventario" className="w-100 p-2">
                        Inventario
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/ventas/cajas")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/ventas/cajas" className="w-100 p-2">
                        Cajas
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/ventas/solicitud")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/ventas/solicitud" className="w-100 p-2">
                        Solicitud
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/ventas/reportes")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/ventas/reportes" className="w-100 p-2">
                        Reportes
                      </Link>
                    </li>

                    <li
                      className={`p-0 d-flex ${
                        location.pathname.startsWith("/ventas/ajustes-ventas")
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link to="/ventas/ajustes-ventas" className="w-100 p-2">
                        Ajustes Ventas
                      </Link>
                    </li>
                  </>
                );
              })()}

            {moduloAplicado === "vender" &&
              (() => {
                const rutasVender = [
                  "/vender/ventasMesas",
                  "/vender/ventasLlevar",
                  "/vender/pedidosWeb",
                ];

                return (
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
                );
              })()}

            {moduloAplicado === "finanzas" && (
              <>
                <li
                  className={`p-0 d-flex ${
                    location.pathname === "/finanzas" ? "active" : ""
                  }`}
                >
                  <Link to="/finanzas" className="w-100 p-2">
                    Informes Financieros
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/presupuestos")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/presupuestos" className="w-100 p-2">
                    Presupuestos
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/libro-diario")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/libro-diario" className="w-100 p-2">
                    Libro Diario
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/libro-mayor")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/libro-mayor" className="w-100 p-2">
                    Libro Mayor
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/cuentas-por-cobrar")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/cuentas-por-cobrar" className="w-100 p-2">
                    Cuentas por Cobrar
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/cuentas-por-pagar")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/cuentas-por-pagar" className="w-100 p-2">
                    Cuentas por Pagar
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/firmar-solicitud")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/firmar-solicitud" className="w-100 p-2">
                    Firmar Solicitud
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/reportesFinanzas")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/reportesFinanzas" className="w-100 p-2">
                    Reportes Financieros
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/finanzas/ajustes")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/finanzas/ajustes" className="w-100 p-2">
                    Ajustes
                  </Link>
                </li>
              </>
            )}

            {moduloAplicado === "almacen" && (
              <>
                <li
                  className={`p-0 d-flex ${
                    location.pathname === "/almacen" ? "active" : ""
                  }`}
                >
                  <Link to="/almacen" className="w-100 p-2">
                    Almacen
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/registro")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/registro" className="w-100 p-2">
                    Registro
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/transferencia")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/transferencia" className="w-100 p-2">
                    Transferencia
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/solicitud")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/solicitud" className="w-100 p-2">
                    Solicitud
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/movimientos")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/movimientos" className="w-100 p-2">
                    Movimientos
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/kardex")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/kardex" className="w-100 p-2">
                    Kardex
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/reportes")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/reportes" className="w-100 p-2">
                    Reportes
                  </Link>
                </li>

                <li
                  className={`p-0 d-flex ${
                    location.pathname.startsWith("/almacen/ajustes")
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/almacen/ajustes" className="w-100 p-2">
                    Ajustes
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
