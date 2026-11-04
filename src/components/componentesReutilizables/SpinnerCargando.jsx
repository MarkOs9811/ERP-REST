export function SpinnerCargando() {
  return (
    <div
      className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 text-auto"
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
