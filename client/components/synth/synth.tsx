import React from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import { State } from "../../../interface/state";
import { Button } from "../button/button";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { defaultDelay, Delay } from "../delay/delay";
import { defaultDistortion, Distortion } from "../distortion/distortion";
import { defaultEnvelope, Envelope } from "../envelope/envelope";
import { defaultFilter, Filter } from "../filter/filter";
import { Keyboard } from "../keyboard/keyboard";
import { Knob } from "../knob/knob";
import { LFOs } from "../LFOs/LFOs";
import { Oscillators } from "../oscillators/oscillators";
import { Panel } from "../panel/panel";
import { Waveform } from "../waveform/waveform";
import "./synth.scss";

export const Synth: React.FC<{
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}> = ({ state, setState }) => {
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

  const toggleDelay = () =>
    patchState({ delay: state.delay ? undefined : defaultDelay });

  return (
    <div className="synth">
      <div className="synth__osc">
        <Oscillators
          oscillators={state.oscillators}
          onChange={(oscillators) => patchState({ oscillators })}
        />
      </div>

      <div className="synth__fx">
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

        <Panel
          actions={
            <Button onClick={toggleDelay} color="dark">
              {state.delay ? <MinusSquare /> : <PlusSquare />}
            </Button>
          }
          verticalHeader={!!state.delay}
          title="Delay"
        >
          {state.delay && (
            <Delay
              delay={state.delay}
              onChange={(delay) => patchState({ delay })}
            />
          )}
        </Panel>

        <LFOs LFOs={state.LFOs} onChange={(LFOs) => patchState({ LFOs })} />
      </div>

      <div className="synth__keyboard">
        <Keyboard
          notes={state.notes}
          onChange={(notes) => patchState({ notes })}
        />
      </div>

      <div className="synth__master">
        <Panel verticalHeader title="Master">
          <ControlStrip>
            <Control label="EQ low">
              <Knob
                centered
                min={-24}
                max={24}
                step={1}
                value={state.EQLow}
                onChange={(EQLow) => patchState({ EQLow })}
              />
            </Control>
            <Control label="EQ high">
              <Knob
                centered
                min={-24}
                max={24}
                step={1}
                value={state.EQHigh}
                onChange={(EQHigh) => patchState({ EQHigh })}
              />
            </Control>
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
                centered
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
