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
    //HACER QUE CUANDO SE ENTRE A ESTA VISTA QUE SE EJECUTE ESTA BUSQUEA DE NUEVO, PARA QUE SI SE REGRESA A ESTA VISTA SE VEA ACTUALIZADA LA INFORMACIÓN DE LAS MESAS
    refetchOnWindowFocus: true,
  });

  const handleMesaAddPlato = (data) => {
    // Enviamos un ÚNICO objeto como payload
    dispatch(
      setIdPreventaMesa({
        id: data.id,
        numero: data.numero,
      }),
    );
    navigate(`/vender/mesas/platos`);
  };

  const handleShowPedido = (id) => {
    // Como aquí solo tienes el ID, enviamos el numero como null (o búscalo si lo necesitas)
    dispatch(
      setIdPreventaMesa({
        id: id,
        numero: null,
      }),
    );
    navigate(`/vender/mesas/preVenta`);
  };

  // si no es array, inicialízalo vacío
  const listaMesas = Array.isArray(mesas) ? mesas : [];
  return (
    <div className="card  m-0 h-100 overflow-auto">
      <div className="card-header d-flex justify-content-between align-items-center border-bottom m-0">
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
        <div className="card-body overflow-auto p-3">
          {/* 🔥 ESTRUCTURA BOOTSTRAP PARA LA GRILLA */}
          <div className="row g-3">
            {listaMesas.map((mesa) => (
              /* En móvil ocupa 50% (col-6), en tablet 33% (col-md-4), en PC 25% o menos */
              <div key={mesa.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div
                  /* Añadimos h-100 para que todas las tarjetas de la fila midan lo mismo */
                  className={`mesa-card h-100 ${
                    mesa.estado === 1 ? "disponible" : "en-atencion"
                  }`}
                  onClick={() =>
                    mesa.estado === 1
                      ? handleMesaAddPlato(mesa)
                      : handleShowPedido(mesa.id)
                  }
                >
                  {/* ICONO Y NÚMERO DE MESA */}
                  <h6 className="mesa-numero d-flex align-items-center justify-content-center gap-2">
                    <UtensilsCrossed size={18} />
                    Mesa {mesa.numero}
                  </h6>

                  {/* DETALLES DE LA MESA */}
                  <div className="mt-2 px-1 w-100">
                    <p className="d-flex align-items-center gap-2 mb-2 text-truncate">
                      <Layers size={14} />
                      <span>Piso: {mesa.piso}</span>
                    </p>
                    <p className="d-flex align-items-center gap-2 mb-0">
                      <Users size={14} />
                      <span>{mesa.capacidad}</span>
                    </p>
                  </div>

                  {/* ETIQUETA DE ACCIÓN */}
                  <div className="mesa-action-label mt-3">
                    {mesa.estado === 1 ? (
                      <>
                        <PlusCircle size={14} />
                        <span>Abrir</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>VER</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
