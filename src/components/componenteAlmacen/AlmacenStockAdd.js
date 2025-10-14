import axios from "axios";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import { useState } from "react";
export function AlmacenStockAdd({ handleCloseModal, producto, onAlmacenUpdate }) {


    const [cantidad, setCantidad] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [cantidadError, setCantidadError] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    if (!producto) {
        return <div>Cargando...</div>; // O cualquier otro mensaje de carga
    }

    const validateCantidad = () => {
        if (cantidad <= 0 || isNaN(cantidad)) {
            setCantidadError(true);
            return false;
        }
        setCantidadError(false);
        return true;
    };

    const onSubmit = async (data) => {
        // Ahora data contiene los valores del formulario procesados por react-hook-form

        const formData = new FormData();
        formData.append('idProductoEdit', producto.id);
        formData.append('stockActual', producto.cantidad);
        formData.append('cantidadIngresar', cantidad);
        formData.append('pdf_file', pdfFile);
        formData.append('image_file', imageFile);
        const token = localStorage.getItem('token');
        if (!token) {
            ToastAlert('error', 'No estás autenticado. Por favor, inicia sesión.');
            return; // Detén la ejecución si no hay token.
        }

        try {
            const response = await axios.post('http://erp-api.test/api/almacen/add-stock', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.status === 'success') {
                ToastAlert('success', response.data.message); // Mostrar mensaje de éxito
                handleCloseModal();
                onAlmacenUpdate();
            } else {
                ToastAlert('error', 'Algo salió mal, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al actualizar el stock:', error);
        }
    };

    return (
        <div>
            <div className="alert alert-danger d-flex align-items-center" role="alert">
                <span className="me-2">
                    <i className="fas fa-exclamation-circle"></i>
                </span>
                La información del documento debe reflejarse aquí. Para agregar un nuevo producto, ingrese <a href="#" className="text-decoration-none">aquí</a>.
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Nombres del Producto */}
                <div className="mb-3">
                    <label htmlFor="productoNombre" className="form-label">Nombres Producto/activo</label>
                    <input
                        type="text"
                        id="productoNombre"
                        className="form-control"
                        value={producto.nombre}
                        readOnly
                    />
                </div>

                {/* Categoría, Unidad de medida, Proveedor */}
                <div className="row g-2">
                    <div className="col-md-4">
                        <label htmlFor="productoCategoria" className="form-label">Categoría</label>
                        <select className="form-select" id="productoCategoria" disabled>
                            <option>{producto.categoria.nombre || "Sin categoría"}</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="productoUnidad" className="form-label">Unidad de medida</label>
                        <select className="form-select" id="productoUnidad" disabled>
                            <option>{producto.unidad.nombre || "Sin unidad"}</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="productoProveedor" className="form-label">Proveedor</label>
                        <select className="form-select" id="productoProveedor" disabled>
                            <option>{producto.proveedor.nombre || "Sin proveedor"}</option>
                        </select>
                    </div>
                </div>

                {/* Stock actual */}
                <div className="my-3">
                    <label htmlFor="stockActual" className="form-label">Stock actual</label>
                    <input
                        type="number"
                        id="stockActual"
                        className="form-control"
                        value={producto.cantidad}
                        readOnly
                    />
                </div>

                {/* Cantidad a ingresar */}
                <div className="mb-3">
                    <label htmlFor="nuevaCantidad" className="form-label">Cantidad a ingresar</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="nuevaCantidad"
                            className={`form-control ${cantidadError ? 'is-invalid' : 'input-add-stock'}`}
                            placeholder="Ingrese cantidad ingresada"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            onBlur={validateCantidad} // Validar cuando el campo pierde el foco
                            required
                        />
                        {cantidadError && (
                            <div className="invalid-feedback">
                                <i className="fas fa-exclamation-circle"></i> La cantidad ingresada es inválida.
                            </div>
                        )}
                    </div>
                </div>

                {/* Archivos */}
                <div className="mb-3">
                    <label htmlFor="archivoPDF" className="form-label">Seleccionar PDF</label>
                    <input
                        className="form-control"
                        type="file"
                        id="archivoPDF"
                        accept="application/pdf"
                        {...register('pdf', {
                            required: 'El archivo PDF es obligatorio',
                            validate: (value) => value?.length > 0 || 'Debe cargar un archivo PDF',
                        })}
                        onChange={(e) => setPdfFile(e.target.files[0])}
                    />
                    {errors.pdf && <p className="text-danger">{errors.pdf.message}</p>}
                    
                    <small className="text-success">
                        <i className="fas fa-info-circle"></i> Cargar archivo firmado por Administrador/finanzas
                    </small>
                </div>

                <div className="mb-3">
                    <label htmlFor="archivoFirma" className="form-label">Cargar firma</label>
                    <input
                        className="form-control"
                        type="file"
                        id="archivoFirma"
                        accept="image/*"
                        {...register('firma', {
                            required: 'La firma es obligatoria',
                            validate: (value) => value?.length > 0 || 'Debe cargar una imagen de firma',
                        })}
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    {errors.firma && <p className="text-danger">{errors.firma.message}</p>}

                    <small className="text-warning">
                        <i className="fas fa-exclamation-circle"></i> El archivo cargado no debe ser pesado
                    </small>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>
                        <i className="fas fa-times"></i> Cerrar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save"></i> Firmar y actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}
