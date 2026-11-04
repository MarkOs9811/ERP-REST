import { useState } from "react";
import { LoaderCircle } from "lucide-react";
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

function ModalGeneral({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo,
  children,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (handleAccion) {
        if (idProceso) {
          await handleAccion(idProceso);
        } else {
          await handleAccion();
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error en confirmación:", error);
      handleCloseModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={Boolean(show)}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleCloseModal();
      }}
    >
      <AlertDialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-md">
        <AlertDialogHeader className="border-b border-border/70 px-6 py-5">
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            {mensaje || "Confirmar acción"}
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Confirma o cancela para continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {(children || cuerpo) && (
          <div className="min-h-0 overflow-y-auto px-6 py-5">
            {children}
            {cuerpo &&
              (typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo)}
          </div>
        )}
        <AlertDialogFooter className="-mx-0 -mb-0 rounded-b-xl border-border/70 px-6 py-4">
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <LoaderCircle className="size-4 animate-spin" />}
            {isLoading ? "Procesando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ModalGeneral;
