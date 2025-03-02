import { createSlice } from "@reduxjs/toolkit";

// Slice para manejar el estado "tipoVenta"
const tipoVentaSlice = createSlice({
  name: "tipoVenta",
  initialState: {
    estado: "mesa", // Estado inicial
  },
  reducers: {
    // Cambiar estado a "llevar"
    setLlevar: (state) => {
      state.estado = "llevar";
    },
    // Cambiar estado a "mesa"
    setMesa: (state) => {
      state.estado = "mesa";
    },
    // Cambiar estado dinámicamente
    setEstado: (state, action) => {
      state.estado = action.payload; // El payload contiene "llevar" o "mesa"
    },
  },
});

// Exportar acciones y reducer
export const { setLlevar, setMesa, setEstado } = tipoVentaSlice.actions;
export default tipoVentaSlice.reducer;
