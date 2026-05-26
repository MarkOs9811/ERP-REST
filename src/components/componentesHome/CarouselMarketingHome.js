import React from "react";
import { BannerFidelizacion } from "../componenteCliente/BannerFidelización";
import { CuponActivoHome } from "../componenteCliente/CuponActivo";

export function CarouselMarketingHome() {
  return (
    <div className="fw-carousel-marketing h-100">
      <div
        id="marketingCarousel"
        className="carousel slide h-100"
        data-bs-ride="carousel"
      >
        {/* Indicadores (Puntitos abajo) */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#marketingCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#marketingCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner h-100">
          {/* Slide 1: Tu Banner Original */}
          <div className="carousel-item active h-100" data-bs-interval="5000">
            {/* Asegúrate de que BannerFidelizacion tenga un height 100% en su CSS para que ocupe todo el alto */}
            <BannerFidelizacion botonAction={"ver"} />
          </div>

          {/* Slide 2: Campañas y Cupones */}
          <div className="carousel-item h-100" data-bs-interval="5000">
            <CuponActivoHome />
          </div>
        </div>
      </div>
    </div>
  );
}
