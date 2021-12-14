import React, { useEffect, useState } from "react";
import { Note, Osc, State } from "../../../interface/state";
import { get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Keyboard } from "../keyboard/keyboard";
import { defaultOsc, OscSelect } from "../osc-select/osc-select";

import "./app.scss";

export const App: React.FC = () => {
  const [state, setState] = useState<State>({
    filters: [],
    notes: [],
    oscillators: [],
  });

  useEffect(() => get("/state").then(setState), []);
  useAfterMountEffect(() => post("/set-state", state), [state]);

  const patchState = (next: Partial<State>) =>
    setState((state) => ({
      ...state,
      ...next,
    }));

  const addOsc = () =>
    patchState({ oscillators: state.oscillators.concat(defaultOsc) });

  const setOsc = (index: number) => (osc: Osc) =>
    patchState({
      oscillators: state.oscillators.map((o, i) => (i === index ? osc : o)),
    });

  const rmOsc = (index: number) =>
    patchState({
      oscillators: state.oscillators.filter((_, i) => i !== index),
    });

  return (
    <div>
      {state.oscillators.map((osc, index) => (
        <div key={JSON.stringify(osc)}>
          <OscSelect osc={osc} onChange={setOsc(index)} />
          <button onClick={() => rmOsc(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addOsc}>Add oscillator</button>

      <div>
        <Keyboard
          notes={state.notes}
          onChange={(notes) => patchState({ notes })}
        />
      </div>
    </div>
  );
};
