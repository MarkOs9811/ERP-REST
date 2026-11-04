import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Redo2, Trash2, MoreVertical, Edit } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AccionesAlmacenList = ({ row, acciones }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Opciones"
          aria-label="Opciones de almacén"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
          {row.estado == 1 ? (
            <>
              <DropdownMenuItem onSelect={() => acciones.ingresarStock(row)}>
                <FontAwesomeIcon icon={faPlus} />
                Ingresar Stock
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => acciones.editar(row)}>
                <Edit size={16} />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => acciones.eliminar(row.id, row.nombre)}
              >
                <Trash2 size={16} />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => acciones.transferir()}>
                <Redo2 size={16} />
                Transferir
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onSelect={() => acciones.activar(row.id, row.nombre)}
            >
              <FontAwesomeIcon
                icon={faPowerOff}
                className="text-emerald-600 dark:text-emerald-400"
              />
              Activar Producto
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccionesAlmacenList;
