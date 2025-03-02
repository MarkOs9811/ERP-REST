import { useCallback, useEffect, useState } from "react";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { GetCajas } from "../../service/GetCajas";
import { Cargando } from "../componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { EllipsisVerticalOutline } from "react-ionicons";

export function CajasList({ search }) {
  const [cajas, setCajas] = useState([]);
  const [filteCajas, setFilterCajas] = useState([]);
  const [hasError, setHasError] = useState(false);

  const fetchCajas = useCallback(async () => {
    try {
      const result = await GetCajas();
      if (result.success) {
        setCajas(result.data);
        setFilterCajas(result.data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error en fetchCajas:", error);
      setHasError(true);
    }
  }, []);

  const { loading, error, execute } = useEstadoAsyn(fetchCajas);

  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);

  if (loading) {
    return <Cargando />;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <pre>{error.message || "Error al cargar"}</pre>
      </div>
    );
  }

  const cardStyle = {
    flexGrow: 1,
    flexBasis: "150px",
    transition: "all ease-out 0.2s",
    background: "#fff",
    borderRadius: "8px",
    position: "relative", // Necesario para posicionar el dropdown correctamente.
    overflow: "visible", // Evitar cortar el contenido del dropdown.
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "start",
    flexWrap: "wrap",
    gap: "15px",
    padding: "10px",
  };

  return (
    <div style={containerStyle}>
      {Array.isArray(cajas) && cajas.length > 0 ? (
        cajas.map((item) => (
          <div className="card border" key={item.id} style={cardStyle}>
            {/* Dropdown Bootstrap 5 */}

            <div className="card-header rounded-pill">
              {/* Card Content */}
              <p className="h3">{capitalizeFirstLetter(item.nombreCaja)}</p>
              <div
                className="dropdown"
                style={{ position: "absolute", top: "10px", right: "10px" }}
              >
                <button
                  className="btn btn-light btn-sm"
                  type="button"
                  id={`dropdownMenuButton-${item.id}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <EllipsisVerticalOutline color={"auto"} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby={`dropdownMenuButton-${item.id}`}
                  style={{
                    zIndex: 1050, // Nivel de apilamiento alto para que sobresalga.
                  }}
                >
                  <li>
                    <button className="dropdown-item" type="button">
                      Editar
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button">
                      Eliminar
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <span
                className={`badge ${
                  item.estado == 1
                    ? item.estadoCaja == 1
                      ? "bg-success"
                      : "bg-danger"
                    : "bg-secondary"
                }`}
              >
                {item.estado == 1
                  ? item.estadoCaja == 1
                    ? "Abierta"
                    : "Cerrado"
                  : "Deshabilitado"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No hay cajas disponibles</p>
      )}
    </div>
  );
}
