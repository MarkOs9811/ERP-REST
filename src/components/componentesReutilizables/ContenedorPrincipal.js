import React from "react";

export const ContenedorPrincipal = ({
  children,
  alturaPersonalizada = "280px",
}) => {
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0"
          style={{ height: `calc(100vh - ${alturaPersonalizada})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
