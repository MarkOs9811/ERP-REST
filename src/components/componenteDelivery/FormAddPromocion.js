import { useState } from "react";
import { Image, Percent, DollarSign, Calendar } from "lucide-react";

export function FormAddPromocion({ onClose, platos }) {
  const [formData, setFormData] = useState({
    idPlato: "",
    titulo: "",
    porcentaje_descuento: "",
    precio_promocional: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [precioOriginal, setPrecioOriginal] = useState(0);

  // Cuando selecciona un plato, buscamos su precio original
  const handlePlatoChange = (e) => {
    const platoId = e.target.value;
    const platoSeleccionado = platos?.find((p) => p.id === parseInt(platoId));

    if (platoSeleccionado) {
      setPrecioOriginal(platoSeleccionado.precio);
      setFormData({
        ...formData,
        idPlato: platoId,
        // Sugerimos el nombre del plato como título de la promo por defecto
        titulo: `Promo ${platoSeleccionado.nombre}`,
      });
      calcularDescuento(
        formData.porcentaje_descuento,
        platoSeleccionado.precio,
      );
    } else {
      setPrecioOriginal(0);
      setFormData({ ...formData, idPlato: "" });
    }
  };

  // Calcula el precio final automáticamente
  const calcularDescuento = (porcentaje, precioBase) => {
    if (porcentaje && precioBase > 0) {
      const descuento = precioBase * (porcentaje / 100);
      const precioFinal = precioBase - descuento;
      setFormData((prev) => ({
        ...prev,
        precio_promocional: precioFinal.toFixed(2),
      }));
    }
  };

  const handlePorcentajeChange = (e) => {
    const nuevoPorcentaje = e.target.value;
    setFormData({ ...formData, porcentaje_descuento: nuevoPorcentaje });
    calcularDescuento(nuevoPorcentaje, precioOriginal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData);
    // Aquí llamarías a tu servicio Post/Save
    // savePromocion(formData).then(() => onClose());
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column h-100 p-4">
      {/* Selector de Plato */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Seleccionar Plato / Combo
        </label>
        <select
          className="form-select border-secondary shadow-sm"
          value={formData.idPlato}
          onChange={handlePlatoChange}
          required
        >
          <option value="">-- Elige un producto del menú --</option>
          {platos?.map((plato) => (
            <option key={plato.id} value={plato.id}>
              {plato.nombre} (S/ {plato.precio})
            </option>
          ))}
        </select>
      </div>

      {/* Título de la Promo */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Título del Banner (App)
        </label>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Ej: Jueves de Locura 2x1"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
        />
      </div>

      {/* Fila de Precios y Descuentos */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark">
            Descuento (%)
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Percent size={16} className="text-muted" />
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Ej: 15"
              value={formData.porcentaje_descuento}
              onChange={handlePorcentajeChange}
            />
          </div>
        </div>
        <div className="col-6">
          <label className="form-label fw-medium text-dark">
            Precio Promo (S/)
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <DollarSign size={16} className="text-danger" />
            </span>
            <input
              type="number"
              step="0.01"
              className="form-control text-danger fw-bold"
              value={formData.precio_promocional}
              onChange={(e) =>
                setFormData({ ...formData, precio_promocional: e.target.value })
              }
              required
            />
          </div>
          {precioOriginal > 0 && (
            <small className="text-muted mt-1 d-block">
              Precio normal: S/ {precioOriginal}
            </small>
          )}
        </div>
      </div>

      {/* Fechas de Vigencia */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark">Fecha Inicio</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              className="form-control"
              value={formData.fecha_inicio}
              onChange={(e) =>
                setFormData({ ...formData, fecha_inicio: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-6">
          <label className="form-label fw-medium text-dark">Fecha Fin</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              className="form-control"
              value={formData.fecha_fin}
              onChange={(e) =>
                setFormData({ ...formData, fecha_fin: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Carga de Imagen */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Imagen del Banner
        </label>
        <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
          <Image size={32} className="text-muted mb-2" />
          <p className="mb-0 text-muted small">
            Arrastra una imagen o haz clic para subir
          </p>
          <input type="file" className="form-control mt-3" accept="image/*" />
        </div>
      </div>

      {/* Controles del Footer (Usando tus clases) */}
      <div className="mt-auto d-flex justify-content-end gap-2 border-top pt-3">
        <button type="button" className="btn-cerrar-modal" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-guardar">
          Guardar Promoción
        </button>
      </div>
    </form>
  );
}
