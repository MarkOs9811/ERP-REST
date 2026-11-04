import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Lock,
  RotateCcw,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import axiosInstance from "../api/AxiosInstance";
import ModalGenerales from "../components/componentesReutilizables/ModalGenerales";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { BadgeComponent } from "../components/componentesReutilizables/BadgeComponent";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Función para generar un código aleatorio de 6 caracteres
const generarCodigoAleatorio = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export function ConfiguracionGeneral() {
  const navigate = useNavigate();

  // Estados generales del modal
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  // Estados de los inputs
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputCodigo, setInputCodigo] = useState("");

  // Estados de validación y control
  const [codigoSeguridad, setCodigoSeguridad] = useState("");
  const [progreso, setProgreso] = useState(0);

  // Al abrir el modal, reiniciamos todo el estado como fábrica
  useEffect(() => {
    if (showModal) {
      setCodigoSeguridad(`RESETEAR-${generarCodigoAleatorio()}`);
      setStep(1);
      setInputCodigo("");
      setPassword("");
      setProgreso(0);
      setShowPassword(false);
    }
  }, [showModal]);

  const reiniciarMutation = useMutation({
    mutationFn: async (pwd) => {
      const response = await axiosInstance.post(
        "/superadmin/reiniciarSistema",
        { password: pwd },
      );
      return response.data;
    },
    onSuccess: (data) => {
      ToastAlert("success", data.message || "¡Sistema reiniciado de fábrica!");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/masterAdmin/login");
    },
    onError: (error) => {
      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error crítico en el servidor.";
      ToastAlert("error", mensaje);
    },
  });

  const ejecutarReinicio = async () => {
    // --- LÓGICA DEL PASO 1 (Verificar Código) ---
    if (step === 1) {
      if (inputCodigo !== codigoSeguridad) {
        ToastAlert(
          "warning",
          "El código de seguridad no coincide. Escríbelo exactamente igual.",
        );
        return false;
      }
      setStep(2);
      return false;
    }

    // --- LÓGICA DEL PASO 2 (Verificar Contraseña y Ejecutar) ---
    if (step === 2) {
      if (!password.trim()) {
        ToastAlert("warning", "La contraseña de SuperAdmin es obligatoria.");
        return false;
      }

      setProgreso(10);
      const progressInterval = setInterval(() => {
        setProgreso((prev) => {
          if (prev < 90) return prev + Math.floor(Math.random() * 10) + 2;
          return prev;
        });
      }, 400);

      try {
        await reiniciarMutation.mutateAsync(password);

        clearInterval(progressInterval);
        setProgreso(100);
        await new Promise((resolve) => setTimeout(resolve, 500));

        return true;
      } catch (error) {
        clearInterval(progressInterval);
        setProgreso(0);
        return false;
      }
    }
  };

  const handleClose = () => {
    if (reiniciarMutation.isPending) return;
    setShowModal(false);
  };

  const renderCuerpoModal = () => (
    <div className="flex flex-col gap-3 m-3">
      <div className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 flex items-start gap-2 m-0 border-0 bg-destructive/10 text-destructive">
        <AlertTriangle size={24} className="shrink-0 mt-1" />
        <p className="m-0 text-sm">
          <strong>¡Peligro Inminente!</strong> Esta acción vaciará todas las
          tablas operativas (ventas, pedidos, cajas, etc.) y eliminará las
          empresas registradas. Solo se conservarán los catálogos (ubigeo,
          roles, cargos) y tu cuenta de SuperAdmin.
        </p>
      </div>

      <div className="form-group mt-2">
        <label className="font-bold mb-2 flex items-center gap-2 flex-wrap">
          {step === 1 ? (
            <ShieldAlert size={18} className="text-destructive" />
          ) : (
            <ShieldCheck
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
            />
          )}
          {step === 1
            ? "Para continuar, escribe este código:"
            : "Código verificado:"}

          {step === 1 && (
            <BadgeComponent
              label={codigoSeguridad}
              variant="danger"
              className="select-all text-base px-2"
            />
          )}
        </label>

        {/* Input con tamaño normal (sin -lg) */}
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${step === 2 ? "border-emerald-500 focus-visible:ring-emerald-500 bg-muted text-emerald-700 dark:text-emerald-400 font-bold" : ""}`}
          placeholder="Escribe el código aquí..."
          value={inputCodigo}
          onChange={(e) => setInputCodigo(e.target.value.toUpperCase())}
          disabled={step === 2 || reiniciarMutation.isPending}
          autoComplete="off"
          style={{ letterSpacing: step === 2 ? "1px" : "normal" }}
        />
      </div>

      {step === 2 && (
        <div
          className="form-group mt-1"
          style={{ animation: "fadeIn 0.4s ease-in-out" }}
        >
          <hr className="text-muted-foreground opacity-25 my-3" />
          <label className="font-bold mb-2 flex items-center gap-2">
            <Lock size={16} /> Contraseña de SuperAdmin:
          </label>
          {/* Quitamos input-group-lg para que el grupo y el botón mantengan el tamaño normal */}
          <div className="flex w-full items-stretch">
            <input
              type={showPassword ? "text" : "password"}
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tu contraseña secreta..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={reiniciarMutation.isPending}
              autoFocus
            />
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={reiniciarMutation.isPending}
              variant="default"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </div>
      )}

      {reiniciarMutation.isPending && (
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-sm font-bold text-muted-foreground">
            <span>Eliminando registros de empresas...</span>
            <span>{progreso > 100 ? 100 : progreso}%</span>
          </div>
          <div className="progress" style={{ height: "12px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-destructive"
              role="progressbar"
              style={{ width: `${progreso}%`, transition: "width 0.4s ease" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="border-destructive mb-4 shadow-sm">
      <CardHeader className="bg-destructive text-white flex items-center gap-2 py-3">
        <AlertTriangle size={20} />
        <CardTitle asChild>
          <h5 className="m-0 font-bold">
            Zona de Peligro: Reinicio del Sistema
          </h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-muted-foreground mb-4">
          Utiliza esta opción únicamente para restablecer el sistema a su estado
          de fábrica antes de entregarlo a un nuevo cliente. Se vaciarán todas
          las transacciones y empresas, pero se mantendrán las configuraciones
          estructurales.
        </p>
        <Button
          className="justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 flex items-center gap-2 font-medium px-4"
          onClick={() => setShowModal(true)}
          variant="destructive"
        >
          <RotateCcw size={18} />
          Reiniciar Base de Datos
        </Button>
      </CardContent>

      <ModalGenerales
        show={showModal}
        handleCloseModal={handleClose}
        handleAccion={ejecutarReinicio}
        mensaje="¿Restablecer de fábrica?"
        width="520px"
        textConfirm={step === 1 ? "Verificar Código" : "Sí, vaciar sistema"}
        // Tus clases y configuraciones originales de botones
        btnConfirmColor={
          step === 1
            ? "bg-foreground text-background"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }
        textCancel="Cancelar"
      >
        {renderCuerpoModal()}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </ModalGenerales>
    </Card>
  );
}
