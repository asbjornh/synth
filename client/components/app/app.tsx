import React, { useEffect, useState } from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import { initialState, State } from "../../../interface/state";
import { get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Button } from "../button/button";
import { Control } from "../control-strip/control-strip";
import { defaultEnvelope, Envelope } from "../envelope/envelope";
import { defaultFilter, Filter } from "../filter/filter";
import { Keyboard } from "../keyboard/keyboard";
import { Knob } from "../knob/knob";
import { Oscillators } from "../oscillators/oscillators";
import { Panel } from "../panel/panel";

import "./app.scss";

export const App: React.FC = () => {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => get("/state").then(setState), []);
  useAfterMountEffect(() => post("/set-state", state), [state]);

  const patchState = (next: Partial<State>) =>
    setState((state) => ({
      ...state,
      ...next,
    }));

  const toggleAmpenv = () =>
    patchState({ ampEnv: state.ampEnv ? undefined : defaultEnvelope });

  const toggleFilter = () =>
    patchState({ filter: state.filter ? undefined : defaultFilter });

  const toggleFilterEnv = () =>
    patchState({ filterEnv: state.filterEnv ? undefined : defaultEnvelope });

  return (
    <div className="app">
      <div className="app__osc">
        <Oscillators
          oscillators={state.oscillators}
          onChange={(oscillators) => patchState({ oscillators })}
        />
      </div>

      <div className="app__filters-envs">
        <Panel
          actions={
            <Button color="dark" onClick={toggleAmpenv}>
              {state.ampEnv ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
          verticalHeader={!!state.ampEnv}
          title="Amp env"
        >
          {state.ampEnv && (
            <Envelope
              envelope={state.ampEnv}
              onChange={(env) => patchState({ ampEnv: env })}
            />
          )}
        </Panel>

        <Panel
          title="Filter"
          verticalHeader={!!state.filter}
          actions={
            <Button onClick={toggleFilter} color="dark">
              {state.filter ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
        >
          {state.filter && (
            <Filter
              filter={state.filter}
              onChange={(filter) => patchState({ filter })}
            />
          )}
        </Panel>

        <Panel
          actions={
            <Button onClick={toggleFilterEnv} color="dark">
              {state.filterEnv ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
          verticalHeader={!!state.filterEnv}
          title="Filter env"
        >
          {state.filterEnv && (
            <Envelope
              envelope={state.filterEnv}
              onChange={(env) => patchState({ filterEnv: env })}
            >
              <Control label="Amount">
                <Knob
                  min={-1}
                  max={1}
                  value={state.filterEnvAmt}
                  step={0.001}
                  onChange={(filterEnvAmt) => patchState({ filterEnvAmt })}
                />
              </Control>
            </Envelope>
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
