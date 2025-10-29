import { useState } from "react";
import { NominaUsuarios } from "../../components/componentePlanillas/NominaUsuarios";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import {
  BanknoteArrowUp,
  FileChartColumnIncreasing,
  MessageCircleQuestionMark,
} from "lucide-react";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
import ModalGeneral from "../../components/componenteToast/ModalGeneral";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ValidarNomina } from "../../components/componentePlanillas/componentesAjustesPlanilla/ValidarNomina";

export function Nomina() {
  const [modalQuestionPagar, setModalQuestionPagar] = useState(false);
  const [ModalValidarNomina, setModalValidarNomina] = useState(false);

  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  const generarPago = async () => {
    try {
      const response = await axiosInstance.post("/nomina/generarPago");
      if (response.data.success) {
        ToastAlert("success", "El pago se ha generado correctamente.");
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        ToastAlert("error", error.response.data.message);
      } else {
        ToastAlert("error", "Error al generar el pago: " + error.message);
      }
    }
  };
  return (
    <div>
      <div className="card shadow-sm p-0">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <div className="m-2">
            <h4 className="card-title mb-0 titulo-card-especial">
              Nomina de usuarios
            </h4>
          </div>

          <div className="d-flex align-items-center ">
            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-dark"
                onClick={() => GetReporteExcel("/reporteUsuarios")}
                title="Descargar Reporte de usuarios"
              >
                <FileChartColumnIncreasing className="text-auto" />
              </button>

              <BotonMotionGeneral
                text="Validar Nomina"
                onClick={() => setModalValidarNomina(true)}
                icon={<BanknoteArrowUp className="text-auto" />}
              />
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <NominaUsuarios search={search} updateList={updateList} />
        </div>
      </div>

      <ModalRight
        isOpen={ModalValidarNomina}
        onClose={() => setModalValidarNomina(false)}
        title={"Validar Nomina"}
        subtitulo="Valida los caos para realizar el pago"
        hideFooter={true}
        width="60%"
      >
        {({ handleClose }) => <ValidarNomina onClose={handleClose} />}
      </ModalRight>
      <ModalGeneral
        show={modalQuestionPagar}
        handleCloseModal={() => setModalQuestionPagar(false)}
        mensaje={"¿Estás seguro de generar el pago?"}
        handleAccion={generarPago}
      >
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center gap-3"
          style={{ minHeight: "200px" }}
        >
          <MessageCircleQuestionMark size={60} />
          <p>
            Se realizará el pago del mes a todos los trabajadores según sus días
            trabajados.
          </p>
        </div>
      </ModalGeneral>
    </div>
  );
}
