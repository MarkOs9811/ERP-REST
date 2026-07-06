import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetAreas } from "../../../service/GetAreas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { clearProductoSelececcionado } from "../../../redux/productoTransferirSlice";
import { File } from "lucide-react";

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

    if (!archivo) {
      ToastAlert("warning", "Debe adjuntar un archivo primero.");
      return;
    }

    if (productoSeleccionado.length === 0) {
      ToastAlert("warning", "Debe seleccionar al menos un producto.");
      return;
    }

    const tieneCantidadInvalida = productoSeleccionado.some(
      (item) => Number(item?.cantidad) <= 0,
    );
    if (tieneCantidadInvalida) {
      ToastAlert("warning", "Hay productos con cantidades inválidas.");
      return;
    }

    const excedeStock = productoSeleccionado.find(
      (item) => Number(item?.cantidad) > Number(item?.stock),
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
    formData.append("archivo", archivo);

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
      ToastAlert("error", "Ocurrió un error al transferir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-body">
      <div className="transfer-summary mb-3">
        <span>{productoSeleccionado.length} productos</span>
        <span>{totalUnidades} unidades</span>
      </div>

      <div className="mb-3 position-relative">
        <div className="">
          <label htmlFor="destino" className="form-label fw-bold">
            Destino
          </label>
          <select
            id="destino"
            className="form-select"
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

      <div className="mb-3 position-relative">
        <label htmlFor="archivo" className="form-label fw-bold">
          Adjuntar archivo (PDF o Word)
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <File className="text-auto" />
          </span>
          <input
            ref={fileInputRef}
            type="file"
            id="archivo"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleArchivoChange}
          />
        </div>
        {archivo && (
          <div className="form-text text-success mt-1">
            Archivo seleccionado: {archivo.name}
          </div>
        )}
      </div>
      <button
        className="btn-realizarPedido w-100 display-7  p-3"
        onClick={handleConfirmar}
        disabled={
          loading || !idDestino || !archivo || productoSeleccionado.length === 0
        }
      >
        {loading ? "Transfiriendo..." : "Transferir"}
      </button>
    </div>
  );
}
