import { MinusIcon, PlusIcon } from "lucide-react";

import "../../css/EstilosPlatosTodo.css";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const CardPlatos = ({
  item,
  isSelected,
  handleAdd,
  handleRemove,
  BASE_URL,
  capitalizeFirstLetter,
}) => {
  return (
    <Card
      className={`float-left card-platillo overflow-auto m-2${
        isSelected ? "selected" : ""
      }`}
    >
      <img
        src={item.foto_url}
        alt={item.nombre}
        className="w-full"
        onError={(e) => {
          e.target.src = "/images/img-default.jpg";
        }}
        style={{
          maxWidth: "auto",
          maxHeight: "80px",
          objectFit: "cover",
        }}
      />
      <CardContent className="">
        <span
          className=" text-danger mb-1 d-block opacity-75"
          style={{ fontSize: "0.73rem" }}
        >
          {capitalizeFirstLetter(item.categoria?.nombre || "Sin categoría")}
        </span>

        <p className="nombre-plato mb-3 fw-bold">
          {capitalizeFirstLetter(item.nombre)}
        </p>
        <span className="rounded-pill  px-2 fw-bold precioCard ">
          S/. {item.precio}
        </span>
      </CardContent>
      <CardFooter className="border-0 w-full p-1 flex bg-transparent justify-between">
        {isSelected ? (
          <>
            <Button
              type="button"
              className="btn-accionesPlatos btn-disminuir mx-1"
              onClick={() => handleRemove(item.id)}
             variant="default">
              <span className="me-2">
                <MinusIcon className={"text-auto"} />
              </span>
              1
            </Button>
            <Button
              type="button"
              className="btn-accionesPlatos btn-añadir mx-1"
              onClick={() => handleAdd(item)}
             variant="default">
              <span className="me-2">
                <PlusIcon className={"text-auto"} />
              </span>
              1
            </Button>
          </>
        ) : (
          <Button
            type="button"
            className="btn-accionesPlatos btn-añadir w-100"
            onClick={() => handleAdd(item)}
           variant="default">
            <span className="me-2">
              <PlusIcon className={"text-auto"} />
            </span>
            Agregar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
