import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ToastAlert from "../componenteToast/ToastAlert";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Eye, EyeOff, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormEditarCompra } from "./FormEditarCompra";
import { useForm } from "react-hook-form";

export function ListaCompras({ data, search }) {
  const [modalEditarCompra, setModalEditarCompra] = useState(false);
  const [modalQuestionEliminar, setModalQuestionEliminar] = useState(false);
  const [dataCompra, setDataCompra] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const handleEliminarCompra = async (idCompra) => {
    try {
      const response = await axiosInstance.delete(`/compras/${idCompra}`);
      if (response.data.success) {
        ToastAlert("success", " Compra eliminada correctamente");
      } else {
        ToastAlert("error", "Error al eliminar la compra");
      }
    } catch (error) {
      // 👇 si el backend manda un mensaje, lo mostramos
      const mensaje =
        error.response?.data?.message || "Error de red o del servidor";

      ToastAlert("error", mensaje);
      return false;
    }
  };

  //Busacar en la tbala
  const filteredData = data.filter((compra) => {
    const proveedorNombre = compra.proveedor?.nombre || "";
    const usuarioNombre =
      compra.usuario?.empleado?.persona?.nombre +
        " " +
        compra.usuario?.empleado?.persona?.apellidos || "";
    const fechaCompra = compra.fecha_compra || "";
    const montoCompra = compra.totalPagado ? compra.totalPagado.toString() : "";
    const searchLower = search.toLowerCase();
    return (
      proveedorNombre.toLowerCase().includes(searchLower) ||
      usuarioNombre.toLowerCase().includes(searchLower) ||
      fechaCompra.toLowerCase().includes(searchLower) ||
      montoCompra.toLowerCase().includes(searchLower)
    );
  });
  const dataFinal = search ? filteredData : data;

  const onSubmitEdit = async () => {
    // Lógica para manejar la edición de la compra
    console.log("Editar compra:", dataCompra);
  };
  // Definir columnas
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Usuario",
      selector: (row) =>
        row.usuario?.empleado?.persona?.nombre +
        " " +
        row.usuario?.empleado?.persona?.apellidos,
      sortable: true,
    },
    {
      name: "Proveedor",
      selector: (row) => row.proveedor?.nombre,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row) => {
        const monto = parseFloat(row.totalPagado);
        return isNaN(monto) ? "S/. 0.00" : `S/. ${monto.toFixed(2)}`;
      },
      sortable: true,
    },

    {
      name: "Fecha",
      selector: (row) => row.fecha_compra,
      sortable: true,
    },
    {
      name: "Observaciones",
      selector: (row) => row.observaciones || "N/A",
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className="px-2 py-1 rounded text-white"
          style={{
            backgroundColor: row.estado === 1 ? "#4caf50" : "#ff9800",
          }}
        >
          {row.estado === 1 ? "Pagado" : "Pendiente"}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Documento",
      cell: (row) => (
        <a href={row.documentoUrl} target="_blank" rel="noopener noreferrer">
          <FileText size={20} color="auto" />
        </a>
      ),
      width: "100px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn-editar btn-sm"
            onClick={() => {
              setModalEditarCompra(true);
              setDataCompra(row);
            }}
          >
            <Eye className="text-auto" size={18} />
          </button>
          <button
            className="btn-eliminar btn-sm"
            onClick={() => {
              setModalQuestionEliminar(true);
              setDataCompra(row);
            }}
          >
            <Trash2 className="text-auto" size={18} />
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <div className="tabla-container">
      <TablasGenerales datos={dataFinal} columnas={columns} />

      <ModalAlertQuestion
        show={modalQuestionEliminar}
        handleCloseModal={() => setModalQuestionEliminar(false)}
        title={"¿Está seguro de eliminar la compra?"}
        textButton={"Eliminar"}
        nombre={
          dataCompra?.proveedor?.nombre + " - S/." + dataCompra?.totalPagado
        }
        tipo={"compra"}
        idEliminar={dataCompra?.id}
        handleEliminar={handleEliminarCompra} // Simulación de eliminación
      />
      <ModalRight
        isOpen={modalEditarCompra}
        onClose={() => {
          setModalEditarCompra(false);
        }}
        title="Detalle de la Compra"
        submitText="Guardar Cambios"
        onSubmit={() => {
          handleSubmit(onSubmitEdit);
        }}
      >
        <div className="card-body">
          <FormEditarCompra
            watch={watch}
            setValue={setValue}
            data={dataCompra}
            errors={errors}
            register={register}
            onSubmit={handleSubmit(onSubmitEdit)}
          />
        </div>
      </ModalRight>
    </div>
  );
}
