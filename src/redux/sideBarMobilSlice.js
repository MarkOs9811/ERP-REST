import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCompressedMobile: false,
};

const sideBarmobileSlice = createSlice({
  name: "sidebarMobile",
  initialState,
  reducers: {
    toggleSidebarMobile: (state) => {
      state.isCompressedMobile = !state.isCompressedMobile; // alterna el valor actual
    },
    setSidebarMobileCompressed: (state, action) => {
      state.isCompressedMobile = action.payload; // permite asignar directamente true o false
    },
  },
});

export const { toggleSidebarMobile, setSidebarMobileCompressed } =
  sideBarmobileSlice.actions;
export default sideBarmobileSlice.reducer;
