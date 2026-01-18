import { useNavigate } from "react-router-dom";
import "../../css/EstilosMesas.css";
import { useDispatch } from "react-redux";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { Eye, Layers, PlusCircle, Users, UtensilsCrossed } from "lucide-react";

export function MesasList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: mesas = [],
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
  });
  console.log("Mesas recibidas:", mesas, Array.isArray(mesas));

  const handleMesaAddPlato = (id) => {
    dispatch(setIdPreventaMesa(id));
    navigate(`/vender/mesas/platos`);
  };
  const handleShowPedido = (id) => {
    dispatch(setIdPreventaMesa(id));

    navigate(`/vender/mesas/preVenta`);
  };

  // si no es array, inicialízalo vacío
  const listaMesas = Array.isArray(mesas) ? mesas : [];
  return (
    <div className="card shadow-sm m-0 h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0 size-auto">Mesas</h3>
        <div className="d-flex align-middle">
          <p className="align-middle  fw-normal">
            {listaMesas.filter((mesa) => mesa.estado === 1).length} Disponibles
            <span
              className="mx-2"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10ba82",
              }}
            ></span>
          </p>
          <span className="fw-normal"> | </span>
          <p className="align-middle mx-2 fw-normal">
            {listaMesas.filter((mesa) => mesa.estado === 0).length} En atención
            <span
              className="mx-2"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            ></span>
          </p>
        </div>
      </div>
      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="mesas-container card-body overflow-auto">
          {listaMesas.map((mesa) => (
            <div
              key={mesa.id}
              // Usamos DIV, no BUTTON, para el contenedor padre
              // Mantenemos tus clases 'mesa-card' y 'm-3'
              // Agregamos 'd-flex flex-column' para organizar el contenido verticalmente
              className={`mesa-card m-3 d-flex flex-column justify-content-between ${
                mesa.estado === 1 ? "disponible" : "en-atencion"
              }`}
              // IMPORTANTE: Quitamos onClick del padre para evitar conflictos
            >
              {/* --- GRUPO 1: TEXTO E INFORMACIÓN --- */}
              {/* Este div ya se ve porque tus estilos CSS .mesa-numero y p tienen z-index: 2 */}
              <div>
                <h6 className="mesa-numero d-flex align-items-center justify-content-center gap-2">
                  <UtensilsCrossed size={18} />
                  Mesa {mesa.numero}
                </h6>

                {/* Contenedor de detalles */}
                <div className="mt-2 px-2">
                  <p className="d-flex align-items-center gap-2 mb-1">
                    <Layers size={16} className="text-secondary" />
                    <span>Piso: {mesa.piso}</span>
                  </p>
                  <p className="d-flex align-items-center gap-2 mb-0">
                    <Users size={16} className="text-secondary" />
                    <span>Capacidad: {mesa.capacidad}</span>
                  </p>
                </div>
              </div>

              {/* --- GRUPO 2: BOTONES DE ACCIÓN --- */}
              {/* CORRECCIÓN: Agregamos zIndex: 2 y position: relative aquí */}
              <div
                className="mt-3 w-auto"
                style={{ position: "relative", zIndex: 2 }}
              >
                {mesa.estado === 1 ? (
                  <button
                    // Botón "Abrir" (Verde oscuro para resaltar sobre el fondo claro)
                    className="btn-activar w-auto px-3 "
                    onClick={() => handleMesaAddPlato(mesa.id)}
                  >
                    <PlusCircle size={18} />
                    ABRIR
                  </button>
                ) : (
                  <button
                    // Botón "Ver" (Rojo para resaltar)
                    className="btn-eliminar w-auto px-3"
                    onClick={() => handleShowPedido(mesa.id)}
                  >
                    <Eye size={18} />
                    VER PEDIDO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CondicionCarga>
    </div>
  );
}
