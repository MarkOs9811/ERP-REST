import { createSlice } from "@reduxjs/toolkit";

const pedidoLlevarSlice = createSlice({
  name: "pedidoLlevar",
  initialState: {
    items: [],
    descripcion: "", // Nuevo campo para notas generales
  },
  reducers: {
    addItem: (state, action) => {
      const { id, nombre, precio } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        state.items.push({ id, nombre, precio, cantidad: 1 });
      }
    },
    removeItem: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && existingItem.cantidad > 1) {
        existingItem.cantidad -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    // Nueva acción para escribir la nota
    setDescripcion: (state, action) => {
      state.descripcion = action.payload;
    },
    clearPedidoLlevar: (state) => {
      state.items = [];
      state.descripcion = ""; // Limpiamos también la nota
    },
  },
});

export const { addItem, removeItem, clearPedidoLlevar, setDescripcion } =
  pedidoLlevarSlice.actions;
export default pedidoLlevarSlice.reducer;
