const getVar = (name, fallback) => {
  const body = getComputedStyle(document.body);
  const root = getComputedStyle(document.documentElement);
  const value =
    body.getPropertyValue(name).trim() || root.getPropertyValue(name).trim();
  return value || fallback;
};

const getCustomDataTableStyles = (isDark) => {
  const bgSurface = getVar("--bg-surface", isDark ? "#1b1d1f" : "#ffffff");
  const bgMuted = getVar("--bg-muted", isDark ? "#202428" : "#f8fafc");
  const textMain = getVar("--text-main", isDark ? "#f8fafc" : "#111213");
  const textMuted = getVar("--text-muted", isDark ? "#9ca3af" : "#475569");
  const border = getVar("--fw-border", isDark ? "#2b3137" : "#eef2f7");
  const radiusMd = getVar("--radius-md", "12px");

  return {
    table: {
      style: {
        minHeight: "300px",
        backgroundColor: bgSurface,
        border: `1px solid ${border}`,
        borderRadius: radiusMd,
      },
    },
    rows: {
      style: {
        borderLeftWidth: "0",
        borderLeftStyle: "none",
        borderLeftColor: "transparent",
        backgroundColor: bgSurface,
        color: textMain,
        borderBottom: `1px solid ${border}`,
        fontSize: "13px",
      },
      highlightOnHoverStyle: {
        backgroundColor: bgMuted,
        cursor: "pointer",
      },
    },
    headCells: {
      style: {
        backgroundColor: bgMuted,
        color: textMuted,
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "left",
        padding: "11px 14px",
        borderBottom: `1px solid ${border}`,
        textTransform: "none",
        letterSpacing: "0",
      },
    },
    header: {
      style: {
        backgroundColor: bgMuted,
        color: textMain,
      },
    },
    footer: {
      style: {
        backgroundColor: bgMuted,
        color: textMain,
        borderTop: `1px solid ${border}`,
      },
    },
    pagination: {
      style: {
        backgroundColor: bgMuted,
        color: textMain,
        fontSize: "12px",
        borderTop: `1px solid ${border}`,
      },
    },
  };
};
export default getCustomDataTableStyles;
