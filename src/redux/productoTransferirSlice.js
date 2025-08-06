import { createSlice } from "@reduxjs/toolkit";

const productoTransferirSlice = createSlice({
  name: "productoTransferir",
  initialState: {
    items: [],
  },
  reducers: {
    // para agregar un producto o aumetnar en 1
    addItem: (state, action) => {
      const {
        id,
        nombre,
        marca,
        descripcion,
        presentacion,
        precioUnit,
        stock,
      } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        state.items.push({
          id,
          nombre,
          cantidad: 1,
          marca,
          descripcion,
          presentacion,
          precioUnit,
          stock,
        });
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
    clearProductoSelececcionado: (state) => {
      state.items = [];
    },
    removeProductoSeleccionado: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
  },
});

export const {
  addItem,
  removeItem,
  clearProductoSelececcionado,
  removeProductoSeleccionado,
} = productoTransferirSlice.actions;
export default productoTransferirSlice.reducer;
