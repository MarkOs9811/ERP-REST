// CajaContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CajaContext = createContext();

export const useCaja = () => useContext(CajaContext);

export const CajaProvider = ({ children }) => {
  // 🔹 Caja vendrá de Redux (es lo más confiable)
  const cajaRedux = useSelector((state) => state.caja.caja);

  const [caja, setCaja] = useState(() => {
    const storedCaja = localStorage.getItem("caja");
    return storedCaja ? JSON.parse(storedCaja) : null;
  });

  // 🔹 Mantener sincronizado Redux → Context
  useEffect(() => {
    if (cajaRedux !== undefined) {
      setCaja(cajaRedux);
    }
  }, [cajaRedux]);

  return (
    <CajaContext.Provider value={{ caja, setCaja }}>
      {children}
    </CajaContext.Provider>
  );
};
