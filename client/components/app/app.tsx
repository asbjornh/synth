import React, { useEffect, useState } from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import { initialState, Preset, State } from "../../../interface/state";
import { get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Button } from "../button/button";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { defaultDistortion, Distortion } from "../distortion/distortion";
import { defaultEnvelope, Envelope } from "../envelope/envelope";
import { defaultFilter, Filter } from "../filter/filter";
import { Keyboard } from "../keyboard/keyboard";
import { Knob } from "../knob/knob";
import { Oscillators } from "../oscillators/oscillators";
import { Panel } from "../panel/panel";
import { Presets } from "../presets/presets";
import { Waveform } from "../waveform/waveform";

import "./app.scss";

export const App: React.FC = () => {
  const [state, setState] = useState<State>(initialState);

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

  const toggleDistortion = () =>
    patchState({
      distortion: state.distortion ? undefined : defaultDistortion,
    });

  const setFromPreset = (preset: Preset) => {
    const { displayName, ...state } = preset;
    patchState(state);
  };

  return (
    <div className="app">
      <div className="app__presets">
        <Panel
          actions={<Presets onSelect={setFromPreset} state={state} />}
          title="Presets"
        />
      </div>

      <div className="app__osc">
        <Oscillators
          oscillators={state.oscillators}
          onChange={(oscillators) => patchState({ oscillators })}
        />
      </div>

      <div className="app__fx">
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
                  min={-4}
                  max={4}
                  value={state.filterEnvAmt}
                  step={0.001}
                  onChange={(filterEnvAmt) => patchState({ filterEnvAmt })}
                />
              </Control>
            </Envelope>
          )}
        </Panel>

        <Panel
          actions={
            <Button onClick={toggleDistortion} color="dark">
              {state.distortion ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
          verticalHeader={!!state.distortion}
          title="Distortion"
        >
          {state.distortion && (
            <Distortion
              distortion={state.distortion}
              onChange={(distortion) => patchState({ distortion })}
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

      <div className="app__master">
        <Panel verticalHeader title="Master">
          <ControlStrip>
            <Control label="Gain">
              <Knob
                min={0}
                max={1}
                step={0.01}
                value={state.gain}
                onChange={(gain) => patchState({ gain })}
              />
            </Control>
            <Control label="Transp." title="Transpose (octaves)">
              <Knob
                min={-4}
                max={4}
                step={1}
                value={state.transpose}
                onChange={(transpose) => patchState({ transpose })}
              />
            </Control>
            <Control label="Wave">
              <Waveform />
            </Control>
          </ControlStrip>
        </Panel>
      </div>
    </div>
  );
};
