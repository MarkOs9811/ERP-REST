import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export function BuscadorPlatos({ searchTerm, setSearchTerm }) {
  // 1. Usamos useRef en lugar de getElementById (más limpio y seguro en React)
  const inputRef = useRef(null);

  // 2. Listener optimizado para la tecla F4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors" />

      <Input
        ref={inputRef} // Vinculamos la referencia aquí
        type="search"
        className="h-9 rounded-lg pl-9 pr-9 transition-all"
        placeholder="Buscar productos... (F4)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar productos"
      />

      {/* Botón de limpiar con animación y mejor hover */}
      {searchTerm && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          onClick={() => setSearchTerm("")}
          aria-label="Limpiar búsqueda"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

export default BuscadorPlatos;
