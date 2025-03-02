import React from "react";
import { AddOutline, RemoveOutline } from "react-ionicons";

export const CardPlatos = ({
  item,
  isSelected,
  handleAdd,
  handleRemove,
  BASE_URL,
  capitalizeFirstLetter,
}) => {
  return (
    <div
      className={`float-left card-platillo card p-0 m-2 ${
        isSelected ? "selected" : ""
      }`}
    >
      <img
        src={`${BASE_URL}/storage/${item.foto}`}
        alt={item.nombre}
        className="card-img-top"
        style={{
          maxWidth: "auto",
          maxHeight: "80px",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <p className="nombre-plato mb-3">
          {capitalizeFirstLetter(item.nombre)}
        </p>
        <span className="rounded-pill p-1 card-text bg-warning fw-bold precioCard">
          S/. {item.precio}
        </span>
      </div>
      <div className="card-footer border-0 w-100 p-1 d-flex justify-content-between">
        {isSelected ? (
          <>
            <button
              type="button"
              className="btn-accionesPlatos btn-disminuir mx-1"
              onClick={() => handleRemove(item.id)}
            >
              <span className="me-2">
                <RemoveOutline color={"auto"} />
              </span>
              1
            </button>
            <button
              type="button"
              className="btn-accionesPlatos btn-añadir mx-1"
              onClick={() => handleAdd(item)}
            >
              <span className="me-2">
                <AddOutline color={"auto"} />
              </span>
              1
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-accionesPlatos btn-añadir w-100"
            onClick={() => handleAdd(item)}
          >
            <span className="me-2">
              <AddOutline color={"auto"} />
            </span>
            Agregar
          </button>
        )}
      </div>
    </div>
  );
};
