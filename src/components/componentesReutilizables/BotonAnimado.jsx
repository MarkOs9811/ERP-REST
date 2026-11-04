import { CheckCheck } from "lucide-react";

import { Button } from "../ui/button";

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
  className = "w-auto ms-auto",
  icon = <CheckCheck className="text-current" size={20} />,
  ...props
}) => {
  const isBtnDisabled = loading || disabled;
  const clasesFinal = `${className} inline-flex items-center justify-center gap-2`;

  const handleClick = (e) => {
    if (isBtnDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <Button
      className={clasesFinal}
      type={type}
      onClick={type === "button" ? handleClick : undefined}
      disabled={isBtnDisabled}
      {...props}
      variant="default"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div
            className="inline-block size-4 animate-spin rounded-full border-current border-r-transparent text-current"
            role="status"
            style={{
              width: "1.2rem",
              height: "1.2rem",
              borderWidth: "0.15em",
            }}
          >
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      ) : (
        icon
      )}
      {children}
    </Button>
  );
};

export default BotonAnimado;
