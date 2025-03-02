import React from "react";
import { Form } from "react-bootstrap";
import { AddOutline, Pulse } from "react-ionicons";

const MetodoPago = ({ metodos, onToggle }) => {
  return (
    <div className="col-md-3">
      <div className="card  shadow-sm border">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Método de Pagos</h5>
            <button
              className="btn btn-light btn-sm"
              style={{ fontSize: "1.5rem" }}
              title="Agregar Metodo"
              
            >
              <AddOutline color={'auto'}/>
            </button>
          </div>
          <ul className="list-unstyled mt-3">
            {metodos.map((metodo) => (
              <li
                key={metodo.id}
                className="media mb-3 d-flex align-items-center"
              >
                <div className="media-body">
                  <h6 className="mt-0 mb-1">{metodo.nombre}</h6>
                  <p> Nº {metodo.id}</p>
                </div>
                <div className="ms-auto">
                  <Form.Check
                    type="switch"
                    id={`customSwitch${metodo.id}`}
                    checked={metodo.estado === 1}
                    onChange={() => onToggle(metodo.id)}
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

export default MetodoPago;
