import React, { useState } from "react";
import {
  CartOutline,
  CalendarOutline,
  CashOutline,
  TrophyOutline,
  PulseOutline,
  AddOutline,
} from "react-ionicons";
import { ListaCompras } from "../components/componenteCompras/ListaCompras";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export function Compras() {
  const [search, setSearch] = useState("");
  return (
    <div className="container-fluid w-100 h-100 p-2">
      <div className="card bg-transparent flex-grow-1 d-flex flex-column h-100">
        <div
          className="card-body overflow-y-auto overflow-x-hidden"
          style={{
            height: "calc(100vh -480px)",
          }}
        >
          <div className="row g-3">
            <div className="col-md-3 col-sm-12">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                <CartOutline color="#f4a261" width="63px" height="63px" />
                <div className="ms-auto text-end">
                  <h5 className="fw-light ">Compras</h5>
                  <h3 className="fw-bold mb-0">250</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-12">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                <CalendarOutline color="#2a9d8f" width="63px" height="63px" />
                <div className="ms-auto text-end">
                  <h5 className="fw-light ">Compras del Mes</h5>
                  <h3 className="fw-bold mb-0">1580</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-12">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                <CashOutline color="#e76f51" width="63px" height="63px" />
                <div className="ms-auto text-end">
                  <h5 className="fw-light ">Egresos del Mes</h5>
                  <h3 className="fw-bold mb-0">S/. 12,500</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-12">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                <TrophyOutline color="#f4a261" width="63px" height="63px" />
                <div className="ms-auto text-end">
                  <h5 className="fw-light ">Proveedor TOP</h5>
                  <h3 className="fw-bold mb-0">Proveedor ABC</h3>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card p-0 shadow-sm h-100">
                <div className="card-header d-flex justify-content-between">
                  <h3>Compras</h3>
                  <div className="d-flex">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn ms-3">
                      <FontAwesomeIcon icon={faPlus} className="icon" />
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <ListaCompras search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
