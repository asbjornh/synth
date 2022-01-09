import React, { useState } from "react";
import {
  initialState,
  NoteDescriptor,
  Preset,
  UIState,
} from "../../../interface/state";
import { post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { Panel } from "../panel/panel";
import { Presets } from "../presets/presets";
import { Synth } from "../synth/synth";

import "./app.scss";

export const App: React.FC = () => {
  const [state, setState] = useState<UIState>(initialState);
  const [notes, setNotes] = useState<NoteDescriptor[]>([]);
  const [presetName, setPresetName] = useState("");

  useAfterMountEffect(() => post("/config", state), [state]);
  useAfterMountEffect(() => post("play", notes), [notes]);

  const patchState = (next: Partial<UIState>) =>
    setState((state) => ({
      ...state,
      ...next,
    }));

  const setFromPreset = (preset: Preset) => {
    const { displayName, ...state } = preset;
    patchState(state);
  };

  return (
    <div className="app">
      <Panel
        actions={
          <Presets
            onSelect={(preset, name) => {
              setFromPreset(preset);
              setPresetName(name);
            }}
            state={state}
          />
        }
        title="Presets"
      />

      {/* NOTE: Remount when changing preset to ensure clean UI state */}
      <Synth
        key={presetName}
        state={state}
        setState={setState}
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
};
