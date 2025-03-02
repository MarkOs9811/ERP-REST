import React from "react";
import { Form } from "react-bootstrap";
import { AddOutline, Pulse } from "react-ionicons";

const Categorias = ({ categorias, onToggle }) => {
  return (
    <div className="col-md-12">
      <div className="card  shadow-sm border">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Categorias</h5>
            <button
              className="btn btn-light "
              style={{ fontSize: "1.5rem" }}
              title="Agregar Metodo"
            >
              <AddOutline color={"auto"} />
            </button>
          </div>
          <ul className="list-unstyled mt-3">
            {categorias.map((cat) => (
              <li key={cat.id} className="media mb-3 d-flex align-items-center">
                <div className="media-body">
                  <h6 className="mt-0 mb-1">{cat.nombre}</h6>
                  <p> Nº {cat.id}</p>
                </div>
                <div className="ms-auto">
                  <Form.Check
                    type="switch"
                    id={`customSwitch${cat.id}`}
                    checked={cat.estado === 1}
                    onChange={() => onToggle(cat.id)}
                    label=""
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
