import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";

export function RealizarSolicitud() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/categorias");
      if (response.data.success) {
        setCategorias(response.data.data);
      } else {
        console.log("Error al obtener las categorias:", response.data.message);
      }
    } catch (error) {
      console.log("Error al ejecutar fetchCategorias:", error);
    }
  };
  const fetchUnidades = async () => {
    try {
      const response = await axiosInstance.get("/unidadMedida");
      if (response.data.success) {
        setUnidades(response.data.data);
      } else {
        console.log(
          "Error al obtener las unidadMedida:",
          response.data.message,
        );
      }
    } catch (error) {
      console.log("Error al ejecutar fetchunidadMedida:", error);
    }
  };

  const fetchArea = async () => {
    try {
      const response = await axiosInstance.get("/areas");
      if (response.data.success) {
        setAreas(response.data.data);
      } else {
        console.log("Error al obtener las areas:", response.data.message);
      }
    } catch (error) {
      console.log("Error al ejecutar fetchareas:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchUnidades();
    fetchArea();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/misSolicitudes", data);
      if (response.data.success) {
        ToastAlert("success", "Solicitud registrada ");
        handleVolver();
      } else {
        ToastAlert("error", "Error al registrar la solicitud");
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion " + error.message);
    }
  };

  const handleVolver = () => {
    navigate("/ventas/solicitud");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="form-solicitud"
        className="flex-column p-3"
      >
        <div className="card d-flex align-content-center mb-3">
          <div className="d-flex p-3">
            <div>
              <h5>Solicitud de productos</h5>
              <small>
                Solicita un producto a almacen para ponerlo en venta
              </small>
            </div>
            <div className="ms-auto">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => handleVolver()}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
        <div className="card-body container">
          {/* Información del Solicitante */}
          <div className="card mb-3 border ">
            <div className="card-header border-0 ">
              <div>
                <p className="h5">Información del Solicitante</p>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="nombre_solicitante" className="form-label ">
                      Nombre del Solicitante
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombre_solicitante ? "is-invalid" : ""
                      }`}
                      id="nombre_solicitante"
                      placeholder="Ingrese nombre"
                      {...register("nombre_solicitante", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.nombre_solicitante && (
                      <div className="invalid-feedback d-block">
                        {errors.nombre_solicitante.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="area" className="form-label ">
                      Departamento/Área
                    </label>
                    <select
                      id="area"
                      className={`form-select ${errors.area ? "is-invalid" : ""}`}
                      {...register("area", {
                        required: "Seleccione un área",
                      })}
                    >
                      <option value="">Seleccione...</option>
                      {areas &&
                        areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.nombre}
                          </option>
                        ))}
                    </select>
                    {errors.area && (
                      <div className="invalid-feedback d-block">
                        {errors.area.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="correo_electronico" className="form-label ">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.correo_electronico ? "is-invalid" : ""
                      }`}
                      id="correo_electronico"
                      placeholder="Email"
                      {...register("correo_electronico", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Ingrese un correo válido",
                        },
                      })}
                    />
                    {errors.correo_electronico && (
                      <div className="invalid-feedback d-block">
                        {errors.correo_electronico.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label ">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.telefono ? "is-invalid" : ""
                      }`}
                      id="telefono"
                      placeholder="Teléfono"
                      {...register("telefono", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]{9}$/,
                          message: "Debe tener 9 dígitos",
                        },
                      })}
                    />
                    {errors.telefono && (
                      <div className="invalid-feedback d-block">
                        {errors.telefono.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del Producto/Activo Solicitado */}
          <div className="card mb-3 border shadow-sm">
            <div className="card-header border-0">
              <p className="h5">Detalles del Producto/Activo Solicitado</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="nombre_producto" className="form-label ">
                      Nombre del Producto/Activo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombre_producto ? "is-invalid" : ""
                      }`}
                      id="nombre_producto"
                      placeholder="Nombre Producto"
                      {...register("nombre_producto", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.nombre_producto && (
                      <div className="invalid-feedback d-block">
                        {errors.nombre_producto.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="marcaProd" className="form-label ">
                      Marca del Producto/Activo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.marcaProd ? "is-invalid" : ""
                      }`}
                      id="marcaProd"
                      placeholder="Marca del Producto"
                      {...register("marcaProd", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.marcaProd && (
                      <div className="invalid-feedback d-block">
                        {errors.marcaProd.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label ">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  className={`form-control ${
                    errors.descripcion ? "is-invalid" : ""
                  }`}
                  placeholder="Descripción"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.descripcion && (
                  <div className="invalid-feedback d-block">
                    {errors.descripcion.message}
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-lg-4 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label ">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.cantidad ? "is-invalid" : ""
                      }`}
                      id="cantidad"
                      placeholder="Cantidad"
                      {...register("cantidad", {
                        required: "Este campo es obligatorio",
                        min: 1,
                      })}
                    />
                    {errors.cantidad && (
                      <div className="invalid-feedback d-block">
                        {errors.cantidad.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="unidad_medida" className="form-label ">
                      Unidad de Medida
                    </label>
                    <select
                      id="unidad_medida"
                      className={`form-select ${
                        errors.unidad_medida ? "is-invalid" : ""
                      }`}
                      {...register("unidad_medida", {
                        required: "Seleccione una unidad",
                      })}
                    >
                      <option value="">Seleccione...</option>
                      {unidades.map((unidad) => (
                        <option key={unidad.id} value={unidad.id}>
                          {unidad.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.unidad_medida && (
                      <div className="invalid-feedback d-block">
                        {errors.unidad_medida.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label ">
                      Categoría
                    </label>
                    <select
                      id="categoria"
                      className={`form-select ${
                        errors.categoria ? "is-invalid" : ""
                      }`}
                      {...register("categoria", {
                        required: "Seleccione una categoría",
                      })}
                    >
                      <option value="">Seleccione...</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <div className="invalid-feedback d-block">
                        {errors.categoria.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 ">
                <div className="mb-3">
                  <label htmlFor="precio_estimado" className="form-label ">
                    Precio Estimado
                  </label>
                  <input
                    type="text"
                    id="precio_estimado"
                    className={`form-control ${
                      errors.precio_estimado ? "is-invalid" : ""
                    }`}
                    {...register("precio_estimado", {
                      validate: validatePrecio,
                    })}
                    onInput={handlePrecioInput}
                  />
                  {errors.precio_estimado && (
                    <div className="invalid-feedback d-block">
                      {errors.precio_estimado.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* {USO PREVISTO}            */}

          <div className="card mb-3 border shadow-sm">
            <div className="card-header border-0">
              <p className="h5">Justificacion</p>
            </div>
            <div className="card-body">
              <div className="col-lg-12 mb-3">
                <label htmlFor="motivo" className="form-label ">
                  Motivo de la solicitud
                </label>
                <input
                  type="text"
                  id="motivo"
                  className={`form-control ${
                    errors.motivo ? "is-invalid" : ""
                  }`}
                  {...register("motivo", {
                    required: "Justificacion requerida",
                  })}
                />
                {errors.motivo && (
                  <div className="invalid-feedback d-block">
                    {errors.motivo.message}
                  </div>
                )}
              </div>
              <div className="col-lg-12 mb-3">
                <label htmlFor="uso_previsto" className="form-label ">
                  Uso Previsto
                </label>
                <input
                  type="text"
                  id="uso_previsto"
                  className={`form-control ${
                    errors.uso_previsto ? "is-invalid" : ""
                  }`}
                  {...register("uso_previsto", {
                    required: "Justificacion requerida",
                  })}
                />
                {errors.uso_previsto && (
                  <div className="invalid-feedback d-block">
                    {errors.uso_previsto.message}
                  </div>
                )}
              </div>
              <div className="col-lg-12 mb-3">
                <label htmlFor="prioridad" className="form-label ">
                  Prioridad
                </label>
                <select
                  type="text"
                  id="prioridad"
                  className={`form-select ${
                    errors.prioridad ? "is-invalid" : ""
                  }`}
                  {...register("prioridad", {
                    required: "Justificacion requerida",
                  })}
                >
                  <option value={"Alta"}>Alta</option>
                  <option value={"Media"}>Media</option>
                  <option value={"Baja"}>Bajo</option>
                </select>
                {errors.prioridad && (
                  <div className="invalid-feedback d-block">
                    {errors.prioridad.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Botón de Envío */}
          <div className=" border-0 rounded d-flex justify-content-center">
            <button type="submit" className="btn-guardar">
              Guardar Solicitud
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
