export function AreasCargo() {
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="row g-2 ">
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h3>Areas</h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h3>Cargos</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
