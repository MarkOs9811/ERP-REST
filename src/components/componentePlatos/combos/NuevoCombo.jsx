import { useForm } from "react-hook-form";
import { useState } from "react";

import { GetComboAi } from "../../../service/accionesPlatos/GetComboAi";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import {
  BottleWine,
  Flame,
  Hamburger,
  Soup,
  WandSparkles,
  WandSparklesIcon,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NuevoCombo({ onClose, onSuccess, estadoOpenAi }) {
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
        typeof item === "string" ? item === valor : item.nombre === valor,
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
          : item.nombre !== itemToRemove.nombre,
      ),
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
      <div className="mb-3">
        <label
          htmlFor="nombreCombo"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nombre del Combo
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombreCombo ? "border-destructive focus-visible:ring-destructive" : ""}`}
          id="nombreCombo"
          placeholder="Ej. Combo Ejecutivo"
          {...register("nombreCombo", { required: "Este campo es requerido" })}
        />
        {errors.nombreCombo && (
          <div className="text-sm text-destructive block">
            {errors.nombreCombo.message}
          </div>
        )}
      </div>

      {/* Precio */}
      <div className="mb-4">
        <label
          htmlFor="precioCombo"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Precio del Combo (S/.)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.precioCombo ? "border-destructive focus-visible:ring-destructive" : ""}`}
          id="precioCombo"
          placeholder="0.00"
          {...register("precioCombo", {
            required: "Este campo es requerido",
            pattern: {
              value: /^\d*\.?\d{0,2}$/,
              message: "Ingrese un número válido con hasta 2 decimales",
            },
          })}
        />
        {errors.precioCombo && (
          <div className="text-sm text-destructive block">
            {errors.precioCombo.message}
          </div>
        )}
      </div>

      {/* Selects por categoría */}
      <div className="grid grid-cols-12 gap-3">
        {Object.entries(opciones).map(([categoria, items]) => (
          <div className="col-span-full md:col-span-6 mb-3" key={categoria}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center">
              {iconos[categoria]} {categoria}
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="mb-4 rounded p-3">
        <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold">
          Descripción del Combo
        </label>
        {/* Ítems seleccionados manualmente */}
        <div className="mb-3">
          <h6 className="mb-2">Seleccionados:</h6>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <span
                key={`selected-${index}`}
                className="border text-xs font-semibold transition-colors rounded-full bg-primary flex items-center px-3 py-2"
              >
                {item}
                <Button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 size-8 p-0 opacity-70 hover:opacity-100 btn-close-white ms-2"
                  aria-label="Cerrar"
                  variant="default"
                ></Button>
              </span>
            ))}
            {selectedItems.length === 0 && (
              <p className="text-muted-foreground text-sm mt-2">
                No has seleccionado elementos aún.
              </p>
            )}
          </div>
        </div>
        {/* Ítems generados por IA */}
        <>
          {estadoOpenAi?.estado === 1 && (
            <Card className="p-2 border">
              {/* Botón IA */}
              <CardHeader className="">
                <div className="flex justify-start items-center mb-4 flex-col">
                  <Button
                    type="button"
                    className={`justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 flex items-center ${
                      bloqueado
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled"
                        : "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={handleGenerarCombo}
                    disabled={bloqueado}
                    variant="default"
                  >
                    {bloqueado ? (
                      <>
                        <span
                          className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creando combo con IA...
                      </>
                    ) : (
                      <>
                        <WandSparklesIcon className="me-2 text-auto" />
                        Deja que la IA lo cree
                      </>
                    )}
                  </Button>
                  <small className="text-muted-foreground italic mt-1">
                    Intenta crear el combo con la inteligencia artificial
                  </small>
                </div>
              </CardHeader>

              <CardContent className="">
                {bloqueado ? (
                  <div className="flex flex-col items-center py-4">
                    <Cargando />
                  </div>
                ) : isError ? (
                  <div className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive">
                    Hubo un error al obtener el combo.
                    <Button
                      type="button"
                      className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 mt-2"
                      onClick={handleGenerarCombo}
                      disabled={bloqueado}
                      variant="destructive"
                    >
                      Reintentar
                    </Button>
                  </div>
                ) : dataComboAi?.nombre ? (
                  <div className="mb-4">
                    <CardTitle asChild>
                      <h5 className="">{dataComboAi.nombre}</h5>
                    </CardTitle>
                    <p className="">{dataComboAi.descripcion}</p>

                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map((nombre, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-primary"
                        >
                          {nombre}
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              removeItem(nombre);
                            }}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 size-8 p-0 opacity-70 hover:opacity-100 btn-close-white ms-2"
                            variant="default"
                          />
                        </span>
                      ))}
                    </div>

                    <div className="me-auto mt-3 float-right">
                      <p className="h3">S/.{dataComboAi.precioCombo}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Presiona el botón para generar un combo
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      </div>

      {/* Botón de envío */}
      <div className="text-right flex gap-3">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={() => onClose()}
          variant="default"
        >
          Cerrar
        </Button>
        <Button type="submit" className="btn-guardar" variant="default">
          Crear Combo
        </Button>
      </div>
    </form>
  );
}
