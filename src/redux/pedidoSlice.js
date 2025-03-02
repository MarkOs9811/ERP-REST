import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mesas: {}, // Objeto para almacenar los pedidos por mesa
};

const pedidoSlice = createSlice({
  name: "pedido",
  initialState,
  reducers: {
    // Establecer los platos/pedidos para una mesa específica
    setMesaId: (state, action) => {
      const mesaId = action.payload;
      if (!state.mesas[mesaId]) {
        // Si no existe la mesa, inicializamos la estructura de datos para esa mesa
        state.mesas[mesaId] = { items: [] };
      }
    },

    // Añadir un plato a la mesa
    addItem: (state, action) => {
      const { id, nombre, precio, mesaId } = action.payload;

      // Verificamos si la mesa existe
      if (state.mesas[mesaId]) {
        const existingItem = state.mesas[mesaId].items.find(
          (item) => item.id === id
        );

        if (existingItem) {
          existingItem.cantidad += 1;
        } else {
          state.mesas[mesaId].items.push({ id, nombre, precio, cantidad: 1 });
        }
      }
    },

    // Eliminar un plato de la mesa
    removeItem: (state, action) => {
      const { id, mesaId } = action.payload;

      // Verificamos si la mesa existe
      if (state.mesas[mesaId]) {
        const existingItem = state.mesas[mesaId].items.find(
          (item) => item.id === id
        );

        if (existingItem) {
          if (existingItem.cantidad > 1) {
            existingItem.cantidad -= 1;
          } else {
            state.mesas[mesaId].items = state.mesas[mesaId].items.filter(
              (item) => item.id !== id
            );
          }
        }
      }
    },

    // Limpiar los pedidos de una mesa específica
    clearPedido: (state, action) => {
      const mesaId = action.payload;
      if (state.mesas[mesaId]) {
        state.mesas[mesaId].items = [];
      }
    },
  },
});

export const { setMesaId, addItem, removeItem, clearPedido } =
  pedidoSlice.actions;
export default pedidoSlice.reducer;
