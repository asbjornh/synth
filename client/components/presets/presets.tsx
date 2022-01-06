import React, { useEffect, useState } from "react";
import { FilePlus, Save, Trash2 } from "react-feather";
import { Preset, UIState } from "../../../interface/state";
import { defaultParams } from "../../../presets/default-params";
import sysPresets from "../../../presets/presets";
import { del, get, post } from "../../api";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { entries, mapValues } from "../../util";
import { Button } from "../button/button";
import { Select } from "../select/select";
import "./presets.scss";

const systemPresets: Record<string, Preset> = sysPresets;

const systemPresetOptions = [
  { label: "", value: "" as const },
  { label: "System presets:", value: "" as const, disabled: true },
  ...entries(systemPresets).map(([id, preset]) => ({
    label: preset.displayName,
    value: id,
  })),
];

const empty: Preset = {
  ...defaultParams,
  displayName: "",
};

export const Presets: React.FC<{
  onSelect: (preset: Preset, name: string) => void;
  state: UIState;
}> = (props) => {
  const [userPresets, setUserPresets] = useState<Record<string, Preset>>({});
  const [preset, setPreset] = useState<string>("");
  const [presetName, setPresetName] = useState<string>("");

  const presets = { ...systemPresets, ...userPresets };

  useEffect(
    () =>
      get("/presets").then((presets: Record<string, Preset>) =>
        setUserPresets(
          mapValues(presets, (preset) => ({
            ...defaultParams,
            ...preset,
          }))
        )
      ),
    []
  );

  useAfterMountEffect(() => {
    if (preset === "") props.onSelect(empty, "");
    else if (presets[preset]) props.onSelect(presets[preset], preset);

    setPresetName(userPresets[preset]?.displayName || "");
  }, [preset]);

  const save = () => {
    if (!presetName) return;
    const { notes, ...state } = props.state;
    const preset: Preset = { ...state, displayName: presetName };
    post("/presets", preset)
      .then(setUserPresets)
      .then(() => setPreset(preset.displayName));
  };

  const delet = () => {
    if (!userPresets[preset]) return;
    del("/presets", userPresets[preset]).then((presets: any) => {
      setUserPresets(presets);
      setPreset("");
    });
  };

  const userPresetOptions = Object.entries(userPresets).map(([id, preset]) => ({
    label: preset.displayName,
    value: id,
  }));

  const presetOptions = systemPresetOptions
    .concat(
      userPresetOptions.length > 0
        ? { label: "User presets:", value: "", disabled: true }
        : []
    )
    .concat(userPresetOptions);

  return (
    <div className="presets">
      <div className="presets__label">Preset:</div>
      <Select options={presetOptions} value={preset} onChange={setPreset} />
      <input
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
        placeholder="Preset name"
      />
      <Button
        onClick={() => {
          setPreset("");
          props.onSelect(empty, "");
          setPresetName("");
        }}
        color="dark"
      >
        <FilePlus />
      </Button>
      <Button disabled={!presetName} onClick={save} color="dark">
        <Save />
      </Button>
      <Button disabled={!userPresets[preset]} onClick={delet} color="dark">
        <Trash2 />
      </Button>
    </div>
  );
};
