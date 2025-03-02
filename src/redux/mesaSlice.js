import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idPreventaMesa: null, // Estado inicial
};

const mesaSlice = createSlice({
  name: "mesa",
  initialState,
  reducers: {
    setIdPreventaMesa: (state, action) => {
      state.idPreventaMesa = action.payload;
    },
    clearIdPreventaMesa: (state) => {
      state.idPreventaMesa = null;
    },
  },
});

export const { setIdPreventaMesa, clearIdPreventaMesa } = mesaSlice.actions;
export default mesaSlice.reducer;
