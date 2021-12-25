import React, { useEffect, useState } from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import { State } from "../../../interface/state";
import { get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Button } from "../button/button";
import { defaultEnvelope, Envelope } from "../envelope/envelope";
import { Filters } from "../filters/filters";
import { Keyboard } from "../keyboard/keyboard";
import { Oscillators } from "../oscillators/oscillators";
import { Panel } from "../panel/panel";

import "./app.scss";

export const App: React.FC = () => {
  const [state, setState] = useState<State>({
    ampEnv: undefined,
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

  const toggleAmpenv = () => {
    patchState({ ampEnv: state.ampEnv ? undefined : defaultEnvelope });
  };

  return (
    <div className="app">
      <div className="app__osc">
        <Oscillators
          oscillators={state.oscillators}
          onChange={(oscillators) => patchState({ oscillators })}
        />
      </div>

      <div className="app__filter">
        <Filters
          filters={state.filters}
          onChange={(filters) => patchState({ filters })}
        />
      </div>

      <div className="app__amp-envelope">
        <Panel
          actions={
            <Button color="dark" onClick={toggleAmpenv}>
              {state.ampEnv ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
          title="Amp. env."
        >
          {state.ampEnv && (
            <Envelope
              envelope={state.ampEnv}
              onChange={(env) => patchState({ ampEnv: env })}
            />
          )}
        </Panel>
      </div>

      <div className="app__keyboard">
        <Keyboard
          notes={state.notes}
          onChange={(notes) => patchState({ notes })}
        />
      </div>
    </div>
  );
};
