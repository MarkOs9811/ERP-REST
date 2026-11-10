import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetAreas } from "../../../service/GetAreas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { clearProductoSelececcionado } from "../../../redux/productoTransferirSlice";
import { Button } from "../../ui/button";
import { CardContent } from "@/components/ui/card";

export function DestinoTransferir() {
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idDestino, setIdDestino] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const queryClient = useQueryClient(); // ← Obtienes el cliente
  const productoSeleccionado = useSelector(
    (state) => state.productoTransferir.items,
  );
  const totalUnidades = useMemo(
    () =>
      productoSeleccionado.reduce(
        (acc, item) => acc + (Number(item?.cantidad) || 0),
        0,
      ),
    [productoSeleccionado],
  );

  const {
    data: dataAra = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
  });
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setArchivo(null);
      return;
    }

    const fileTypesPermitidos = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (file && fileTypesPermitidos.includes(file.type)) {
      if (file.size > 5 * 1024 * 1024) {
        ToastAlert("warning", "El archivo no debe superar 5MB.");
        e.target.value = null;
        setArchivo(null);
        return;
      }

      setArchivo(file);
    } else {
      ToastAlert("warning", "Solo se permiten archivos PDF o Word.");
      e.target.value = null;
      setArchivo(null);
    }
  };

  const handleConfirmar = async () => {
    if (!idDestino) {
      ToastAlert("warning", "Debe seleccionar un destino.");
      return;
    }

    if (productoSeleccionado.length === 0) {
      ToastAlert("warning", "Debe seleccionar al menos un producto.");
      return;
    }

    // EXCEPCIÓN: Es inválido si es menor a 0, O si es 0 PERO su stock disponible es mayor a 0.
    // (Es decir, si el stock es 0 y la cantidad es 0, SÍ está permitido).
    const tieneCantidadInvalida = productoSeleccionado.some(
      (item) =>
        Number(item?.cantidad) < 0 ||
        (Number(item?.cantidad) === 0 && Number(item?.stock) > 0),
    );

    if (tieneCantidadInvalida) {
      ToastAlert(
        "warning",
        "Hay productos con cantidades inválidas o ceros en productos con stock.",
      );
      return;
    }

    // Validación de stock excedido (se omite si ambos stock y cantidad son 0)
    const excedeStock = productoSeleccionado.find(
      (item) =>
        Number(item?.cantidad) > Number(item?.stock) && Number(item?.stock) > 0,
    );

    if (excedeStock) {
      ToastAlert(
        "warning",
        `La cantidad de ${excedeStock.nombre} supera su stock disponible.`,
      );
      return;
    }

    const formData = new FormData();
    formData.append("idDestino", idDestino);
    if (archivo) {
      formData.append("archivo", archivo);
    }

    // Adjuntar productos seleccionados en JSON
    const productosSimplificados = productoSeleccionado.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
      precioUnit: item.precioUnit,
    }));

    formData.append("productos", JSON.stringify(productosSimplificados));

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/almacen/transferirInventario",
        formData,
      );
      if (response.data.success) {
        ToastAlert("success", "Se transfirió correctamente");
        dispatch(clearProductoSelececcionado());
        setArchivo(null);
        setIdDestino("");
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
      }
    } catch (error) {
      // Muestra el mensaje del backend si existe, o el genérico
      const mensajeError =
        error.response?.data?.message || "Ocurrió un error al transferir";
      ToastAlert("error", mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="">
      <div className="flex justify-between items-center gap-2 p-2 mb-3 rounded bg-muted text-sm font-semibold text-muted-foreground">
        <span>{productoSeleccionado.length} productos</span>
        <span>{totalUnidades} unidades</span>
      </div>

      <div className="mb-3 relative">
        <div className="">
          <label
            htmlFor="destino"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
          >
            Destino
          </label>
          <select
            id="destino"
            className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={idDestino}
            onChange={(e) => setIdDestino(e.target.value)}
          >
            <option value="">Seleccione un área</option>
            {dataAra
              ?.filter((item) => item.nombre.toLowerCase().includes("ventas"))
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="mb-3 relative">
        <label
          htmlFor="archivo"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
        >
          Adjuntar archivo (PDF o Word)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="archivo"
          className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          accept=".pdf,.doc,.docx"
          onChange={handleArchivoChange}
        />
        {archivo && (
          <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
            Archivo seleccionado: {archivo.name}
          </div>
        )}
      </div>
      <Button
        className="btn-guardar w-full p-3"
        onClick={handleConfirmar}
        disabled={loading || !idDestino || productoSeleccionado.length === 0}
        variant="default"
      >
        {loading ? "Transfiriendo..." : "Transferir"}
      </Button>
    </CardContent>
  );
}
