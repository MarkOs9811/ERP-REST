import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCompressed: true,
};

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      // ⚠️ CAMBIO: Usar "toggleSidebar" en vez de "toggleSideBar"
      state.isCompressed = action.payload;
    },
  },
});

export const { toggleSidebar } = sideBarSlice.actions; // ⚠️ CAMBIO: Exportar con el nombre correcto
export default sideBarSlice.reducer;
