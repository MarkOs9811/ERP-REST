export const ContenedorPrincipal = ({ children }) => {
  return (
    <div
      className="container-fluid overflow-y-auto overflow-x-hidden pb-4"
      style={{ marginTop: "0px" }}
    >
      {children}
    </div>
  );
};
