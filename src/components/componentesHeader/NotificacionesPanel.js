import { Settings2 } from "lucide-react";
import React, { useState } from "react";

const notificacionesEjemplo = [
  {
    id: 1,
    user: "Deja Brady",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    mensaje: "sent you a friend request",
    tiempo: "a few seconds",
    tipo: "Communication",
    acciones: ["Accept", "Decline"],
    unread: true,
  },
  {
    id: 2,
    user: "Jayvon Hull",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    mensaje: "mentioned you in Minimal UI",
    tiempo: "a day",
    tipo: "Project UI",
    acciones: ["Reply"],
    contenido:
      "@Jaydon Frankie feedback by asking questions or just leave a note of appreciation.",
    unread: true,
  },
  {
    id: 3,
    user: "Lainey Davidson",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    mensaje: "added file to File manager",
    tiempo: "2 days",
    tipo: "File manager",
    archivo: {
      nombre: "design-suriname-2015.mp3",
      peso: "2.3 MB",
    },
    acciones: ["Download"],
    unread: true,
  },
  {
    id: 4,
    user: "Angelique Morse",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    mensaje: "added new tags to File manager",
    tiempo: "3 days",
    tipo: "File manager",
    tags: ["Design", "Dashboard", "Design system"],
    unread: false,
  },
];

export function NotificacionesPanel({ show, onClose }) {
  const [tab, setTab] = useState("all");

  const tabs = [
    { key: "all", label: "All", count: 22 },
    { key: "unread", label: "Unread", count: 12 },
    { key: "archived", label: "Archived", count: 10 },
  ];

  return (
    <div
      className={`offcanvas-end-custom-notify ${show ? "show" : ""}`}
      tabIndex="-1"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 370,
        height: "100vh",
        boxShadow: "0 0 24px rgba(0,0,0,0.12)",
        zIndex: 2100,
        transition: "transform 0.3s",
        transform: show ? "translateX(0)" : "translateX(100%)",
        overflowY: "auto",
      }}
    >
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <h5 className="mb-0 fw-bold">Notificaciones</h5>
        <div className="d-flex align-items-center gap-2">
          <Settings2
            height="20px"
            width="20px"
            color={"auto"}
            style={{ cursor: "pointer" }}
          />
          <button className="btn-close" onClick={onClose}></button>
        </div>
      </div>
      <div className="d-flex gap-2 px-3 py-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm rounded-pill fw-bold ${
              tab === t.key ? "btn-light border" : "btn-link"
            }`}
            style={{ minWidth: 70 }}
            onClick={() => setTab(t.key)}
          >
            {t.label} <span className="badge bg-secondary ms-1">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="notificaciones-panel-list">
        {notificacionesEjemplo.map((n) => (
          <div
            key={n.id}
            className={`px-3 py-3 border-bottom d-flex gap-3 align-items-start ${
              n.unread ? "bg-notify-unread" : ""
            }`}
          >
            <img
              src={n.avatar}
              alt={n.user}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">
                {n.user} <span className="fw-normal">{n.mensaje}</span>
              </div>
              <div className="small text-muted">
                {n.tiempo} · {n.tipo}
              </div>
              {n.contenido && (
                <div className="bg-light rounded-2 p-2 my-2 small">
                  {n.contenido}
                </div>
              )}
              {n.archivo && (
                <div className="bg-light rounded-2 p-2 my-2 d-flex align-items-center justify-content-between">
                  <span>
                    <span className="me-2">{n.archivo.nombre}</span>
                    <span className="text-muted small">{n.archivo.peso}</span>
                  </span>
                  <button className="btn btn-sm btn-outline-primary">
                    Download
                  </button>
                </div>
              )}
              {n.tags && (
                <div className="mt-2">
                  {n.tags.map((tag, i) => (
                    <span key={i} className="badge bg-info text-dark me-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {n.acciones && (
                <div className="mt-2 d-flex gap-2">
                  {n.acciones.map((accion, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${
                        accion === "Accept" || accion === "Reply"
                          ? "btn-dark"
                          : "btn-outline-secondary"
                      }`}
                    >
                      {accion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {n.unread && (
              <span
                className="ms-2 mt-1"
                style={{ color: "#00b8d9", fontSize: 18 }}
              >
                ●
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="text-center py-3">
        <button className="btn btn-link fw-bold text-primary">View all</button>
      </div>
    </div>
  );
}
