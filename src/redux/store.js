import { configureStore } from "@reduxjs/toolkit";
import cajaReducer from "./cajaSlice";
import pedidoReducer from "./pedidoSlice";
import mesaReducer from "./mesaSlice";
import pedidoLlevar from "./pedidoLlevarSlice";
import tipoVentaReducer from "./tipoVentaSlice";
import categoriaReducer from "./categoriaPlatosSlice";
import sideBarReducer from "./sideBarSlice";
import subMenuReducer from "./subMenuSlice";
import pedidoWebReducer from "./pedidoWebSlice";

const store = configureStore({
  reducer: {
    caja: cajaReducer,
    pedido: pedidoReducer,
    mesa: mesaReducer,
    pedidoLlevar: pedidoLlevar,
    tipoVenta: tipoVentaReducer,
    categoriaFiltroPlatos: categoriaReducer,
    sidebar: sideBarReducer,
    subMenu: subMenuReducer,
    pedidoWeb: pedidoWebReducer,
  },
});

export default store;
