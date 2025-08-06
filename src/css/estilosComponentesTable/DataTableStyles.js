const getCustomDataTableStyles = (isDark) => ({
  rows: {
    style: {
      borderLeftWidth: "2px",
      borderLeftStyle: "solid",
      borderLeftColor: isDark ? "#313a46" : "#eaeaea",
      backgroundColor: isDark ? "#1C252E" : "#fff", // Fondo base filas
      color: isDark ? "#cfd8dc" : "#222",
    },
  },
  headCells: {
    style: {
      backgroundColor: isDark ? "#1C252E" : "#fafafa", // Fondo header
      color: isDark ? "#cfd8dc" : "#5a6267",
      fontSize: "15px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "12px",
      borderBottom: isDark ? "2px solid #313a46" : "2px solid #eaeaea",
    },
  },
  header: {
    style: {
      backgroundColor: isDark ? "#1C252E" : "#fafafa",
      color: isDark ? "#cfd8dc" : "#222",
    },
  },
  footer: {
    style: {
      backgroundColor: isDark ? "#1C252E" : "#fafafa",
      color: isDark ? "#cfd8dc" : "#222",
      borderTop: isDark ? "2px solid #313a46" : "2px solid #eaeaea",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDark ? "#1C252E" : "#fff",
      color: isDark ? "#ee5252" : "#333",
      fontSize: "14px",
    },
  },
});
export default getCustomDataTableStyles;
