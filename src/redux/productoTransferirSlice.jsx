import { createSlice } from "@reduxjs/toolkit";

const productoTransferirSlice = createSlice({
  name: "productoTransferir",
  initialState: {
    items: [],
  },
  reducers: {
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
      const stockDisponible = Number(stock ?? existingItem?.stock ?? 0);

      if (existingItem) {
        if (stockDisponible > 0 && existingItem.cantidad >= stockDisponible) {
          return;
        }

        existingItem.cantidad += 1;
      } else {
        if (stockDisponible <= 0) {
          return;
        }

        state.items.push({
          id,
          nombre,
          cantidad: 1,
          marca,
          descripcion,
          presentacion,
          precioUnit: Number(precioUnit) || 0,
          stock: stockDisponible,
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
    setItemCantidad: (state, action) => {
      const { id, cantidad } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (!existingItem) return;

      const stockDisponible = Number(existingItem.stock) || 0;
      if (stockDisponible <= 0) {
        existingItem.cantidad = 1;
        return;
      }

      const cantidadNueva = Math.max(
        1,
        Math.min(Number(cantidad) || 1, stockDisponible),
      );

      existingItem.cantidad = cantidadNueva;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearProductoSelececcionado,
  removeProductoSeleccionado,
  setItemCantidad,
} = productoTransferirSlice.actions;
export default productoTransferirSlice.reducer;
