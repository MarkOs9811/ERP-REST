import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetLibroMayor } from "../../service/serviceFinanzas/GetLibroMayor";
import { CardCuentaContable } from "../../components/componentesFinanzas/CardCuentasContables";
import { CardResultadoEjercicio } from "../../components/componentesFinanzas/CardResultadoEjercicio";
import "../../css/EstilosFinanzas.css";
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
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["libroMayor"] });
    }

    setLoadingCierre(false);

    // IMPORTANTE: Retornar 'exito' (true/false) para que el Modal sepa si cerrarse
    return exito;
  };
  const registroEjercicio = data.registroEjercicio || null;
  const movimientos = data.movimientos || {};
  const totalDebitos = Number(data.totalDebitos || 0);
  const totalCreditos = Number(data.totalCreditos || 0);
  const balance = Number(data.balance || totalDebitos - totalCreditos);
  const resultado = Number(
    data.resultadoEjercicio ??
      Number(registroEjercicio?.ingresos || 0) -
        Number(registroEjercicio?.gastos || 0),
  );

  const anioCierre = Number(
    registroEjercicio?.temporada || new Date().getFullYear(),
  );
  const sinMovimientos = Object.keys(movimientos).length === 0;

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header p-3 border-0 d-flex align-items-center">
              <BookText
                color={"var(--fw-strawberry)"}
                height="45px"
                width="45px"
              />
              <p className="h4 card-title ms-2 mb-0">Libro Mayor</p>
              <div className="d-flex ms-auto">
                <button
                  className="btn ms-auto mx-2 d-flex align-items-center p-2"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                  }}
                >
                  <ClipboardType className={"mx-2"} />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card p-2">
            <div className="row g-3 p-2">
              <div className="col-md-4">
                <div className="fw-libro-resumen-card">
                  <small>Total Debitos</small>
                  <h4>S/. {totalDebitos.toFixed(2)}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="fw-libro-resumen-card">
                  <small>Total Creditos</small>
                  <h4>S/. {totalCreditos.toFixed(2)}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="fw-libro-resumen-card fw-libro-balance-card">
                  <small>Balance</small>
                  <h4>S/. {balance.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <CardResultadoEjercicio
            registroEjercicio={registroEjercicio}
            resultado={resultado}
          />
        </div>

        <div className="col-md-12">
          <div className="card py-2 border-0 p-2">
            <div className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Cuentas Contables</h5>
              <div className="d-flex" role="group">
                <button
                  className="btn p-2 d-flex align-items-center mx-1"
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
                  className="btn p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1rem" }}
                >
                  <ExternalLink className={"mx-2"} />
                  Aperturar Cuentas
                </button>
                <button
                  className="btn p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  <ExternalLinkIcon />
                </button>
              </div>
            </div>
            {isLoading && (
              <div className="p-3 fw-libro-info-box">
                Cargando libro mayor...
              </div>
            )}

            {isError && (
              <div className="p-3 fw-libro-error-box">
                Error al cargar libro mayor:{" "}
                {error?.message || "Error desconocido"}
              </div>
            )}

            {!isLoading && !isError && sinMovimientos && (
              <div className="p-3 fw-libro-info-box">
                No hay movimientos contables disponibles para mostrar.
              </div>
            )}

            {!isLoading && !isError && !sinMovimientos && (
              <div className="row gap-3 p-3 ">
                {Object.entries(movimientos).map(([nombreCuenta, items]) => (
                  <CardCuentaContable
                    key={nombreCuenta}
                    nombreCuenta={nombreCuenta}
                    items={items}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalAlertQuestion
        show={modalQuestion}
        handleCloseModal={() => setModalQuestion(false)}
        handleEliminar={ejecutarCierre}
        idEliminar={anioCierre}
        pregunta="¿Estás seguro de realizar el"
        tipo="Balance y Cierre"
        nombre={`Año ${anioCierre}`}
      />
    </div>
  );
}
