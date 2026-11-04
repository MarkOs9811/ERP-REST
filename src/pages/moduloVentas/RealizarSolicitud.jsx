import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        className="flex-col p-3"
      >
        <Card className="flex align-content-center mb-3">
          <div className="flex p-3">
            <div>
              <h5>Solicitud de productos</h5>
              <small>
                Solicita un producto a almacen para ponerlo en venta
              </small>
            </div>
            <div className="ms-auto">
              <Button
                className="shadow border-input bg-background text-foreground hover:bg-accent inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
                onClick={() => handleVolver()}
                variant="default"
              >
                Volver
              </Button>
            </div>
          </div>
        </Card>
        <CardContent className="mx-auto w-full max-w-7xl px-4">
          {/* Información del Solicitante */}
          <Card className="mb-3 border">
            <CardHeader className="border-0">
              <div>
                <p className="h5">Información del Solicitante</p>
              </div>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-12 gap-3">
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="nombre_solicitante"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nombre del Solicitante
                    </label>
                    <input
                      type="text"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.nombre_solicitante
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      id="nombre_solicitante"
                      placeholder="Ingrese nombre"
                      {...register("nombre_solicitante", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.nombre_solicitante && (
                      <div className="text-sm text-destructive block">
                        {errors.nombre_solicitante.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="area"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Departamento/Área
                    </label>
                    <select
                      id="area"
                      className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.area ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                      <div className="text-sm text-destructive block">
                        {errors.area.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="correo_electronico"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.correo_electronico
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
                      <div className="text-sm text-destructive block">
                        {errors.correo_electronico.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="telefono"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.telefono
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
                      <div className="text-sm text-destructive block">
                        {errors.telefono.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalles del Producto/Activo Solicitado */}
          <Card className="mb-3 border">
            <CardHeader className="border-0">
              <p className="h5">Detalles del Producto/Activo Solicitado</p>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-12 gap-3">
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="nombre_producto"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nombre del Producto/Activo
                    </label>
                    <input
                      type="text"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.nombre_producto
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      id="nombre_producto"
                      placeholder="Nombre Producto"
                      {...register("nombre_producto", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.nombre_producto && (
                      <div className="text-sm text-destructive block">
                        {errors.nombre_producto.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="marcaProd"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Marca del Producto/Activo
                    </label>
                    <input
                      type="text"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.marcaProd
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      id="marcaProd"
                      placeholder="Marca del Producto"
                      {...register("marcaProd", {
                        required: "Este campo es obligatorio",
                      })}
                    />
                    {errors.marcaProd && (
                      <div className="text-sm text-destructive block">
                        {errors.marcaProd.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="descripcion"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.descripcion
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  placeholder="Descripción"
                  {...register("descripcion", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.descripcion && (
                  <div className="text-sm text-destructive block">
                    {errors.descripcion.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="lg:col-span-4 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="cantidad"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Cantidad
                    </label>
                    <input
                      type="number"
                      className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.cantidad
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      id="cantidad"
                      placeholder="Cantidad"
                      {...register("cantidad", {
                        required: "Este campo es obligatorio",
                        min: 1,
                      })}
                    />
                    {errors.cantidad && (
                      <div className="text-sm text-destructive block">
                        {errors.cantidad.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="unidad_medida"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Unidad de Medida
                    </label>
                    <select
                      id="unidad_medida"
                      className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.unidad_medida
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
                      <div className="text-sm text-destructive block">
                        {errors.unidad_medida.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="categoria"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Categoría
                    </label>
                    <select
                      id="categoria"
                      className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.categoria
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
                      <div className="text-sm text-destructive block">
                        {errors.categoria.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <div className="mb-3">
                  <label
                    htmlFor="precio_estimado"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Precio Estimado
                  </label>
                  <input
                    type="text"
                    id="precio_estimado"
                    className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.precio_estimado
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    {...register("precio_estimado", {
                      validate: validatePrecio,
                    })}
                    onInput={handlePrecioInput}
                  />
                  {errors.precio_estimado && (
                    <div className="text-sm text-destructive block">
                      {errors.precio_estimado.message}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* {USO PREVISTO}            */}

          <Card className="mb-3 border">
            <CardHeader className="border-0">
              <p className="h5">Justificacion</p>
            </CardHeader>
            <CardContent className="">
              <div className="col-span-full mb-3">
                <label
                  htmlFor="motivo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Motivo de la solicitud
                </label>
                <input
                  type="text"
                  id="motivo"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.motivo
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("motivo", {
                    required: "Justificacion requerida",
                  })}
                />
                {errors.motivo && (
                  <div className="text-sm text-destructive block">
                    {errors.motivo.message}
                  </div>
                )}
              </div>
              <div className="col-span-full mb-3">
                <label
                  htmlFor="uso_previsto"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Uso Previsto
                </label>
                <input
                  type="text"
                  id="uso_previsto"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.uso_previsto
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("uso_previsto", {
                    required: "Justificacion requerida",
                  })}
                />
                {errors.uso_previsto && (
                  <div className="text-sm text-destructive block">
                    {errors.uso_previsto.message}
                  </div>
                )}
              </div>
              <div className="col-span-full mb-3">
                <label
                  htmlFor="prioridad"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Prioridad
                </label>
                <select
                  type="text"
                  id="prioridad"
                  className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.prioridad
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
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
                  <div className="text-sm text-destructive block">
                    {errors.prioridad.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Botón de Envío */}
          <Card className="p-4 flex justify-center">
            <Button
              type="submit"
              className="btn-guardar me-auto"
              variant="default"
            >
              Guardar Solicitud
            </Button>
          </Card>
        </CardContent>
      </form>
    </div>
  );
}
