import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Redo2, Trash2, MoreVertical, Edit } from "lucide-react";

const AccionesAlmacenList = ({ row, acciones }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Evita que el clic se pase a la fila
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="dropdown"
      onMouseLeave={() => setIsOpen(false)} // Se cierra solo si quitas el mouse
      style={{ position: "relative" }}
    >
      <button
        className="btn btn-sm p-2 border-0 z-index-1000"
        onClick={toggleMenu}
        title="Opciones"
      >
        <MoreVertical size={18} />
      </button>

      {/* Forzamos a que se muestre si isOpen es true */}
      {isOpen && (
        <ul
          className="dropdown-menu shadow border rounded-3 show z-index-1000"
          style={{
            position: "absolute",
            right: "0", // Lo alinea a la derecha para que no se salga de la pantalla
            top: "100%",
          }}
        >
          {row.estado == 1 ? (
            <>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => acciones.ingresarStock(row)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Ingresar Stock
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => acciones.editar(row)}
                >
                  <Edit size={16} />
                  Editar
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => acciones.eliminar(row.id, row.nombre)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => acciones.transferir()}
                >
                  <Redo2 size={16} />
                  Transferir
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => acciones.activar(row.id, row.nombre)}
              >
                <FontAwesomeIcon icon={faPowerOff} className="text-success" />
                Activar Producto
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AccionesAlmacenList;
