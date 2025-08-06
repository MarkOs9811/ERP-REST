import { useNavigate } from "react-router-dom";
import "../../css/EstilosMesas.css";
import { useDispatch } from "react-redux";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";

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
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleMesaAddPlato = (id) => {
    dispatch(setIdPreventaMesa(id));
    navigate(`/vender/ventasMesas/platos`);
  };
  const handleShowPedido = (id) => {
    dispatch(setIdPreventaMesa(id));
    navigate(`/vender/ventasMesas/preVenta`);
  };

  if (loading) return <p>Cargando mesas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="card flex-grow-1 d-flex flex-column shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center p-4">
        <h3 className="m-0 size-auto">Mesas</h3>
        <div className="d-flex align-middle">
          <p className="align-middle mx-2 fw-normal">
            {mesas.filter((mesa) => mesa.estado === 1).length} Disponibles
            <span
              className="mx-2"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10ba82",
              }}
            ></span>{" "}
          </p>
          <span className="fw-normal"> | </span>
          <p className="align-middle mx-2 fw-normal">
            {mesas.filter((mesa) => mesa.estado === 0).length} En atención
            <span
              className="mx-2"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            ></span>{" "}
          </p>
        </div>
      </div>

      <div className="mesas-container card-body overflow-y-auto overflow-x-hidden">
        {mesas.map((mesa) => (
          <button
            key={mesa.id}
            className={`mesa-card m-3 ${
              mesa.estado === 1 ? "disponible" : "en-atencion"
            }`}
            onClick={() =>
              mesa.estado === 1
                ? handleMesaAddPlato(mesa.id)
                : handleShowPedido(mesa.id)
            }
          >
            <h6 className="mesa-numero">Mesa {mesa.numero}</h6>

            <p>Piso: {mesa.piso}</p>
            <p>Capacidad: {mesa.capacidad}</p>
            <p>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: mesa.estado === 1 ? "#10ba82" : "red",
                }}
              ></span>{" "}
              <span
                className={`fw-bold ${
                  mesa.estado === 1 ? "text-success" : "text-danger"
                }`}
              >
                {mesa.estado === 1 ? "Disponible" : "En atención"}
              </span>
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
