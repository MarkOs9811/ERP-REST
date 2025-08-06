import { createSlice } from "@reduxjs/toolkit";

const pedidoLlevarSlice = createSlice({
  name: "pedidoLlevar",
  initialState: {
    items: [],
  },
  reducers: {
    // para agregar un producto o aumetnar en 1
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
      if (existingItem.cantidad > 1) {
        existingItem.cantidad -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    clearPedidoLlevar: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearPedidoLlevar } =
  pedidoLlevarSlice.actions;
export default pedidoLlevarSlice.reducer;
