import React from "react";
import { BannerFidelizacion } from "../componenteCliente/BannerFidelización";
import { CuponActivoHome } from "../componenteCliente/CuponActivo";
import "../../css/estilosHome/EstiloFidelizacion.css";

export function CarouselMarketingHome() {
  return (
    <div className="fw-carousel-marketing">
      <div
        id="marketingCarousel"
        className="carousel slide h-100"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#marketingCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
          ></button>
          <button
            type="button"
            data-bs-target="#marketingCarousel"
            data-bs-slide-to="1"
          ></button>
        </div>

        <div className="carousel-inner h-100">
          <div className="carousel-item active h-100" data-bs-interval="5000">
            <BannerFidelizacion botonAction={"ver"} />
          </div>
          <div className="carousel-item h-100" data-bs-interval="5000">
            <CuponActivoHome />
          </div>
        </div>
      </div>
    </div>
  );
}
