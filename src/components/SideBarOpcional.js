if (
  ["rr.hh", "finanzas", "almacen", "ventas", "vender"].includes(
    role.nombre.toLowerCase()
  )
) {
  return (
    <div className="accordion-item ms-3 border-0 rounded-none" key={role.id}>
      <p className="accordion-header" id={`${uniqueId}-heading`}>
        <button
          className="accordion-button collapsed text-start text-left px-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${uniqueId}-collapse`}
          aria-expanded="false"
          aria-controls={`${uniqueId}-collapse`}
        >
          <FontAwesomeIcon icon={icon} className="icon " />
          {!isCompressed && <span className="ms-2">{role.nombre}</span>}
        </button>
      </p>
      <div
        id={`${uniqueId}-collapse`}
        className="accordion-collapse collapse"
        aria-labelledby={`${uniqueId}-heading`}
        data-bs-parent="#main-accordion"
      >
        <div className="accordion-body p-0">
          <ul className="submenu-list p-0 m-0">
            {role.nombre.toLowerCase() === "rr.hh" && (
              <>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/planilla` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/planilla`}>Planilla</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ingreso-a-planilla`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ingreso-a-planilla`}>
                    Ingreso a Planilla
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/asistencia`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/asistencia`}>Asistencia</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/horas-extras`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/horas-extras`}>Horas Extras</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/adelanto-sueldo`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/adelanto-sueldo`}>
                    Adelanto de Sueldo
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/acaciones`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/vacaciones`}>Vacaciones</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/reportes` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/reportes`}>Reportes</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ajustes` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ajustes`}>Ajustes</Link>
                </li>
              </>
            )}
            {role.nombre.toLowerCase() === "ventas" && (
              <>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/misVentas`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/misVentas`}>Mis Ventas</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/inventario`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/inventario`}>Inventario</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/cajas` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/cajas`}>Cajas</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/solicitud`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/solicitud`}>Solicitud</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/reportes` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/reportes`}>Reportes</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ajustes-ventas`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ajustes-ventas`}>Ajustes Ventas</Link>
                </li>
              </>
            )}
            {role.nombre.toLowerCase() === "vender" && (
              <>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ventasMesas`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ventasMesas`}>Mesas</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ventasLlevar`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ventasLlevar`}>Llevar</Link>
                </li>
              </>
            )}
            {role.nombre.toLowerCase() === "finanzas" && (
              <>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/informes-financieros`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/informes-financieros`}>
                    Informes Financieros
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/libro-diario`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/libro-diario`}>Libro Diario</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/libro-mayor`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/libro-mayor`}>Libro Mayor</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/cuentas-por-cobrar`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/cuentas-por-cobrar`}>
                    Cuentas por Cobrar
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/cuentas-por-pagar`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/cuentas-por-pagar`}>
                    Cuentas por Pagar
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/presupuestacion`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/presupuestacion`}>
                    Presupuestación
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/firmar-solicitud`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/firmar-solicitud`}>
                    Firmar Solicitud
                  </Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ajustes ` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ajustes`}>Ajustes</Link>
                </li>
              </>
            )}
            {role.nombre.toLowerCase() === "almacen" && (
              <>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/productos`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/productos`}>Almacen</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/registro` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/registro`}>Registro</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/transferencia`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/transferencia`}>Transferencia</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/solicitud`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/solicitud`}>Solicitud</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/movimientos`
                      ? "active"
                      : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/movimientos`}>Movimientos</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/kardex` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/kardex`}>Kardex</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/reportes` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/reportes`}>Reportes</Link>
                </li>
                <li
                  className={`submenu-item ${
                    location.pathname === `/${roleUrl}/ajustes` ? "active" : ""
                  } ${isCompressed ? "center" : ""}`}
                >
                  <Link to={`/${roleUrl}/ajustes`}>Ajustes</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
