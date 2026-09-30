import { useState } from "react";
import { CombosList } from "../../components/componentePlatos/CombosList";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

export function Combos() {
  const [upDateList, setUpDateList] = useState(false);
  return (
    <div>
      <CondicionCarga isLoading={upDateList} isError={null}>
        <CombosList />
      </CondicionCarga>
    </div>
  );
}
