const MODULE_ALIASES = {
  almacen: ["almacen"],
  clientes: ["clientes"],
  cocina: ["cocina"],
  delivery: ["delivery"],
  finanzas: ["finanzas"],
  incidencias: ["incidencias"],
  "mis-entregas": ["delivery"],
  platos: ["platos", "productos"],
  rrhh: ["rrhh", "rr-hh", "recursos humanos"],
  ventas: ["ventas", "vender"],
};

export const normalizeModuleName = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getUserModuleNames = (user) => {
  if (!Array.isArray(user?.roles)) return [];

  return user.roles
    .filter((role) => {
      const state = role?.pivot?.estado ?? role?.estado;
      return (
        state == null ||
        !["0", "false", "inactivo", "inactive", "disabled"].includes(
          normalizeModuleName(state),
        )
      );
    })
    .map((role) =>
      normalizeModuleName(
        typeof role === "string" ? role : role?.nombre ?? role?.name,
      ),
    )
    .filter(Boolean);
};

export const hasModuleAccess = (user, moduleName) => {
  const aliases = MODULE_ALIASES[moduleName] ?? [moduleName];
  const enabledModules = new Set(getUserModuleNames(user));

  return aliases.some((alias) =>
    enabledModules.has(normalizeModuleName(alias)),
  );
};

export const isRestaurantBusiness = (configurations) => {
  const saleType = configurations?.find(
    (item) => normalizeModuleName(item?.nombre) === "tipo venta",
  )?.clave;

  return ["restaurante", "comida", "gastronomia"].includes(
    normalizeModuleName(saleType),
  );
};

export const isRestaurantOnlyPath = (path) =>
  path === "/platos" ||
  path.startsWith("/platos/") ||
  path === "/cocina" ||
  path === "/vender/cocina" ||
  path === "/ventas/mesas" ||
  path === "/ventas/reservasMesas" ||
  path === "/ventas/reservasmesas" ||
  path.startsWith("/vender/mesas");

export const isPathAvailableForBusiness = (path, configurations) =>
  !isRestaurantOnlyPath(path) || isRestaurantBusiness(configurations);

export const isModuleAvailableForBusiness = (moduleName, configurations) =>
  !["platos", "cocina"].includes(normalizeModuleName(moduleName)) ||
  isRestaurantBusiness(configurations);
