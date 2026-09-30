export function AsistenteIaHome() {
  return (
    <div className="ai-assistant-floating">
      <button
        className="btn btn-primary rounded-pill shadow"
        id="aiAssistantButton"
      >
        <i className="bi bi-robot me-2"></i>Asistente IA
      </button>
      <div className="ai-assistant-card" id="aiAssistantCard">
        <div className="card-header d-flex justify-content-between">
          <span>Asistente del Restaurante</span>
          <button className="btn btn-sm btn-close" id="closeAssistant"></button>
        </div>
        <div className="card-body">
          <div className="ai-message ai-response">
            <p>Hola, ¿en qué puedo ayudarte hoy?</p>
            <small className="text-muted">
              Ejemplo: "¿Qué promociones recomiendas?"
            </small>
          </div>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pregunta al asistente..."
            />
            <button className="btn btn-outline-primary">
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
