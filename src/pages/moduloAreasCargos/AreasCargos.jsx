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
      <div
        className="mb-4 flex flex-wrap gap-2 border-b"
        id="pills-tab"
        role="tablist"
        aria-label="Administración de áreas, cargos y sedes"
      >
          <Button
            variant="ghost"
            className={`rounded-b-none border-b-2 border-transparent ${activeTab === "areas" ? "border-primary text-primary font-semibold" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("areas")}
            type="button"
            role="tab"
            aria-selected={activeTab === "areas"}
          >
            Áreas
          </Button>
          <Button
            variant="ghost"
            className={`rounded-b-none border-b-2 border-transparent ${activeTab === "cargos" ? "border-primary text-primary font-semibold" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("cargos")}
            type="button"
            role="tab"
            aria-selected={activeTab === "cargos"}
          >
            Cargos
          </Button>
          <Button
            variant="ghost"
            className={`rounded-b-none border-b-2 border-transparent ${activeTab === "sedes" ? "border-primary text-primary font-semibold" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("sedes")}
            type="button"
            role="tab"
            aria-selected={activeTab === "sedes"}
          >
            Sedes
          </Button>
      </div>

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
