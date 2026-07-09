import { useState } from "react";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { CategoriaList } from "../../components/componentePlatos/CategoriaList";

export function CategoriaPlatosCombos() {
  const [upDateList, setUpDateList] = useState(false);
  return (
    <div>
      <CondicionCarga isLoading={upDateList} isError={null}>
        <CategoriaList />
      </CondicionCarga>
    </div>
  );
}
