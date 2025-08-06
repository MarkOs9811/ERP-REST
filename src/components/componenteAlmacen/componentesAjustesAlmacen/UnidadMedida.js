import { Plus } from "lucide-react";

const UnidadMedida = ({ unidades, onToggle }) => {
  return (
    <div className="col-md-12 h-100">
      <div className="card shadow-sm border h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-title mb-0 h5">Unidades de Medida</p>
            <button className="btn btn-light" title="Agregar Unidad">
              <Plus color={"auto"} />
            </button>
          </div>
          <ul className="list-group mt-3">
            {unidades.map((unidad) => (
              <li
                key={unidad.id}
                className="list-group-item border-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{unidad.nombre}</h6>
                  <small className="text-muted">
                    <div
                      className={`badge ${
                        unidad.estado == 1
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {unidad.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`unidadCheck${unidad.id}`}
                    checked={unidad.estado == 1}
                    onChange={() => onToggle(unidad)}
                    style={{
                      width: 40,
                      height: 22,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnidadMedida;
