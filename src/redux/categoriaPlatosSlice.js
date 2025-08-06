import { createSlice } from "@reduxjs/toolkit";

const categoriaPlatosSlice = createSlice({
  name: "CategoriaPlatosSearch",
  initialState: {
    estado: "todo",
  },
  reducers: {
    setEstadoCategoria: (state, action) => {
      state.estado = action.payload;
    },
  },
});

export const { setEstadoCategoria } = categoriaPlatosSlice.actions;
export default categoriaPlatosSlice.reducer;
