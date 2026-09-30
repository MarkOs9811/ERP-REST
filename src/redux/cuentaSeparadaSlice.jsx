import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idMesa: null, // CORREGIDO: Usamos idMesa para coincidir con el reducer
  itemsSeleccionados: [], // CORREGIDO: Agregamos el array vacío inicial
};

const cuentaSeparadaSlice = createSlice({
  name: "cuentaSeparada",
  initialState,
  reducers: {
    setMesaSeparada: (state, action) => {
      state.idMesa = action.payload;
      state.itemsSeleccionados = [];
    },

    // Agregamos o actualizamos platos
    setItemSeleccionado: (state, action) => {
      const { id, plato, cantidad, precio } = action.payload;

      const existingItem = state.itemsSeleccionados.find(
        (item) => item.id === id,
      );

      if (existingItem) {
        // CORREGIDO: Usamos '=' en lugar de '+=' para que el input sea exacto
        existingItem.cantidad = cantidad;
        existingItem.subtotal = existingItem.cantidad * existingItem.precio;
      } else {
        state.itemsSeleccionados.push({
          id,
          plato,
          cantidad,
          precio,
          subtotal: cantidad * precio,
        });
      }
    },

    removeitemSeparado: (state, action) => {
      const idEliminar = action.payload;
      state.itemsSeleccionados = state.itemsSeleccionados.filter(
        (item) => item.id !== idEliminar,
      );
    },

    clearCuentaSeparada: (state) => {
      state.idMesa = null;
      state.itemsSeleccionados = [];
    },
  },
});

export const {
  setMesaSeparada,
  setItemSeleccionado,
  removeitemSeparado,
  clearCuentaSeparada,
} = cuentaSeparadaSlice.actions;

export default cuentaSeparadaSlice.reducer;
