import { useState } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function ModalAlertQuestion({
  show,
  idEliminar,
  nombre,
  handleEliminar,
  handleCloseModal,
  tipo,
  pregunta = "¿Estás seguro de eliminar este",
  loading = false,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = Boolean(loading) || isProcessing;

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsProcessing(true);
    try {
      await handleEliminar(idEliminar);
      handleCloseModal();
    } catch (error) {
      console.error("Error al eliminar:", error);
      handleCloseModal();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog
      open={Boolean(show)}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleCloseModal();
      }}
    >
      <AlertDialogContent className="gap-5 p-6 sm:max-w-md">
        <AlertDialogHeader className="place-items-center text-center sm:place-items-center sm:text-center">
          <AlertDialogMedia className="size-12 rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold">
            {pregunta} {tipo}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción puede afectar los datos relacionados con{" "}
            <span className="font-medium text-foreground">
              {nombre || "este registro"}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 rounded-b-xl border-t-0 bg-transparent px-6 pb-6">
          <AlertDialogCancel disabled={isLoading}>
            {isLoading ? "Espere..." : "Cancelar"}
          </AlertDialogCancel>
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

export default ModalAlertQuestion;
