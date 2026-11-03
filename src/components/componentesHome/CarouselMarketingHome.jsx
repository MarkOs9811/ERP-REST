import { useEffect, useState } from "react";
import { BannerFidelizacion } from "../componenteCliente/BannerFidelización";
import { CuponActivoHome } from "../componenteCliente/CuponActivo";
import "../../css/estilosHome/EstiloFidelizacion.css";
import { Button } from "../ui/button";

export function CarouselMarketingHome() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % 2);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      className="fw-carousel-marketing relative h-[280px] min-h-[260px]"
      aria-label="Promociones"
    >
      <div className="h-full">
        <div className="h-full" aria-live="polite">
          {activeSlide === 0 ? (
            <BannerFidelizacion botonAction="ver" />
          ) : (
            <CuponActivoHome />
          )}
        </div>
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          <Button
            type="button"
            onClick={() => setActiveSlide(0)}
            aria-label="Mostrar fidelización"
            aria-current={activeSlide === 0 ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              activeSlide === 0 ? "w-6 bg-slate-800" : "w-2 bg-slate-400"
            }`}
           variant="default"/>
          <Button
            type="button"
            onClick={() => setActiveSlide(1)}
            aria-label="Mostrar cupón activo"
            aria-current={activeSlide === 1 ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              activeSlide === 1 ? "w-6 bg-slate-800" : "w-2 bg-slate-400"
            }`}
           variant="default"/>
        </div>
      </div>
    </section>
  );
}
