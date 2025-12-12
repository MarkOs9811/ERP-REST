import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetLibroMayor } from "../../service/serviceFinanzas/GetLibroMayor";
import { CardCuentaContable } from "../../components/componentesFinanzas/CardCuentasContables";
import { CardResultadoEjercicio } from "../../components/componentesFinanzas/CardResultadoEjercicio";
import {
  BookText,
  ClipboardType,
  ClipboardTypeIcon,
  ExternalLink,
  ExternalLinkIcon,
} from "lucide-react";
import { PostData } from "../../service/CRUD/PostData";
import { useState } from "react";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";

export function LibroMayor() {
  const queryClient = useQueryClient(); // Hook para manipular el cache
  const [loadingCierre, setLoadingCierre] = useState(false);

  const [modalQuestion, setModalQuestion] = useState(false);

  const {
    data = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["libroMayor"],
    queryFn: GetLibroMayor,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Esta función se la pasaremos al Modal
  const ejecutarCierre = async (anioId) => {
    setLoadingCierre(true);

    const payload = {
      anio: anioId, // El modal nos pasará el año aquí
    };

    // Llamada al backend
    const exito = await PostData("finanzas/cierreEjercicio", payload);

    if (exito) {
      // Si funcionó, actualizamos la vista
      queryClient.invalidateQueries(["libroMayor"]);
    }

    setLoadingCierre(false);

    // IMPORTANTE: Retornar 'exito' (true/false) para que el Modal sepa si cerrarse
    return exito;
  };
  const registroEjercicio = data.registroEjercicio;
  const movimientos = data.movimientos || {};
  const resultado = data.resultadoEjercicio;
  const totalDebitos = data.totalDebitos || 0;
  const totalCreditos = data.totalCreditos || 0;
  const balance = data.balance || 0;

  return (
    <div>
      <div className="row g-3">
        {/* Header */}
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
            <div className="card-header p-3 d-flex align-items-center">
              <BookText color={"#ea4f4f"} height="45px" width="45px" />
              <p className="h4 card-title ms-2 mb-0">Libro Mayor</p>
              <div className="d-flex ms-auto">
                <button className="btn btn-outline-secondary ms-auto mx-2 d-flex align-items-center p-2">
                  <ClipboardType className={"mx-2"} />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado del ejercicio */}
        <div className="col-md-12">
          <CardResultadoEjercicio
            registroEjercicio={registroEjercicio}
            resultado={resultado}
          />
        </div>

        {/* Cuentas contables */}
        <div className="col-md-12">
          <div className="card shadow-sm py-2 border-0 p-2">
            <div className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Cuentas Contables</h5>
              <div className="d-flex" role="group">
                <button
                  className="btn btn-outline-dark p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1rem" }}
                  onClick={() => setModalQuestion(true)}
                  disabled={loadingCierre}
                >
                  {loadingCierre ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <ClipboardTypeIcon className={"mx-2"} />
                  )}
                  {loadingCierre ? "Calculando..." : "Balance y Cierre"}
                </button>
                <button
                  className="btn btn-danger p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1rem" }}
                >
                  <ExternalLink className={"mx-2"} />
                  Aperturar Cuentas
                </button>
                <button
                  className="btn btn-warning p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  <ExternalLinkIcon />
                </button>
              </div>
            </div>
            <div className="row gap-3 p-3 ">
              {Object.entries(movimientos).map(([nombreCuenta, items]) => (
                <CardCuentaContable
                  key={nombreCuenta}
                  nombreCuenta={nombreCuenta}
                  items={items}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ModalAlertQuestion
        show={modalQuestion}
        handleCloseModal={() => setModalQuestion(false)}
        handleEliminar={ejecutarCierre}
        idEliminar={new Date().getFullYear()}
        pregunta="¿Estás seguro de realizar el"
        tipo="Balance y Cierre"
        nombre={`Año ${new Date().getFullYear()}`}
      />
    </div>
  );
}
