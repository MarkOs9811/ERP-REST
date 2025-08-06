import React, { useState } from "react";

import { ListaCompras } from "../components/componenteCompras/ListaCompras";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import {
  BanknoteArrowUp,
  CalendarDays,
  Plus,
  ShoppingCart,
  Trophy,
} from "lucide-react";
export function Compras() {
  const [search, setSearch] = useState("");
  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <ShoppingCart color="#f4a261" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Compras</h5>
              <h3 className="fw-bold mb-0">250</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <CalendarDays color="#2a9d8f" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Compras del Mes</h5>
              <h3 className="fw-bold mb-0">1580</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <BanknoteArrowUp color="#e76f51" width="63px" height="63px" />
            <div className="ms-auto text-end">
              <h5 className="fw-light ">Egresos del Mes</h5>
              <h3 className="fw-bold mb-0">S/. 12,500</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <Trophy color="#f4a261" width="63px" height="63px" />
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
                  <Plus color={"auto"} />
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <ListaCompras search={search} />
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
