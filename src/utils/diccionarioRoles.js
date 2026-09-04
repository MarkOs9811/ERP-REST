// src/utils/diccionarioRoles.js

export const DICCIONARIO_ROLES = {
  administrador: [
    "administrador",
    "admin",
    "gerente",
    "dueño",
    "propietario",
    "master",
    "superadmin",
    "jefe",
    "director",
  ],
  almacen: [
    "almacen",
    "almacenero",
    "encargado de almacen",
    "jefe de almacen",
    "inventario",
    "logistica",
    "asistente de almacen",
    "bodeguero",
  ],
  ventas: [
    "ventas",
    "cajero",
    "caja",
    "vendedor",
    "jefe de ventas",
    "encargado de caja",
    "facturacion",
    "atencion al cliente",
    "asesor de ventas",
  ],
  cocina: [
    "cocina",
    "cocinero",
    "chef",
    "ayudante de cocina",
    "encargado de cocina",
    "preparacion",
    "maestro",
  ],
  delivery: [
    "delivery",
    "conductor",
    "repartidor",
    "motorizado",
    "despachador",
    "rider",
    "mensajero",
    "chófer",
  ],
  rrhh: [
    "rrhh",
    "recursos humanos",
    "planillas",
    "personal",
    "talento humano",
    "jefe de personal",
    "asistente de rrhh",
  ],
  finanzas: [
    "finanzas",
    "contador",
    "contabilidad",
    "tesoreria",
    "administracion",
    "auditor",
    "tesorero",
    "finanzas y contabilidad",
  ],
  clientes: [
    "clientes",

    "mozo",
    "moso",
    "mesero",
    "anfitrion",
    "salonero",
    "recepcion",
    "servicio",
  ],
  compras: [
    "compras",
    "comprador",
    "adquisiciones",
    "abastecimiento",
    "encargado de compras",
  ],
  proveedores: [
    "proveedores",
    "encargado de proveedores",
    "relaciones comerciales",
  ],
  incidencias: [
    "incidencias",
    "soporte",
    "mantenimiento",
    "supervisor",
    "prevencion",
  ],
  misEntregas: ["misentregas", "mis-entregas"],
};

/**
 * Función que recibe un arreglo de "módulos/categorías" y devuelve
 * un arreglo aplanado con TODAS las variantes de palabras permitidas.
 *
 * Ejemplo: getRolesPermitidos(["almacen", "administrador"])
 * Devuelve: ["almacen", "almacenero", "inventario", ..., "admin", "gerente", ...]
 */
export const getCargosPermitidos = (categoriasPermitidas = []) => {
  let rolesAceptados = [];

  categoriasPermitidas.forEach((categoria) => {
    // Si la categoría existe en el diccionario, sumamos sus variantes
    if (DICCIONARIO_ROLES[categoria]) {
      rolesAceptados = [...rolesAceptados, ...DICCIONARIO_ROLES[categoria]];
    } else {
      // Si por alguna razón pasas un rol que no está en el diccionario, lo agrega tal cual
      rolesAceptados.push(categoria.toLowerCase());
    }
  });

  return rolesAceptados;
};
