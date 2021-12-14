import React, { useEffect, useState } from "react";
import { State } from "../../../interface/state";
import { get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Keyboard } from "../keyboard/keyboard";
import { Oscillators } from "../oscillators/oscillators";

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

  return (
    <div>
      <Oscillators
        oscillators={state.oscillators}
        onChange={(oscillators) => patchState({ oscillators })}
      />

      <div>
        <Keyboard
          notes={state.notes}
          onChange={(notes) => patchState({ notes })}
        />
      </div>
    </div>
  );
};
