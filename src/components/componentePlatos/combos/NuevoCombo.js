import { useForm } from "react-hook-form";
import { useState } from "react";

import { GetComboAi } from "../../../service/accionesPlatos/GetComboAi";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { BottleWine, Flame, Hamburger, Soup, WandSparkles } from "lucide-react";

export function NuevoCombo({ onClose, onSuccess }) {
  const configuracion = JSON.parse(localStorage.getItem("configuracion"));
  const openAIConfig = configuracion.find(
    (item) => item.nombre === "Open AI" && item.estado === 1
  );
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [bloqueado, setBloqueado] = useState(false); // <-- control manual del botón

  const {
    mutate: generarComboApi,
    data: dataComboAi = {},
    isError,
  } = useMutation({
    mutationFn: GetComboAi,
    retry: 1,
    onMutate: () => {
      setBloqueado(true); // bloquear al iniciar
    },
    onSettled: () => setBloqueado(false),

    onSuccess: (data) => {
      if (data?.nombre) {
        setValue("nombreCombo", data.nombre, { shouldValidate: true });
      }
      if (data?.precioCombo) {
        setValue("precioCombo", data.precioCombo, { shouldValidate: true });
      }
      if (data?.items) {
        setSelectedItems((prev) => [
          ...prev,
          ...data.items.map((item) => item.nombre), // Convierte a strings
        ]);
      }
    },
    onError: (error) => {
      console.error("Error generando combo:", error);
    },
  });

  const handleGenerarCombo = () => {
    if (!bloqueado) {
      generarComboApi();
    }
  };

  const opciones = {
    Bebidas: ["Coca Cola", "Inca Kola", "Sprite", "Fanta"],
    Platos: ["Arroz Chaufa", "Tallarin", "Pollo Saltado", "Chifa Especial"],
    Brasa: ["1/4 Pollo", "1/2 Pollo", "Pollo Entero", "Alitas BBQ"],
    Hamburguesa: [
      "Cheeseburger",
      "Double Burger",
      "Bacon Burger",
      "Veggie Burger",
    ],
  };

  const iconos = {
    Bebidas: <BottleWine className="me-2" />,
    Platos: <Soup className="me-2" />,
    Brasa: <Flame className="me-2" />,
    Hamburguesa: <Hamburger className="me-2" />,
  };

  const handleSelectChange = (e) => {
    const valor = e.target.value;
    if (
      valor &&
      !selectedItems.some((item) =>
        typeof item === "string" ? item === valor : item.nombre === valor
      )
    ) {
      setSelectedItems((prev) => [...prev, valor]); // Guarda el string directamente
    }
    e.target.value = "";
  };

  const removeItem = (itemToRemove) => {
    setSelectedItems((prev) =>
      prev.filter((item) =>
        typeof item === "string"
          ? item !== itemToRemove
          : item.nombre !== itemToRemove.nombre
      )
    );
  };

  const onSubmit = async (formData) => {
    try {
      const comboData = {
        nombreCombo: formData.nombreCombo,
        precioCombo: formData.precioCombo,
        items: selectedItems.map((nombre) => ({ nombre })), // Convierte strings a objetos
      };

      const response = await axiosInstance.post("/combos", comboData);

      if (response.data.success) {
        reset();
        ToastAlert("success", "Combo creado con éxito");
        setSelectedItems([]);
        onSuccess(); // ← Actualiza la lista en el padre
        onClose(); // ← Cierra el modal
      }
    } catch (error) {
      ToastAlert("error", "Error: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-2">
      {/* Nombre Combo */}
      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${errors.nombreCombo ? "is-invalid" : ""}`}
          id="nombreCombo"
          placeholder="Nombre del Combo"
          {...register("nombreCombo", { required: "Este campo es requerido" })}
        />
        <label htmlFor="nombreCombo">Nombre del Combo</label>
        {errors.nombreCombo && (
          <div className="invalid-feedback">{errors.nombreCombo.message}</div>
        )}
      </div>

      {/* Precio */}
      <div className="form-floating mb-4">
        <input
          type="text"
          className={`form-control ${errors.precioCombo ? "is-invalid" : ""}`}
          id="precioCombo"
          placeholder="Precio del Combo"
          {...register("precioCombo", {
            required: "Este campo es requerido",
            pattern: {
              value: /^\d*\.?\d{0,2}$/,
              message: "Ingrese un número válido con hasta 2 decimales",
            },
          })}
          onKeyDown={(e) => {
            const allowedKeys = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "Delete",
            ];
            if (
              !allowedKeys.includes(e.key) &&
              !/^\d$/.test(e.key) &&
              !(e.key === "." && !e.currentTarget.value.includes("."))
            ) {
              e.preventDefault();
            }
          }}
        />
        <label htmlFor="precioCombo">Precio del Combo S/.</label>
        {errors.precioCombo && (
          <div className="invalid-feedback">{errors.precioCombo.message}</div>
        )}
      </div>

      {/* Selects por categoría */}
      <div className="row">
        {Object.entries(opciones).map(([categoria, items]) => (
          <div className="col-md-6 mb-3" key={categoria}>
            <label className="form-label d-flex align-items-center">
              {iconos[categoria]} {categoria}
            </label>
            <select
              className="form-select"
              onChange={(e) => handleSelectChange(e, categoria)}
            >
              <option value="">Seleccionar {categoria}</option>
              {items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Descripción dinámica */}
      <div className="mb-4 border rounded p-3">
        <label className="form-label">Descripción del Combo</label>
        {/* Ítems seleccionados manualmente */}
        <div className="mb-3">
          <h6 className="mb-2">Seleccionados:</h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <span
                key={`selected-${index}`}
                className="badge rounded-pill bg-primary d-flex align-items-center px-3 py-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="btn btn-sm btn-close btn-close-white ms-2"
                  aria-label="Cerrar"
                ></button>
              </span>
            ))}
            {selectedItems.length === 0 && (
              <p className="text-muted small mt-2">
                No has seleccionado elementos aún.
              </p>
            )}
          </div>
        </div>
        {/* Ítems generados por IA */}
        {openAIConfig && (
          <div className="card  p-2 border">
            {/* Botón IA */}

            <div className="card-header">
              <div className="d-flex justify-content-start align-items-center mb-4 flex-column">
                <button
                  type="button"
                  className={`btn d-flex align-items-center ${
                    bloqueado ? "btn-secondary disabled" : "btn-outline-dark"
                  }`}
                  onClick={handleGenerarCombo}
                  disabled={bloqueado}
                >
                  {bloqueado ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creando combo con IA...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="me-2" color={"auto"} />
                      Deja que la IA lo cree
                    </>
                  )}
                </button>
                <small className="text-muted fst-italic mt-1">
                  Intenta crear el combo con la inteligencia artificial
                </small>
              </div>
            </div>
            <div className="card-body">
              {bloqueado ? (
                <div className="d-flex flex-column align-items-center py-4">
                  <Cargando />
                </div>
              ) : isError ? (
                <div className="alert alert-danger">
                  Hubo un error al obtener el combo.
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2"
                    onClick={handleGenerarCombo}
                    disabled={bloqueado}
                  >
                    Reintentar
                  </button>
                </div>
              ) : dataComboAi?.nombre ? (
                <div className="mb-4">
                  <h5 className="card-title">{dataComboAi.nombre}</h5>
                  <p className="card-text">{dataComboAi.descripcion}</p>

                  <div className="d-flex flex-wrap gap-2">
                    {selectedItems.map((nombre, index) => (
                      <span key={index} className="badge bg-primary">
                        {nombre}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(nombre);
                          }}
                          className="btn-close btn-close-white ms-2"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="me-auto mt-3 float-end">
                    <p className="h3">
                      S/.
                      {dataComboAi.precioCombo}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted">
                  Presiona el botón para generar un combo
                </p>
              )}
            </div>
            {/* Estado del contenido */}
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <div className="text-end">
        <button type="submit" className="btn btn-success">
          Crear Combo
        </button>
      </div>
    </form>
  );
}
