import React, { useState } from "react"; // <-- Importa React
import { renderToString } from "react-dom/server"; // <-- Para el popover

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "../../../css/EstilosCalendario.css";
import {
  BellRing,
  CalendarDays,
  CheckCheck,
  CheckCheckIcon,
  CircleAlert,
  User,
} from "lucide-react";

/**
 * Función Helper para obtener el componente del icono
 */
const getIconComponent = (type, props = {}) => {
  const iconProps = {
    color: props.color || "#2b394b", // Color por defecto
    height: props.height || "20px",
    width: props.width || "20px",
    style: { marginRight: "8px", flexShrink: 0, ...props.style }, // <-- flexShrink previene que el icono se encoja
  };

  switch (type) {
    case "meeting":
      return <User {...iconProps} />;
    case "reminder":
      return <BellRing {...iconProps} />;
    case "alert":
      return <CircleAlert {...iconProps} />;
    case "task":
      return <CheckCheck {...iconProps} />;
    case "deadline":
      return <CheckCheckIcon {...iconProps} />;
    default:
      return <CalendarDays {...iconProps} />;
  }
};

/**
 * Componente para el contenido del Popover (Tippy)
 */
const EventTooltipContent = ({ event }) => {
  const { title, start, end } = event;
  const { description, attendees, status, html_link, type } =
    event.extendedProps;

  // Icono para la cabecera del popover
  const HeaderIcon = getIconComponent(type, {
    height: "24px",
    width: "24px",
    color: "rgb(1, 77, 139)", // Color azul oscuro
    style: { marginRight: "12px" },
  });

  return (
    <div className="google-calendar-tooltip">
      {/* Cabecera */}
      <div className="tooltip-header">
        {HeaderIcon}
        <div className="tooltip-title-section">
          <h5 className="tooltip-title">{title}</h5>
          <span className="tooltip-time">
            {start.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
            {" · "}
            {start.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {end
              ? ` - ${end.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </span>
        </div>
      </div>

      {/* Descripción */}
      {description && <p className="tooltip-description">{description}</p>}

      {/* Asistentes */}
      {attendees && attendees.length > 0 && (
        <div className="tooltip-section">
          {getIconComponent("meeting", { height: "18px", width: "18px" })}
          <div className="tooltip-attendees">
            {attendees.map((email) => (
              <div key={email}>{email}</div>
            ))}
          </div>
        </div>
      )}

      {/* Estado */}
      {status && (
        <div className="tooltip-section">
          {getIconComponent("task", { height: "18px", width: "18px" })}
          <div>{status}</div>
        </div>
      )}

      {/* Link de Google */}
      {html_link && (
        <a
          href={html_link}
          target="_blank"
          rel="noopener noreferrer"
          className="tooltip-link"
        >
          Ver en Google Calendar
        </a>
      )}
    </div>
  );
};

/**
 * Componente Principal del Calendario
 */
const Calendario = ({ eventos }) => {
  const [popover, setPopover] = useState(null);

  /**
   * Renderizado del contenido del evento (JSX)
   */
  const renderEventContent = (eventInfo) => {
    const eventType = eventInfo.event.extendedProps.type || "default";
    const Icon = getIconComponent(eventType, {
      height: "14px",
      width: "14px",
      style: { marginRight: "4px", flexShrink: 0 },
    });

    return (
      <div className="fc-event-content-custom">
        {Icon}
        <div className="fc-event-details">
          <div className="fc-event-title-custom">{eventInfo.event.title}</div>
          <div className="fc-event-time-custom">
            {eventInfo.event.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {eventInfo.event.end
              ? ` - ${eventInfo.event.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Manejador del clic en el evento (Popover)
   */
  const handleEventClick = (clickInfo) => {
    if (popover) popover.destroy();

    // Renderiza el componente de React a un string HTML
    const popoverHTML = renderToString(
      <EventTooltipContent event={clickInfo.event} />
    );

    const newPopover = tippy(clickInfo.el, {
      content: popoverHTML,
      theme: "google-calendar", // Tema de CSS que añadiremos
      placement: "top",
      trigger: "click",
      interactive: true,
      appendTo: document.body,
      allowHTML: true, // Permite que el contenido sea HTML
      onHidden: () => {
        if (newPopover) newPopover.destroy();
        setPopover(null);
      },
    });

    setPopover(newPopover);
    newPopover.show();
  };

  return (
    <div className="card p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={esLocale}
        events={eventos}
        eventContent={renderEventContent} // <-- Refactorizado
        eventClassNames={(eventInfo) => {
          const eventType = eventInfo.event.extendedProps.type || "default";
          return `fc-event-${eventType}`;
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={true}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }}
        dayHeaderFormat={{
          // <-- Formato más corto y limpio
          weekday: "long",
          day: "numeric",
        }}
        height="auto"
        nowIndicator={true}
        navLinks={true} // <-- Los links siguen funcionando
        selectable={true}
        dayHeaderClassNames="fc-day-header-google"
        dayCellClassNames="fc-day-cell-google"
        themeSystem="standard" // <-- Usamos standard para aplicar nuestro CSS
        eventClick={handleEventClick} // <-- Refactorizado
      />
    </div>
  );
};

export default Calendario;
