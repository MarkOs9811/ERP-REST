import { useState } from "react";
import { Areas } from "../../components/componentesAreasCargos/Areas";
import { Cargos } from "../../components/componentesAreasCargos/Cargos";
import { Sedes } from "../../components/componentesAreasCargos/componetesSedes/Sedes";
import { Button } from "../../components/ui/button";
import { Card } from "@/components/ui/card";


export function AreasCargo() {
  const [activeTab, setActiveTab] = useState("areas");

  return (
    <Card className="p-4">
      <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <Button
            className={`nav-link ${activeTab === "areas" ? "active fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("areas")}
            type="button"
           variant="default">
            Áreas
          </Button>
        </li>
        <li className="nav-item" role="presentation">
          <Button
            className={`nav-link ${activeTab === "cargos" ? "active fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("cargos")}
            type="button"
           variant="default">
            Cargos
          </Button>
        </li>
        <li className="nav-item" role="presentation">
          <Button
            className={`nav-link ${activeTab === "sedes" ? "active fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("sedes")}
            type="button"
           variant="default">
            Sedes
          </Button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "areas" && (
          <div className="animation-fade-in">
            <Areas />
          </div>
        )}
        {activeTab === "cargos" && (
          <div className="animation-fade-in">
            <Cargos />
          </div>
        )}
        {activeTab === "sedes" && (
          <div className="animation-fade-in">
            <Sedes />
          </div>
        )}
      </div>
    </Card>
  );
}
