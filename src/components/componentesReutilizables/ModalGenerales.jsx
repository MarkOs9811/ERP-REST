import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function ModalGenerales({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo,
  children,
  width = "400px",
  height = "auto",
  showButtons = true,
  textConfirm = "Confirmar",
  textCancel = "Cancelar",
  btnConfirmColor = "",
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!handleAccion) {
      handleCloseModal();
      return;
    }

    setIsLoading(true);
    try {
      const exito = idProceso
        ? await handleAccion(idProceso)
        : await handleAccion();

      if (exito === true) handleCloseModal();
    } catch (error) {
      console.error("Error en modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeButton = (
    <AlertDialogCancel
      variant="ghost"
      size="icon"
      className="absolute right-3 top-3 size-8 rounded-full text-muted-foreground"
      aria-label="Cerrar"
      disabled={isLoading}
    >
      <X className="size-4" />
      <span className="sr-only">Cerrar</span>
    </AlertDialogCancel>
  );

  return (
    <AlertDialog
      open={Boolean(show)}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleCloseModal();
      }}
    >
      <AlertDialogContent
        className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-none"
        style={{
          width: `min(${width}, calc(100vw - 2rem))`,
          maxHeight: height === "auto" ? "90dvh" : `min(${height}, 90dvh)`,
        }}
      >
        {closeButton}
        <AlertDialogHeader
          className={`border-b border-border/70 px-6 py-5 pr-14 ${
            mensaje ? "" : "sr-only"
          }`}
        >
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            {mensaje || "Confirmación"}
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Confirma o cancela para continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="min-h-0 overflow-y-auto px-6 py-5">
          {children
            ? children
            : cuerpo &&
              (typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo)}
        </div>

        {showButtons && (
          <AlertDialogFooter className="-mx-0 -mb-0 rounded-b-xl border-border/70 px-6 py-4">
            <AlertDialogCancel
              disabled={!handleAccion || isLoading}
            >
              {textCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={`gap-2 ${btnConfirmColor}`.trim()}
            >
              {isLoading && <LoaderCircle className="size-4 animate-spin" />}
              {isLoading ? "Procesando..." : textConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ModalGenerales;
