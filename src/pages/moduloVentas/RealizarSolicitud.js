import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

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
          response.data.message
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
    <ContenedorPrincipal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="form-solicitud"
        className="flex-column card shadow-sm p-3"
      >
        <div className="card-header  d-flex align-content-center">
          <div>
            <h5>Solicitud de productos</h5>
            <small>Solicita un producto a almacen para ponerlo en venta</small>
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
        <div className="card-body">
          {/* Información del Solicitante */}
          <div className="card mb-3 border shadow-sm ">
            <div className="card-header border-0 ">
              <div>
                <p className="h5">Información del Solicitante</p>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6 col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_solicitante"
                      placeholder="Ingrese nombre"
                      {...register("nombre_solicitante", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    <label htmlFor="nombre_solicitante">
                      Nombre del Solicitante
                    </label>
                    {errors.nombre_solicitante && (
                      <span className="text-danger">
                        {errors.nombre_solicitante.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-floating mb-3">
                    <select
                      id="area"
                      className="form-select"
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
                    <label htmlFor="area">Departamento/Área</label>
                    {errors.area && (
                      <span className="text-danger">{errors.area.message}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-lg-6 col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
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
                    <label htmlFor="correo_electronico">
                      Correo Electrónico
                    </label>
                    {errors.correo_electronico && (
                      <span className="text-danger">
                        {errors.correo_electronico.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
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
                    <label htmlFor="telefono">Teléfono</label>
                    {errors.telefono && (
                      <span className="text-danger">
                        {errors.telefono.message}
                      </span>
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
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_producto"
                      placeholder="Nombre Producto"
                      {...register("nombre_producto", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    <label htmlFor="nombre_producto">
                      Nombre del Producto/Activo
                    </label>
                    {errors.nombre_producto && (
                      <span className="text-danger">
                        {errors.nombre_producto.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="marcaProd"
                      placeholder="Marca del Producto"
                      {...register("marcaProd", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    <label htmlFor="marcaProd">Marca del Producto/Activo</label>
                    {errors.marcaProd && (
                      <span className="text-danger">
                        {errors.marcaProd.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  id="descripcion"
                  className="form-control"
                  placeholder="Descripción"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                  })}
                />
                <label htmlFor="descripcion">Descripción</label>
                {errors.descripcion && (
                  <span className="text-danger">
                    {errors.descripcion.message}
                  </span>
                )}
              </div>

              <div className="row g-3">
                <div className="col-lg-4 col-sm-12">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="cantidad"
                      placeholder="Cantidad"
                      {...register("cantidad", {
                        required: "Este campo es obligatorio",
                        min: 1,
                      })}
                    />
                    <label htmlFor="cantidad">Cantidad</label>
                    {errors.cantidad && (
                      <span className="text-danger">
                        {errors.cantidad.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="form-floating mb-3">
                    <select
                      id="unidad_medida"
                      className="form-select"
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
                    <label htmlFor="unidad_medida">Unidad de Medida</label>
                    {errors.unidad_medida && (
                      <span className="text-danger">
                        {errors.unidad_medida.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="form-floating mb-3">
                    <select
                      id="categoria"
                      className="form-select"
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
                    <label htmlFor="categoria">Categoría</label>
                    {errors.categoria && (
                      <span className="text-danger">
                        {errors.categoria.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 ">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="precio_estimado"
                    className="form-control"
                    {...register("precio_estimado", {
                      validate: validatePrecio,
                    })}
                    onInput={handlePrecioInput}
                  />
                  <label htmlFor="precio_estimado">Precio Estimado</label>
                  {errors.precio_estimado && (
                    <div className="invalid-feedback">
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
              <div className="form-floating col-lg-12 mb-3">
                <input
                  type="text"
                  id="motivo"
                  className="form-control"
                  {...register("motivo", {
                    required: "Justificacion requerida",
                  })}
                />
                <label htmlFor="motivo">Motivo de la solicitud</label>
                {errors.motivo && (
                  <div className="required-feedback">
                    {errors.motivo.message}
                  </div>
                )}
              </div>
              <div className="form-floating col-lg-12 mb-3">
                <input
                  type="text"
                  id="uso_previsto"
                  className="form-control"
                  {...register("uso_previsto", {
                    required: "Justificacion requerida",
                  })}
                />
                <label htmlFor="uso_previsto">Uso Previsto</label>
                {errors.uso_previsto && (
                  <div className="required-feedback">
                    {errors.uso_previsto.message}
                  </div>
                )}
              </div>
              <div className="form-floating col-lg-12 mb-3">
                <select
                  type="text"
                  id="prioridad"
                  className="form-select"
                  {...register("prioridad", {
                    required: "Justificacion requerida",
                  })}
                >
                  <option value={"Alta"}>Alta</option>
                  <option value={"Media"}>Media</option>
                  <option value={"Baja"}>Bajo</option>
                </select>
                <label htmlFor="prioridad">Prioridad</label>
                {errors.prioridad && (
                  <div className="required-feedback">
                    {errors.prioridad.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Botón de Envío */}
          <div className="card-footer  shadow-sm border-0 rounded d-flex justify-content-center">
            <button type="submit" className="btn-guardar">
              Guardar Solicitud
            </button>
          </div>
        </div>
      </form>
    </ContenedorPrincipal>
  );
}
