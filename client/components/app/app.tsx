import React, { useEffect, useState } from "react";
import { State } from "../../../interface/osc";
import { defaultOsc, OscSelect } from "../osc-select/osc-select";

export const App: React.FC = () => {
  const [state, setState] = useState<State>({
    filters: [],
    notes: [],
    oscillators: [],
  });
  useEffect(() => {
    fetch("/state")
      .then((res) => res.json())
      .then(setState);
  }, []);

  const addOsc = () =>
    setState((state) => ({
      ...state,
      oscillators: state.oscillators.concat(defaultOsc),
    }));

  useEffect(() => {
    fetch("/set-state", {
      body: JSON.stringify(state),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  }, [state]);

  return (
    <div>
      {state.oscillators.map((osc) => (
        <OscSelect key={JSON.stringify(osc)} {...osc} />
      ))}
      <button onClick={addOsc}>Add oscillator</button>
    </div>
  );
};
