import { Link, useLocation } from "react-router-dom";
import "../css/NavegacionEstilos.css";
import { useState, useEffect } from "react";
import { LockClosedOutline } from "react-ionicons";
import { useSelector } from "react-redux";

export function Navegacion() {
  const location = useLocation(); // Obtiene la ubicación actual
  const pathnames = location.pathname.split("/").filter((x) => x);

  const caja = useSelector((state) => state.caja.caja);

  // Mapea las rutas a nombres amigables
  const routeNames = {
    "": "Inicio",
    productos: "Productos",
    registro: "Registro",
    transferencia: "Transferencia",
    solicitud: "Solicitud",
    movimientos: "Movimientos",
    kardex: "Kardex",
    reportes: "Reportes",
    ajustes: "Ajustes",
  };
  // const handleCloseCaja = () => {
  //   alert("cerrad acaj");
  // };
  return (
    <div className="card d-flex border-none rounded-0 p-3 shadow-sm position-relative">
      <nav
        aria-label="breadcrumb"
        className="d-flex justify-content-between align-items-center"
      >
        <ol className="breadcrumb p-0 mb-0 d-flex">
          {pathnames.length === 0 ? (
            <li className="breadcrumb-item active" aria-current="page">
              <strong>{routeNames[""]}</strong>
            </li>
          ) : (
            <>
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-primary">
                  <strong>{routeNames[""]}</strong>
                </Link>
              </li>
              {pathnames.map((pathname, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return isLast ? (
                  <li
                    key={to}
                    className="breadcrumb-item active"
                    aria-current="page"
                  >
                    <strong>{routeNames[pathname] || pathname}</strong>
                  </li>
                ) : (
                  <li key={to} className="breadcrumb-item">
                    <Link to={to} className="text-decoration-none text-primary">
                      <strong>{routeNames[pathname] || pathname}</strong>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ol>
        <div className="text-end">
          {caja?.estado === "abierto" && (
            <Link
              to={"vender/cerrarCaja"}
              className="btn btn-outline-danger d-flex align-items-center gap-1"
            >
              <LockClosedOutline color={"auto"} /> Cerrar Caja
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
