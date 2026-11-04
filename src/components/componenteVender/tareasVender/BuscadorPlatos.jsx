import { Search, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export function BuscadorPlatos({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className="h-9 rounded-lg pl-9 pr-9"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar productos"
      />
      {searchTerm && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-md text-muted-foreground"
          onClick={() => setSearchTerm("")}
          aria-label="Limpiar búsqueda"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
