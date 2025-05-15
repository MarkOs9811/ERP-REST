import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCompressed: true,
};

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCompressed = !state.isCompressed; // alterna el valor actual
    },
    setSidebarCompressed: (state, action) => {
      state.isCompressed = action.payload; // permite asignar directamente true o false
    },
  },
});

export const { toggleSidebar, setSidebarCompressed } = sideBarSlice.actions; // ⚠️ CAMBIO: Exportar con el nombre correcto
export default sideBarSlice.reducer;
