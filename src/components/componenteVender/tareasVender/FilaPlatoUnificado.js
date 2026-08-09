import React, { useState, useEffect } from "react";
import { Minus, Plus, Repeat, Trash2 } from "lucide-react";

export const FilaPlatoUnificado = ({
  item,
  tipo,
  onDelete,
  onUpdateQuantity, // NUEVA PROP
  loadingUpdate, // NUEVA PROP
  loadingDelete,
  isSplitMode,
  reduxItem,
  onToggleSelect,
  onChangeSplitQty,
}) => {
  const nombrePlato = item.plato?.nombre || item.nombre;
  const precioUnitario = item.plato?.precio || item.precio;

  // ESTADO LOCAL (UI Instantánea)
  const [cantidadLocal, setCantidadLocal] = useState(item.cantidad);

  // Sincronizar el estado local si la BD cambia
  useEffect(() => {
    setCantidadLocal(item.cantidad);
  }, [item.cantidad]);

  // EFECTO DEBOUNCE (Frena las peticiones)
  useEffect(() => {
    if (cantidadLocal !== item.cantidad) {
      const timer = setTimeout(() => {
        if (onUpdateQuantity) {
          const idReferencia = tipo === "nuevo" ? item.id : item.idPlato;
          onUpdateQuantity(idReferencia, cantidadLocal, tipo); // Envía la cantidad final
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [
    cantidadLocal,
    item.cantidad,
    item.id,
    item.idPlato,
    tipo,
    onUpdateQuantity,
  ]);

  // Manejador de clics
  const handleCambioLocal = (delta) => {
    setCantidadLocal((prev) => {
      const nuevaCantidad = prev + delta;
      return nuevaCantidad > 0 ? nuevaCantidad : 1;
    });
  };

  const precioTotal = cantidadLocal * precioUnitario;
  const isSelected = !!reduxItem;
  const cantidadSeleccionada = reduxItem ? reduxItem.cantidad : 0;
  const precioSeleccionado = reduxItem ? reduxItem.subtotal : 0;

  const opacityClass =
    isSplitMode && !isSelected ? "opacity-50" : "opacity-100";
  const bgClass = tipo === "nuevo" ? "bg-warning bg-opacity-10" : "bg-white";
  const borderClass = tipo === "entregado" ? "border-success" : "border-light";
  const canSelect = tipo !== "nuevo";

  return (
    <div
      className={`d-flex align-items-center justify-content-between p-2 mb-1 rounded border ${bgClass} ${borderClass} ${opacityClass} transition-all`}
    >
      {isSplitMode && canSelect && (
        <div className="me-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isSelected}
            onChange={() => onToggleSelect(item)}
          />
        </div>
      )}
      <div
        className="d-flex align-items-center gap-2"
        style={{ width: isSplitMode ? "35%" : "40%" }}
      >
        <div className="d-flex flex-column lh-1">
          <span
            className="fw-bold text-dark text-truncate"
            style={{ fontSize: "0.9rem", maxWidth: "140px" }}
          >
            {nombrePlato}
          </span>
          <span className="text-muted small">
            S/. {Number(precioUnitario).toFixed(2)}
          </span>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: "30%" }}
      >
        {!isSplitMode && (
          <>
            {tipo !== "entregado" ? (
              <div className="d-flex align-items-center bg-white border rounded-pill px-1 shadow-sm">
                <button
                  className="btn btn-sm btn-link text-dark p-0"
                  onClick={() => handleCambioLocal(-1)}
                  disabled={
                    loadingUpdate ===
                    (tipo === "nuevo" ? item.id : item.idPlato)
                  }
                >
                  <Minus size={14} />
                </button>
                <span className="mx-2 fw-bold small">{cantidadLocal}</span>
                <button
                  className="btn btn-sm btn-link text-dark p-0"
                  onClick={() => handleCambioLocal(1)}
                  disabled={
                    loadingUpdate ===
                    (tipo === "nuevo" ? item.id : item.idPlato)
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <span className="fw-bold fs-6 text-success">
                x{cantidadLocal}
              </span>
            )}
          </>
        )}
        {isSplitMode && canSelect && isSelected && (
          <div className="d-flex align-items-center bg-primary bg-opacity-10 border border-primary rounded-pill px-1">
            <button
              className="btn btn-sm btn-link text-primary border-none p-0"
              onClick={(e) => {
                e.stopPropagation();
                onChangeSplitQty(item.id, -1, item.cantidad);
              }}
            >
              <Minus size={14} />
            </button>
            <span className="mx-2 fw-bold small text-primary border-none">
              {cantidadSeleccionada} / {item.cantidad}
            </span>
            <button
              className="btn btn-sm btn-link text-primary border-none p-0"
              onClick={(e) => {
                e.stopPropagation();
                onChangeSplitQty(item.id, 1, item.cantidad);
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
      <div
        className="d-flex align-items-center justify-content-end gap-2"
        style={{ width: "30%" }}
      >
        <span
          className={`fw-bold small ${isSelected ? "text-primary" : "text-dark"}`}
        >
          S/.{" "}
          {Number(
            isSplitMode && isSelected ? precioSeleccionado : precioTotal,
          ).toFixed(2)}
        </span>
        {!isSplitMode && tipo !== "entregado" && (
          <button
            className="btn btn-sm btn-link text-danger p-0 mx-3"
            onClick={() => onDelete(item.id)}
            disabled={loadingDelete === item.id}
          >
            {loadingDelete === item.id ? (
              <Repeat size={16} className="spinner-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
