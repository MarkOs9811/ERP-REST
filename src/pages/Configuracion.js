import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../api/AxiosInstance';
import ToastAlert from '../components/componenteToast/ToastAlert';

export function Configuracion() {
  const [logoActual, setLogoActual] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [datosEmpresa, setDatosEmpresa] = useState(null);
  const [logoFile, setLogoFile] = useState(null); // Manejo del archivo de logo
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDatosEmpresa = async () => {
      try {
        const response = await axiosInstance.get('/configuracion/getMiEmpresa');
        if (response.data) {
          setDatosEmpresa(response.data);
          setLogoActual(`${BASE_URL}/${response.data.logo}`);
          console.log(`${BASE_URL}/${response.data.logo}`);
          reset({
            nombre: response.data.nombre,
            ruc: response.data.ruc,
            correo: response.data.correo,
            numero: response.data.numero,
            direccion: response.data.direccion,
          });
        }
      } catch (error) {
        console.error('Error al cargar datos de la empresa:', error.message);
      }
    };

    fetchDatosEmpresa();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('ruc', data.ruc);
      formData.append('correo', data.correo);
      formData.append('numero', data.numero);
      formData.append('direccion', data.direccion);

      if (logoFile) {
        formData.append('logo', logoFile); // Solo adjunta el archivo si se seleccionó uno nuevo
      }

      const response = await axiosInstance.post('/configuracion/updateMiempresa', formData);

      if (response.status === 200) {
        ToastAlert('success','Datos actualizados correctamente');
      } else {
        ToastAlert('error','Error al actualizar los datos');
      }
    } catch (error) {
      if (error.response) {
        ToastAlert('error',`Error: ${error.response.data.message || 'Algo salió mal.'}`);
      } else {
        
        ToastAlert('error',`Error:${error}`);
      }
    }
  };

 

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*', // Aceptar cualquier imagen
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file); // Crear un objeto URL para la previsualización
        setLogoPreview(objectUrl); // Establecer el logo previsualizado
        setLogoFile(file); // Guardar el archivo para enviarlo al servidor
      }
    },
  });

  return (
    <div className="row mt-4">
      <div className="col-md-12">
        <div className="card border-0 p-4 shadow-sm rounded">
          <h3 className="mb-4">Configuración de la Empresa</h3>
          
          {/* Mostrar el logo actual si existe */}
          {logoActual && <img src={logoActual} alt="Logo de la empresa" className="img-fluid mb-3" style={{ maxWidth: '150px' }} />}

          {/* Mostrar la previsualización del logo si ha sido cargado */}
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Previsualizado"
              className="img-fluid mb-3"
              style={{
                maxWidth: '150px',
                borderRadius: '8px',
                border: '2px solid #ddd',
              }}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="logo" className="form-label">Logo de la Empresa</label>
              <div {...getRootProps()} className="dropzone border p-4 text-center" style={{ cursor: 'pointer' }}>
                <input {...getInputProps()} id="logo" name="logo" className="d-none" />
                {!logoPreview && (
                  <p className="text-muted">Haz clic o arrastra para cargar el logo</p>
                )}
                <button type="button" className="btn btn-outline-primary mt-2">Seleccionar archivo</button>
              </div>
              <p className="text-danger">{errors.logo?.message}</p>
            </div>

            {/* Otros campos del formulario */}
            <div className="mb-3">
              <label htmlFor="ruc" className="form-label">RUC</label>
              <input
                type="text"
                id="ruc"
                className="form-control"
                {...register('ruc', { required: 'El RUC es obligatorio' })}
                defaultValue={datosEmpresa?.ruc || ''}
              />
              <p className="text-danger">{errors.ruc?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre de la Empresa</label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                defaultValue={datosEmpresa?.nombre || ''}
              />
              <p className="text-danger">{errors.nombre?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                className="form-control"
                {...register('correo', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                    message: 'Correo electrónico inválido',
                  },
                })}
                defaultValue={datosEmpresa?.correo || ''}
              />
              <p className="text-danger">{errors.correo?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="numero" className="form-label">Número de Teléfono</label>
              <input
                type="tel"
                id="numero"
                className="form-control"
                {...register('numero', {
                  required: 'El número de teléfono es obligatorio',
                  pattern: {
                    value: /^[0-9]{9}$/,
                    message: 'Número de teléfono inválido',
                  },
                })}
                defaultValue={datosEmpresa?.numero || ''}
              />
              <p className="text-danger">{errors.numero?.message}</p>
            </div>

            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input
                type="text"
                id="direccion"
                className="form-control"
                {...register('direccion', { required: 'La dirección es obligatoria' })}
                defaultValue={datosEmpresa?.direccion || ''}
              />
              <p className="text-danger">{errors.direccion?.message}</p>
            </div>

            <button type="submit" className="btn btn-primary w-100">Actualizar Datos</button>
          </form>
        </div>
      </div>
    </div>
  );
}
