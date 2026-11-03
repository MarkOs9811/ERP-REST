import { MinusIcon, PlusIcon, ShoppingCart, Package } from "lucide-react";
import "../../css/EstilosPlatosTodo.css";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";


export const CardPlatos = ({
  item,
  isSelected,
  handleAdd,
  handleRemove,
  capitalizeFirstLetter,
  esComida = "",
}) => {
  // ==========================================
  //  DISEÑO 1: RESTAURANTE
  // ==========================================
  if (esComida) {
    return (
      <Card
        className={`float-left card-platillo overflow-auto m-2${isSelected ? "selected" : ""}`}
      >
        <img
          src={item.foto_url}
          alt={item.nombre}
          className="w-full"
          onError={(e) => {
            e.target.src = "/images/img-default.jpg";
          }}
          style={{ maxWidth: "auto", maxHeight: "80px", objectFit: "cover" }}
        />
        <CardContent className="">
          <span
            className="text-danger mb-1 d-block opacity-75"
            style={{ fontSize: "0.73rem" }}
          >
            {capitalizeFirstLetter(item.categoria?.nombre || "Sin categoría")}
          </span>
          <p className="nombre-plato mb-3 fw-bold">
            {capitalizeFirstLetter(item.nombre)}
          </p>
          <span className="rounded-pill px-2 mb-3 fw-bold precioCard">
            S/. {item.precio}
          </span>
        </CardContent>
        <CardFooter className="border-0 w-full p-1 flex bg-transparent justify-between">
          {isSelected ? (
            <>
              {/* Aquí se mantiene tu lógica original */}
              <Button
                type="button"
                className="btn-accionesPlatos btn-cerrar mx-1"
                onClick={() => handleRemove(item.id)}
               variant="default">
                <span className="me-2">
                  <MinusIcon className={"text-auto"} />
                </span>{" "}
                1
              </Button>
              <Button
                type="button"
                className="btn-accionesPlatos btn-guardar mx-1"
                onClick={() => handleAdd(item)}
               variant="default">
                <span className="me-2">
                  <PlusIcon className={"text-auto"} />
                </span>{" "}
                1
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="btn-guardar w-100"
              onClick={() => handleAdd(item)}
             variant="default">
              <span className="me-2">
                <PlusIcon className={"text-auto"} />
              </span>{" "}
              Agregar
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // ==========================================
  // DISEÑO 2: TIENDA / RETAIL
  // ==========================================
  return (
    <Card
      className={`float-left card-tienda overflow-hidden m-2${isSelected ? "selected-tienda" : ""}`}
    >
      <div
        className={`badge-stock ${item.stock <= 5 ? "stock-bajo" : "stock-ok"}`}
      >
        <Package size={12} className="me-1" />
        Stock: {item.stock ?? 0}
      </div>

      <div className="img-container-tienda">
        <img
          src={item.foto_url}
          alt={item.nombre}
          className="img-tienda"
          onError={(e) => {
            e.target.src = "/images/img-default.jpg";
          }}
        />
      </div>

      <CardContent className="p-2 flex flex-col text-center">
        <p
          className="nombre-producto-tienda text-truncate mb-1"
          title={item.nombre}
        >
          {capitalizeFirstLetter(item.nombre)}
        </p>
        <span className="precio-tienda mb-2">
          S/. {Number(item.precio).toFixed(2)}
        </span>
      </CardContent>

      <CardFooter className="border-0 p-1 flex bg-transparent justify-center">
        {isSelected ? (
          <div className="d-flex w-100 justify-content-between align-items-center bg-light rounded-pill p-1 shadow-sm border">
            {/* 🔥 CORRECCIÓN: Agregamos "btn" para la estructura base y "btn-icon" para hacerlo círculo perfecto */}
            <Button
              type="button"
              className=" btn-cerrar btn-icon "
              onClick={() => handleRemove(item.id)}
             variant="default">
              <MinusIcon size={16} strokeWidth={3} />
            </Button>

            <span className="fw-bold px-2 text-dark">
              <ShoppingCart size={16} className="text-dark" />
            </span>

            {/* 🔥 CORRECCIÓN: Igual aquí, btn-guardar da el color, btn-icon da la forma circular */}
            <Button
              type="button"
              className="btn-guardar btn-icon"
              onClick={() => handleAdd(item)}
             variant="default">
              <PlusIcon size={16} strokeWidth={3} />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="btn-tienda-add w-100 rounded-pill d-flex align-items-center justify-content-center"
            onClick={() => handleAdd(item)}
            disabled={item.stock <= 0}
           variant="default">
            <ShoppingCart size={16} className="me-2" />
            {item.stock <= 0 ? "Agotado" : "Comprar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
