import { useState } from "react";
import { Areas } from "../../components/componentesAreasCargos/Areas";
import { Cargos } from "../../components/componentesAreasCargos/Cargos";
import { Sedes } from "../../components/componentesAreasCargos/componetesSedes/Sedes";

export function AreasCargo() {
  const [activeTab, setActiveTab] = useState("areas");

  return (
    <div className="bg-white rounded shadow-sm p-4">
      <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'areas' ? 'active fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('areas')}
            type="button"
          >
            Áreas
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'cargos' ? 'active fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('cargos')}
            type="button"
          >
            Cargos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'sedes' ? 'active fw-bold' : 'text-muted'}`}
            onClick={() => setActiveTab('sedes')}
            type="button"
          >
            Sedes
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'areas' && (
          <div className="animation-fade-in">
            <Areas />
          </div>
        )}
        {activeTab === 'cargos' && (
          <div className="animation-fade-in">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <Cargos />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'sedes' && (
          <div className="animation-fade-in">
            <Sedes />
          </div>
        )}
      </div>
    </div>
  );
}
