export const ContenedorPrincipal = ({ children }) => {
  return (
    <div
      className="container-fluid overflow-y-auto overflow-x-hidden pb-4 "
      style={{ marginTop: "120px" }}
    >
      {children}
    </div>
  );
};
