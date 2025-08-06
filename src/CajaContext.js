// CajaContext.js
import React, { createContext, useContext, useState } from "react";

const CajaContext = createContext();

export const useCaja = () => useContext(CajaContext);

export const CajaProvider = ({ children }) => {
  const [caja, setCaja] = useState(() => {
    const storedCaja = localStorage.getItem("caja");
    return storedCaja ? JSON.parse(storedCaja) : null;
  });

  return (
    <CajaContext.Provider value={{ caja, setCaja }}>
      {children}
    </CajaContext.Provider>
  );
};
