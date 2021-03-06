import React, { useCallback } from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import { Note, NoteDescriptor, UIState } from "../../../interface/state";
import { Button } from "../button/button";
import { Compressor, defaultCompressor } from "../compressor/compressor";
import { defaultDelay, Delay } from "../delay/delay";
import { defaultDistortion, Distortion } from "../distortion/distortion";
import { Envelopes } from "../envelopes/envelopes";
import { defaultFilter, Filter } from "../filter/filter";
import { defaultFMOsc, FMOsc } from "../fm-osc/fm-osc";
import { FMOscillators } from "../fm-oscillators/fm-oscillators";
import { KeyInput } from "../key-input/key-input";
import { LFOs } from "../LFOs/LFOs";
import { Master } from "../master/master";
import { Oscillators } from "../oscillators/oscillators";
import { Panel } from "../panel/panel";
import "./synth.scss";

const Toggle: React.FC<{ active: boolean; onClick: () => void }> = ({
  active,
  onClick,
}) => (
  <Button onClick={onClick} color="dark">
    {active ? <MinusSquare /> : <PlusSquare />}
  </Button>
);

export const Synth: React.FC<{
  state: UIState;
  setState: React.Dispatch<React.SetStateAction<UIState>>;
  notes: NoteDescriptor[];
  setNotes: React.Dispatch<React.SetStateAction<NoteDescriptor[]>>;
}> = ({ state, setState, notes, setNotes }) => {
  const patchState = (next: Partial<UIState>) =>
    setState((state) => ({
      ...state,
      ...next,
    }));

  const toggleFilter = () =>
    patchState({ filter: state.filter ? undefined : defaultFilter });

  const toggleDistortion = () =>
    patchState({
      distortion: state.distortion ? undefined : defaultDistortion,
    });

  const toggleDelay = () =>
    patchState({ delay: state.delay ? undefined : defaultDelay });

  const toggleCompresor = () =>
    patchState({
      compressor: state.compressor ? undefined : defaultCompressor,
    });

  return (
    <div className="synth">
      <div className="synth__left">
        <Oscillators
          oscillators={state.oscillators}
          onChange={(oscillators) => patchState({ oscillators })}
        />

        <FMOscillators
          FMOscs={state.FMOscs}
          onChange={(FMOscs) => patchState({ FMOscs })}
        />

        <Panel verticalHeader title="Master">
          <Master
            master={state.master}
            onChange={(master) => patchState({ master })}
          />
        </Panel>

        <KeyInput
          notes={notes}
          onChange={setNotes}
          onChangeVelocity={(velocity) => patchState({ velocity })}
          velocity={state.velocity}
        />
      </div>

      <div className="synth__right">
        <Panel
          title="Filter"
          verticalHeader={!!state.filter}
          actions={<Toggle onClick={toggleFilter} active={!!state.filter} />}
        >
          {state.filter && (
            <Filter
              filter={state.filter}
              onChange={(filter) => patchState({ filter })}
            />
          )}
        </Panel>

        <Envelopes
          envelopes={state.envelopes}
          onChange={(envelopes) => patchState({ envelopes })}
        />

        <LFOs LFOs={state.LFOs} onChange={(LFOs) => patchState({ LFOs })} />

        <Panel
          actions={<Toggle onClick={toggleDelay} active={!!state.delay} />}
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

        <Panel
          actions={
            <Toggle onClick={toggleDistortion} active={!!state.distortion} />
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
            <Toggle onClick={toggleCompresor} active={!!state.compressor} />
          }
          verticalHeader={!!state.compressor}
          title="Compressor"
        >
          {state.compressor && (
            <Compressor
              compressor={state.compressor}
              onChange={(compressor) => patchState({ compressor })}
            />
          )}
        </Panel>
      </div>
    </div>
  );
};
