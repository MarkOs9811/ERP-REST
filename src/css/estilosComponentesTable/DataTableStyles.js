const getCustomDataTableStyles = (isDark) => ({
  rows: {
    style: {
      borderLeftWidth: "0",
      borderLeftStyle: "none",
      borderLeftColor: "transparent",
      backgroundColor: isDark ? "#1a202c" : "#ffffff",
      color: isDark ? "#cbd5e1" : "#2d3748",
      borderBottom: isDark ? "1px solid #2d3748" : "1px solid #e2e8f0",
      fontSize: "14px",
    },
    highlightOnHoverStyle: {
      backgroundColor: isDark ? "#262f3d" : "#f7fafc",
      cursor: "pointer",
    },
  },
  headCells: {
    style: {
      backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      color: isDark ? "#94a3b8" : "#4b5563",
      fontSize: "13px",
      fontWeight: "600",
      textAlign: "left",
      padding: "12px 16px",
      borderBottom: isDark ? "1px solid #2d3748" : "1px solid #e2e8f0",
      textTransform: "none",
      letterSpacing: "0",
    },
  },
  header: {
    style: {
      backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      color: isDark ? "#cbd5e1" : "#2d3748",
    },
  },
  footer: {
    style: {
      backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      color: isDark ? "#cbd5e1" : "#2d3748",
      borderTop: isDark ? "1px solid #2d3748" : "1px solid #e2e8f0",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      color: isDark ? "#cbd5e1" : "#2d3748",
      fontSize: "13px",
      borderTop: isDark ? "1px solid #2d3748" : "1px solid #e2e8f0",
    },
  },
});
export default getCustomDataTableStyles;
