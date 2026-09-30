import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moduloAplicado: "",
};

const subMenuSlice = createSlice({
  name: "subMenu",
  initialState,
  reducers: {
    subMenuClick: (state, action) => {
      state.moduloAplicado = action.payload;
    },
  },
});

export const { subMenuClick } = subMenuSlice.actions; // ⚠️ CAMBIO: Exportar con el nombre correcto
export default subMenuSlice.reducer;
