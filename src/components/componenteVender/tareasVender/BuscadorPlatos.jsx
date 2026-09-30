export function BuscadorPlatos({ searchTerm, setSearchTerm }) {
  return (
    <div>
      <div className="input-group">
        <input
          type="text"
          className="form-control px-4 shadow-none bg-white rounded-pill"
          placeholder="Buscar plato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
