export function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="card p-3 border-0 shadow-sm">
            <h2 className="titulo-card-especial">
              Hola {user.empleado.persona.nombre}
            </h2>
            <small>En este sistema puedes gestioanr tu empresa.</small>
          </div>
        </div>
      </div>
    </div>
  );
}
