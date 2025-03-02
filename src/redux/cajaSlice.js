import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  caja: JSON.parse(localStorage.getItem("caja")) || null,
};

const cajaSlice = createSlice({
  name: "caja",
  initialState,
  reducers: {
    abrirCaja(state, action) {
      state.caja = action.payload;
      localStorage.setItem("caja", JSON.stringify(action.payload));
    },
    cerrarCaja(state) {
      state.caja = null;
      localStorage.removeItem("caja");
    },
  },
});

export const { abrirCaja, cerrarCaja } = cajaSlice.actions;

export default cajaSlice.reducer;
