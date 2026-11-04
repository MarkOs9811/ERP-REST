import { useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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

function ModalAlertActivar({
  show,
  idActivar,
  nombre,
  handleActivar,
  handleCloseModal,
  tipo,
  loading = false,
}) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = Boolean(loading) || isProcessing;

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsProcessing(true);
    try {
      const success = await handleActivar(idActivar);
      if (success) queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      handleCloseModal();
    } catch (error) {
      console.error("Error al activar:", error);
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
          <AlertDialogMedia className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold">
            ¿Activar este {tipo}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se habilitará nuevamente el acceso para{" "}
            <span className="font-medium text-foreground">
              {nombre || "este registro"}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 rounded-b-xl border-t-0 bg-transparent px-6 pb-6">
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isLoading && <LoaderCircle className="size-4 animate-spin" />}
            {isLoading ? "Activando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ModalAlertActivar;
