import fs from "fs";
import path from "path";
import { Preset } from "../interface/state";

const presetsFile = path.resolve(__dirname, "../user-presets.json");

export const getPresets = () => {
  try {
    return require(presetsFile);
  } catch {
    return {};
  }
};

export const savePreset = (preset: Preset) => {
  const presets = getPresets();
  const next = { ...presets, [preset.displayName]: preset };
  fs.writeFileSync(presetsFile, JSON.stringify(next, null, 2), "utf8");
  return next;
};

export const deletePreset = (preset: Preset) => {
  const presets = getPresets();
  delete presets[preset.displayName];
  fs.writeFileSync(presetsFile, JSON.stringify(presets, null, 2), "utf8");
  return presets;
};
