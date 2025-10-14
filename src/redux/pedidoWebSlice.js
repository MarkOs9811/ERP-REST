import { createSlice } from "@reduxjs/toolkit";

const pedidoWebSlice = createSlice({
  name: "pedidoWeb",
  initialState: {
    items: [],
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

      if (existingItem) {
        // Verificamos que el item exista antes de modificarlo
        if (existingItem.cantidad > 1) {
          existingItem.cantidad -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }
    },

    clearPedidoWeb: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearPedidoWeb } = pedidoWebSlice.actions;

export default pedidoWebSlice.reducer;
