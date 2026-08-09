import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCompressed: false,
};

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCompressed = !state.isCompressed;
    },

    setSidebarCompressed: (state, action) => {
      state.isCompressed = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCompressed } = sideBarSlice.actions;

export default sideBarSlice.reducer;
