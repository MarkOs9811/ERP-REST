import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idPreventaMesa: null,
  numero: null, // Agregamos 'numero' al estado inicial
};

const mesaSlice = createSlice({
  name: "mesa",
  initialState,
  reducers: {
    setIdPreventaMesa: (state, action) => {
      if (typeof action.payload === "object" && action.payload !== null) {
        state.idPreventaMesa = action.payload.id;
        state.numero = action.payload.numero;
      } else {
        state.idPreventaMesa = action.payload;
        state.numero = null;
      }
    },
    clearIdPreventaMesa: (state) => {
      state.idPreventaMesa = null;
      state.numero = null;
    },
  },
});

export const { setIdPreventaMesa, clearIdPreventaMesa } = mesaSlice.actions;
export default mesaSlice.reducer;
