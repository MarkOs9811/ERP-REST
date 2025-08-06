import { Plus } from "lucide-react";


const Categorias = ({ categorias, onToggle }) => {
  return (
    <div className="col-md-12">
      <div className="card shadow-sm border h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-title mb-0 h5">Categorías</p>
            <button className="btn btn-light" title="Agregar Categoría">
              <Plus color={"auto"} />
            </button>
          </div>
          <ul className="list-group border-0 mt-3">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="list-group-item border-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{cat.nombre}</h6>
                  <small className="text-muted">
                    <div
                      className={`badge ${
                        cat.estado == 1
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {cat.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    checked={cat.estado == 1}
                    onChange={() => {
                      onToggle(cat);
                    }}
                    className="form-check-input"
                    id={`categoriaCheck${cat.id}`}
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

export default Categorias;
