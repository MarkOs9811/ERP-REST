import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Leemos el localStorage solo una vez al levantar la aplicación
  user:
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      // Actualizamos el storage al mismo tiempo que el estado global
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
