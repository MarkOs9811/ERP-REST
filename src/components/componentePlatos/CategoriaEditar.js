import { useState, useEffect } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";

export function CategoriaEditar({ handleCloseModal, dataCategoria, onCategoriaUpdate }) {
    const [dataForm, setDataForm] = useState({ nombre: "" });

    // Sincronizar dataForm con dataCategoria cuando esté listo
    useEffect(() => {
        if (dataCategoria) {
            setDataForm({ nombre: dataCategoria.nombre });
        }
    }, [dataCategoria]);

    if (!dataCategoria) {
        return <div>Cargando...</div>; // Mensaje de carga
    }

    const handleUpdateCategoria = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
      

        try {
            // Enviar los datos como JSON
            const response = await axiosInstance.put(
                `/gestionPlatos/updateCategoria/${dataCategoria.id}`,
                dataForm
            );

            if (response.data.success) {
                ToastAlert("success", response.data.message);
                onCategoriaUpdate(); // Llama la función para actualizar la lista
                handleCloseModal(); // Cierra el modal
            } else {
                ToastAlert("error", response.data.message);
            }
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            ToastAlert("error", "Error en la conexión");
        }
    };

    return (
        <div>
            <form onSubmit={handleUpdateCategoria}>
                <div className="card p-3">
                    <div className="form-floating">
                        <input
                            id="inputNombreCat"
                            className="form-control"
                            value={dataForm.nombre}
                            onChange={(e) => setDataForm({ ...dataForm, nombre: e.target.value })}
                        />
                        <label htmlFor="inputNombreCat">Nombre de categoría</label>
                    </div>
                </div>
                {/* Botones */}
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn-cerrar-modal btn-cerrar me-2"
                        onClick={handleCloseModal}
                    >
                        <i className="fas fa-times"></i> Cerrar
                    </button>
                    <button type="submit" className="btn-guardar">
                        <i className="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
