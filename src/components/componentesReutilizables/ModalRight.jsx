import { LoaderCircle, X } from "lucide-react";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const ModalRight = ({
  isOpen,
  onClose,
  title,
  subtitulo = "",
  children,
  submitText = "Guardar",
  submitIcon = null,
  onSubmit,
  cancelText = "Cancelar",
  onCancel,
  icono = null,
  width = "500px",
  hideFooter = false,
  isLoading = false,
  isSubmitDisabled = false,
  showSubmit = true,
  submitButtonClassName = "",
  cancelButtonClassName = "",
}) => {
  const handleOpenChange = (open) => {
    if (!open && !isLoading) onClose();
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        onEscapeKeyDown={(event) => {
          if (isLoading) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isLoading) event.preventDefault();
        }}
        className="w-full gap-0 border-border/70 bg-background p-0 shadow-2xl sm:max-w-none"
        style={{
          width: `min(100vw, ${width})`,
          maxWidth: "100vw",
        }}
      >
        <SheetHeader className="flex-row items-center justify-between gap-4 border-b border-border/70 bg-background/95 px-5 py-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {icono && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5">
                {icono}
              </span>
            )}
            <div className="min-w-0">
              <SheetTitle className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {capitalizeFirstLetter(title)}
              </SheetTitle>
              {subtitulo && (
                <SheetDescription className="mt-1 line-clamp-2">
                  {subtitulo}
                </SheetDescription>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Cerrar panel"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {typeof children === "function"
            ? children({ handleClose })
            : children}
        </div>

        {!hideFooter && (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/70 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              className={`w-full sm:w-auto ${cancelButtonClassName}`.trim()}
              onClick={onCancel || handleClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            {showSubmit && (
              <Button
                type="button"
                className={`w-full gap-2 sm:w-auto ${submitButtonClassName}`.trim()}
                onClick={onSubmit}
                disabled={isLoading || isSubmitDisabled}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    {submitIcon}
                    {submitText}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ModalRight;
