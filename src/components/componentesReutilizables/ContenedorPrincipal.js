export const ContenedorPrincipal = ({
  children,
  alturaPersonalizada = "280px",
}) => {
  return (
    <div className="container-fluid w-100 h-100 p-0 contenido_cuerpo">
      <div className=" contenido_cuerpo my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden py-2 pb-5  contenido_cuerpo"
          style={{ height: `calc(100vh - ${alturaPersonalizada})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
