import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { Award, Plus } from "lucide-react"; // Cambié el icono al de tu diseño

export function PlatoMasVendido() {
  const {
    data: ventas = [],
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calcular los platos más vendidos
  const platosVendidos = {};

  ventas.forEach((venta) => {
    const fechaVenta = new Date(venta.created_at);
    const isThisMonth =
      fechaVenta.getMonth() + 1 === currentMonth &&
      fechaVenta.getFullYear() === currentYear;

    if (!isThisMonth) return;

    // 1. Pedidos Mesa / Llevar
    const pedido = venta.pedido;
    if (pedido) {
      const detalles = pedido.detalle_pedidos || pedido.detallePedidos || [];
      detalles.forEach((detalle) => {
        const plato = detalle.producto?.nombre || "Desconocido";
        const foto = detalle.producto?.foto_url || null;
        // Agregamos precio y categoría (ajusta según tu BD)
        const precio = detalle.precio || detalle.producto?.precio || 0;
        const categoria = detalle.producto?.categoria?.nombre || "Fondo";

        if (!platosVendidos[plato]) {
          platosVendidos[plato] = { cantidad: 0, foto, precio, categoria };
        }
        platosVendidos[plato].cantidad += detalle.cantidad;
      });
    }

    // 2. Pedidos Web
    const pedidoWeb = venta.pedido_web || venta.pedidoWeb;
    if (pedidoWeb) {
      const detallesWeb =
        pedidoWeb.detalles_pedido || pedidoWeb.detallesPedido || [];
      detallesWeb.forEach((detalle) => {
        const plato = detalle.plato?.nombre || "Desconocido";
        const foto = detalle.plato?.foto_url || null;
        const precio = detalle.precio || detalle.plato?.precio || 0;
        const categoria = detalle.plato?.categoria?.nombre || "Fondo";

        if (!platosVendidos[plato]) {
          platosVendidos[plato] = { cantidad: 0, foto, precio, categoria };
        }
        platosVendidos[plato].cantidad += detalle.cantidad;
      });
    }
  });

  // Ordenar de mayor a menor
  const todosLosPlatos = Object.entries(platosVendidos).sort(
    (a, b) => b[1].cantidad - a[1].cantidad,
  );

  // Dividimos la lista: Top 3 para arriba, el resto para abajo
  const top3Platos = todosLosPlatos.slice(0, 3);
  const menuSecundario = todosLosPlatos.slice(3);

  return (
    <CondicionCarga isLoading={isLoadingVentas} isError={isErrorVentas}>
      <div className="card  rounded-4 p-4 h-100">
        {/* CABECERA */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
              <Award className="text-warning" size={24} />
              Platos más Vendidos
            </h5>
            <p className="text-muted small mb-0">
              Platos que piden recurrente.
            </p>
          </div>
        </div>

        {top3Platos.length === 0 ? (
          <div className="text-muted text-center py-5">
            No hay órdenes este mes.
          </div>
        ) : (
          <>
            {/* SECCIÓN TOP 3 (TARJETAS GRANDES) */}
            <div className="row g-3 mt-3">
              {top3Platos.map(
                ([plato, { cantidad, foto, precio, categoria }], index) => (
                  <div className="col-12 col-md-4" key={index}>
                    <div className="card h-100 border rounded-4 position-relative">
                      {/* Badge de Ranking Flotante */}
                      <span
                        className={`position-absolute top-0 start-100 translate-middle badge rounded-circle p-2 fs-6 shadow-sm ${
                          index === 0
                            ? "bg-danger"
                            : index === 1
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                        }`}
                        style={{
                          zIndex: 1,
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        #{index + 1}
                      </span>

                      {/* Imagen y Categoría */}
                      <div className="position-relative">
                        <img
                          src={
                            foto || "https://placehold.co/300x200?text=Plato"
                          }
                          className="card-img-top rounded-top-4"
                          alt={plato}
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-3">
                          {categoria}
                        </span>
                      </div>

                      <div className="card-body d-flex flex-column">
                        <h6 className="fw-bold text-dark text-truncate mb-1">
                          {plato}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            {cantidad} órdenes registradas
                          </small>
                          <span
                            className="fw-bold"
                            style={{ color: "var(--fw-emerald, #10b981)" }}
                          >
                            S/ {parseFloat(precio).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* SECCIÓN MENÚ SECUNDARIO (El resto de platos) */}
            {menuSecundario.length > 0 && (
              <div className="mt-5">
                <h6
                  className="text-muted fw-bold mb-3"
                  style={{ letterSpacing: "2px", fontSize: "0.8rem" }}
                >
                  MENÚ SECUNDARIO
                </h6>
                <div className="d-flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {menuSecundario.map(
                    ([plato, { cantidad, foto, precio }], index) => (
                      <div
                        className="card border rounded-4 flex-shrink-0"
                        style={{ width: "260px" }}
                        key={index}
                      >
                        <div className="card-body p-2 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2 overflow-hidden">
                            <img
                              src={
                                foto ||
                                "https://placehold.co/100x100?text=Plato"
                              }
                              className="rounded-3"
                              alt={plato}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div className="d-flex flex-column text-truncate">
                              <h6
                                className="fw-bold mb-0 text-truncate"
                                style={{
                                  fontSize: "0.9rem",
                                  maxWidth: "100px",
                                }}
                              >
                                {plato}
                              </h6>
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {cantidad} órdenes
                              </small>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <div className="d-flex flex-column align-items-end">
                              <span
                                className="fw-bold text-dark"
                                style={{ fontSize: "0.9rem" }}
                              >
                                S/ {parseFloat(precio).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </CondicionCarga>
  );
}
