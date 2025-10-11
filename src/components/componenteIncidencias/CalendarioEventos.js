import Calendario from "./componenteCalendario/Calendario";
import { useState } from "react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { AgregarEvento } from "./AgregarEvento";
import { GetEventos } from "../../service/serviceIncidenciasEventos/GetEventos";
import { useQuery } from "@tanstack/react-query";
import { Plus, PlusIcon } from "lucide-react";

export function CalendarioEventos() {
  const [showModalEvento, setShowModalEvento] = useState(false);

  const {
    data: eventos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eventos"],
    queryFn: GetEventos,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const eventosTransformados = (eventos || []).map((evento) => ({
    id: evento.id,
    title: evento.summary, // FullCalendar espera 'title'
    start: evento.start,
    end: evento.end,
    extendedProps: {
      description: evento.description,
      attendees: evento.attendees,
      status: evento.status,
      html_link: evento.html_link,
      goog_event_id: evento.goog_event_id,
    },
  }));

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex">
        <h4>Calendario de eventos</h4>
        <div className="ms-auto">
          <button
            className="btn btn-outline-dark"
            onClick={() => setShowModalEvento(true)}
          >
            <PlusIcon className="text-auto" /> Crear Evento
          </button>
        </div>
      </div>
      <div className="card-body p-0">
        <Calendario eventos={eventosTransformados} />
      </div>
      <ModalRight
        isOpen={showModalEvento}
        onClose={() => {
          setShowModalEvento(false);
        }}
        title="Crear nuevo evento"
        subtitulo="Programa una reunión o evento"
        submitText="Crear Evento"
        hideFooter={true}
      >
        <div className="moda-body">
          <AgregarEvento />
        </div>
      </ModalRight>
    </div>
  );
}
