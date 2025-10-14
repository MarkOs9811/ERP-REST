import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BotonConfirmar from "../../componentesReutilizables/BotonConfirmar";

import { GetAreas } from "../../../service/GetAreas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { clearProductoSelececcionado } from "../../../redux/productoTransferirSlice";
import { File, FileAxis3d } from "lucide-react";

export function DestinoTransferir() {
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idDestino, setIdDestino] = useState("");
  const dispatch = useDispatch();

  const queryClient = useQueryClient(); // ← Obtienes el cliente
  const productoSeleccionado = useSelector(
    (state) => state.productoTransferir.items
  );

  const {
    data: dataAra = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
    retry: 1,
  });

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword")
    ) {
      setArchivo(file);
    } else {
      alert("Solo se permiten archivos PDF o Word.");
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
        formData
      );
      if (response.data.success) {
        ToastAlert("success", "Se transferio correctamente");
        dispatch(clearProductoSelececcionado());
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
      }
    } catch (error) {
      ToastAlert("error", "Ocurriò un error al transferrir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-body">
      <div className="mb-3 position-relative">
        <div className="form-floating">
          <select
            className="form-select"
            value={idDestino}
            onChange={(e) => setIdDestino(e.target.value)}
          >
            <option value="">Seleccione un área</option>
            {dataAra?.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
          <label>Destino</label>
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

      <BotonConfirmar onClick={handleConfirmar} loading={loading} />
    </div>
  );
}
