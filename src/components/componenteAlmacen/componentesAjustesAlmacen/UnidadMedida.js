import React from "react";
import { Form } from "react-bootstrap";
import { AddOutline, Pulse } from "react-ionicons";

const UnidadMedida = ({ unidades, onToggle }) => {
  return (
    <div className="col-md-12">
      <div className="card  shadow-sm border">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Unidades de Medida</h5>
            <button
              className="btn btn-light "
              style={{ fontSize: "1.5rem" }}
              title="Agregar Metodo"
            >
              <AddOutline color={"auto"} />
            </button>
          </div>
          <ul className="list-unstyled mt-3">
            {unidades.map((unidad) => (
              <li
                key={unidad.id}
                className="media mb-3 d-flex align-items-center"
              >
                <div className="media-body">
                  <h6 className="mt-0 mb-1">{unidad.nombre}</h6>
                  <p> Nº {unidad.id}</p>
                </div>
                <div className="ms-auto">
                  <Form.Check
                    type="switch"
                    id={`customSwitch${unidad.id}`}
                    checked={unidad.estado === 1}
                    onChange={() => onToggle(unidad.id)}
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

export default UnidadMedida;
