import { useEffect, useState } from "react";
import { BannerFidelizacion } from "../componenteCliente/BannerFidelización";
import { CuponActivoHome } from "../componenteCliente/CuponActivo";
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
      className="relative h-[280px] min-h-[260px]"
      aria-label="Promociones"
    >
      <div className="relative h-full">
        <div className="h-full" aria-live="polite" aria-atomic="true">
          {activeSlide === 0 ? (
            <BannerFidelizacion botonAction="ver" />
          ) : (
            <CuponActivoHome />
          )}
        </div>
        <div
          className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-white/60 bg-background/75 p-1 shadow-none backdrop-blur-md dark:border-white/10"
          role="group"
          aria-label="Seleccionar promoción"
        >
          <Button
            type="button"
            onClick={() => setActiveSlide(0)}
            aria-label="Mostrar fidelización"
            aria-pressed={activeSlide === 0}
            variant="ghost"
            className={`h-2 min-w-0 rounded-full p-0 transition-[width,background-color] duration-300 ${
              activeSlide === 0
                ? "w-5 bg-violet-600 hover:bg-violet-600"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
          <Button
            type="button"
            onClick={() => setActiveSlide(1)}
            aria-label="Mostrar cupón activo"
            aria-pressed={activeSlide === 1}
            variant="ghost"
            className={`h-2 min-w-0 rounded-full p-0 transition-[width,background-color] duration-300 ${
              activeSlide === 1
                ? "w-5 bg-emerald-600 hover:bg-emerald-600"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
