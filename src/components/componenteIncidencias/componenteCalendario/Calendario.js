import React, { useState } from "react";
import ReactDOM from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import {
  BellRing,
  CalendarDays,
  CheckCheck,
  CheckCheckIcon,
  CircleAlert,
  User,
} from "lucide-react";

const Calendario = ({ eventos }) => {
  const [popover, setPopover] = useState(null);

  const getIconHTML = (type) => {
    const iconContainer = document.createElement("div");

    const iconProps = {
      color: "#2b394b",
      height: "20px",
      width: "20px",
      style: { marginRight: "8px" },
    };

    let icon;
    switch (type) {
      case "meeting":
        icon = <User {...iconProps} />;
        break;
      case "reminder":
        icon = <BellRing {...iconProps} />; // Icono de campana
        break;
      case "alert":
        icon = <CircleAlert {...iconProps} />;
        break;
      case "task":
        icon = <CheckCheck {...iconProps} />;
        break;
      case "deadline":
        icon = <CheckCheckIcon {...iconProps} />;
        break;
      default:
        icon = <CalendarDays {...iconProps} />;
    }

    ReactDOM.render(icon, iconContainer);
    return iconContainer.innerHTML;
  };

  const renderEventContent = (eventInfo) => {
    const eventType = eventInfo.event.extendedProps.type || "default";
    const iconHTML = getIconHTML(eventType);

    return (
      <div
        className="fc-event-content"
        style={{ display: "flex", alignItems: "center" }}
        dangerouslySetInnerHTML={{
          __html: `
          <div style="display: flex; align-items: center; width: 100%;">
            ${iconHTML}
            <div style="flex-grow: 1; overflow: hidden;">
              <div class="fc-event-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                eventInfo.event.title
              }</div>
              <div class="fc-event-time" style="font-size: 0.85em;">
                ${eventInfo.event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                ${
                  eventInfo.event.end
                    ? ` - ${eventInfo.event.end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""
                }
              </div>
            </div>
          </div>
        `,
        }}
      />
    );
  };

  const handleEventClick = (clickInfo) => {
    if (popover) popover.destroy();

    const eventType = clickInfo.event.extendedProps.type || "default";
    const popoverElement = document.createElement("div");
    const iconHTML = getIconHTML(eventType);

    popoverElement.innerHTML = `
      <div class="popover-content" style="max-width: 300px; padding: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          ${iconHTML}
          <div>
            <div style="font-weight: 500; color:rgb(1, 77, 139);">${
              clickInfo.event.title
            }</div>
            <div style="font-size: 0.85em; color:rgb(95, 104, 102);">
              ${clickInfo.event.start.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
              · 
              ${clickInfo.event.start.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              ${
                clickInfo.event.end
                  ? `- ${clickInfo.event.end.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""
              }
            </div>
          </div>
        </div>
        
        ${
          clickInfo.event.extendedProps.description
            ? `
          <div style="margin-bottom: 12px; color: #202124;">
            ${clickInfo.event.extendedProps.description}
          </div>
        `
            : ""
        }
        
        ${
          clickInfo.event.extendedProps.attendees?.length > 0
            ? `
          <div style="display: flex; margin-bottom: 8px;">
            <span style="margin-right: 8px;">${getIconHTML("meeting")}</span>
            <div>
              ${clickInfo.event.extendedProps.attendees
                .map((attendee) => `<div>${attendee}</div>`)
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          clickInfo.event.extendedProps.status
            ? `
          <div style="display: flex; margin-bottom: 8px;">
            <span style="margin-right: 8px;">${getIconHTML("task")}</span>
            <div>${clickInfo.event.extendedProps.status}</div>
          </div>
        `
            : ""
        }
        
        ${
          clickInfo.event.extendedProps.html_link
            ? `
          <div style="margin-top: 12px;">
            <a href="${clickInfo.event.extendedProps.html_link}" 
               target="_blank" 
               rel="noopener noreferrer" 
               style="color: #2b394b; text-decoration: none; font-size: 0.85em;">
              Ver en Google Calendar
            </a>
          </div>
        `
            : ""
        }
      </div>
    `;

    const newPopover = tippy(clickInfo.el, {
      content: popoverElement,
      theme: "google-calendar-tooltip",
      placement: "top",
      trigger: "click",
      interactive: true,
      appendTo: document.body,
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
        eventContent={renderEventContent}
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
          weekday: "long", // Mostrar nombre completo del día
          day: "numeric",
          month: "short",
        }}
        height="auto"
        nowIndicator={true}
        navLinks={true}
        selectable={true}
        dayHeaderClassNames="fc-day-header-google"
        dayCellClassNames="fc-day-cell-google"
        themeSystem="standard"
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendario;
