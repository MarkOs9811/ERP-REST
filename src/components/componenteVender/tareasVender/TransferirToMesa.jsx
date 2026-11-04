import { useEffect, useState } from "react";
import axiosInstance from "../../../api/AxiosInstance";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle, MoveRight, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export function TransferirToMesa({ show, handleCloseModal, idMesa, mesa }) {
  const [mesasFree, setMesasFree] = useState([]);
  const [mesaDestino, setMesaDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMesas, setLoadingMesas] = useState(false);
  const [errorRespuesta, setErrorRespuesta] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!show) return undefined;

    let active = true;
    const cargarMesasDisponibles = async () => {
      setLoadingMesas(true);
      setErrorRespuesta(null);
      setMesasFree([]);
      reset();
      setMesaDestino("");

      try {
        const response = await axiosInstance.get("/vender/mesasDisponibles");
        if (!response.data.success) {
          throw new Error(
            response.data.message || "No se pudieron cargar las mesas.",
          );
        }

        if (active) {
          setMesasFree(
            Array.isArray(response.data.mesasFree)
              ? response.data.mesasFree
              : [],
          );
        }
      } catch (error) {
        if (active) {
          setErrorRespuesta(
            error.response?.data?.message ||
              error.message ||
              "No se pudieron cargar las mesas disponibles.",
          );
        }
      } finally {
        if (active) setLoadingMesas(false);
      }
    };

    cargarMesasDisponibles();
    return () => {
      active = false;
    };
  }, [show, idMesa, reset]);

  const onSubmit = async (data) => {
    if (loading || !idMesa) return;

    setLoading(true);
    setErrorRespuesta(null);
    try {
      const response = await axiosInstance.put(
        `/vender/transferirToMesa/${idMesa}`,
        data,
      );
      if (!response.data.success) {
        setErrorRespuesta(
          response.data.message || "No se pudo transferir el pedido.",
        );
        return;
      }

      const numeroDestino = response.data.mesaDestino?.numero;
      ToastAlert(
        "success",
        `¡Transferencia exitosa!<br><b>Mesa ${mesa}</b> → <b>Mesa ${numeroDestino}</b>`,
      );
      queryClient.invalidateQueries({ queryKey: ["mesas"] });
      handleCloseModal();
      navigate("/vender/mesas");
    } catch (error) {
      setErrorRespuesta(
        error.response?.data?.message ||
          "Error interno del servidor. Inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const mesaDestinoSeleccionada = mesasFree.find(
    (item) => String(item.id) === String(mesaDestino),
  );

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open && !loading) handleCloseModal();
      }}
    >
      <DialogContent
        className="gap-5 sm:max-w-md"
        onEscapeKeyDown={(event) => {
          if (loading) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (loading) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Trasladar pedido</DialogTitle>
          <DialogDescription>
            Elige una mesa libre para mover el pedido de la mesa {mesa}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="mb-0 text-xs text-muted-foreground">Mesa actual</p>
              <p className="mb-0 truncate text-lg font-semibold">Mesa {mesa}</p>
            </div>
          </div>
          <MoveRight
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="mb-0 text-xs text-muted-foreground">Destino</p>
              <p className="mb-0 truncate text-lg font-semibold">
                {mesaDestinoSeleccionada
                  ? `Mesa ${mesaDestinoSeleccionada.numero}`
                  : "Por elegir"}
              </p>
            </div>
          </div>
        </div>

        <form
          id="form-transferir-mesa"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="mesaDestino">Mesa de destino</Label>
            <select
              id="mesaDestino"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || loadingMesas || mesasFree.length === 0}
              aria-invalid={Boolean(errors.mesaDestino)}
              {...register("mesaDestino", {
                required: "Selecciona una mesa de destino.",
                onChange: (event) => setMesaDestino(event.target.value),
              })}
            >
              <option value="">
                {loadingMesas
                  ? "Cargando mesas disponibles..."
                  : mesasFree.length
                    ? "Selecciona una mesa"
                    : "No hay mesas disponibles"}
              </option>
              {mesasFree.map((item) => (
                <option key={item.id} value={item.id}>
                  Mesa {item.numero} ·{" "}
                  {item.piso === 1 ? "1.er piso" : `Piso ${item.piso}`}
                </option>
              ))}
            </select>
            {errors.mesaDestino && (
              <p className="mb-0 text-sm text-destructive" role="alert">
                {errors.mesaDestino.message}
              </p>
            )}
          </div>

          {errorRespuesta && (
            <p
              className="mb-0 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {errorRespuesta}
            </p>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-9 gap-2"
              disabled={
                loading ||
                loadingMesas ||
                mesasFree.length === 0 ||
                !mesaDestino
              }
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <MoveRight className="size-4" />
              )}
              {loading ? "Trasladando..." : "Confirmar traslado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
