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
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <Card className="">
            <CardHeader className="p-3 border-0 flex items-center">
              <BookText
                color={"var(--fw-strawberry)"}
                height="45px"
                width="45px"
              />
              <CardTitle asChild>
                <p className="h4 ms-2 mb-0">Libro Mayor</p>
              </CardTitle>
              <div className="flex ms-auto">
                <Button
                  className="mx-2 flex items-center justify-center gap-2 p-2"
                  variant="ghostOutline"
                >
                  <ClipboardType className={"mx-2"} />
                  Generar Reporte
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="col-span-full md:col-span-12">
          <Card className="p-2">
            <div className="grid grid-cols-12 gap-3 p-2">
              <div className="col-span-full md:col-span-4">
                <div className="fw-libro-resumen-card">
                  <small>Total Debitos</small>
                  <h4>S/. {totalDebitos.toFixed(2)}</h4>
                </div>
              </div>
              <div className="col-span-full md:col-span-4">
                <div className="fw-libro-resumen-card">
                  <small>Total Creditos</small>
                  <h4>S/. {totalCreditos.toFixed(2)}</h4>
                </div>
              </div>
              <div className="col-span-full md:col-span-4">
                <div className="fw-libro-resumen-card fw-libro-balance-card">
                  <small>Balance</small>
                  <h4>S/. {balance.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-full md:col-span-12">
          <CardResultadoEjercicio
            registroEjercicio={registroEjercicio}
            resultado={resultado}
          />
        </div>

        <div className="col-span-full md:col-span-12">
          <Card className="border-0 p-2">
            <div className="flex justify-between items-center p-3">
              <h5 className="mb-0">Cuentas Contables</h5>
              <div className="flex" role="group">
                <Button
                  className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 p-2 flex items-center mx-1"
                  style={{ fontSize: "1rem" }}
                  onClick={() => setModalQuestion(true)}
                  disabled={loadingCierre}
                  variant="default"
                >
                  {loadingCierre ? (
                    <span className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"></span>
                  ) : (
                    <ClipboardTypeIcon className={"mx-2"} />
                  )}
                  {loadingCierre ? "Calculando..." : "Balance y Cierre"}
                </Button>
                <Button
                  className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 p-2 flex items-center mx-1"
                  style={{ fontSize: "1rem" }}
                  variant="default"
                >
                  <ExternalLink className={"mx-2"} />
                  Aperturar Cuentas
                </Button>
                <Button
                  className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 p-2 flex items-center mx-1"
                  style={{ fontSize: "1.2rem" }}
                  variant="default"
                >
                  <ExternalLinkIcon />
                </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4gap-3 p-3">
                {Object.entries(movimientos).map(([nombreCuenta, items]) => (
                  <CardCuentaContable
                    key={nombreCuenta}
                    nombreCuenta={nombreCuenta}
                    items={items}
                  />
                ))}
              </div>
            )}
          </Card>
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
