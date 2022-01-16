import cn from "classnames";
import React, { useState } from "react";
import { Note, NoteDescriptor } from "../../../interface/state";
import { useKeys } from "./use-keys";

import "./keyboard.scss";
import { Panel } from "../panel/panel";
import {
  Control,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";

type Key = {
  black?: boolean;
  label: string;
  code: string;
  note: Note;
};

const keys: Key[][] = [
  [
    { label: "W", code: "KeyW", note: "C4" },
    { label: "3", code: "Digit3", note: "C#4", black: true },
    { label: "E", code: "KeyE", note: "D4" },
    { label: "4", code: "Digit4", note: "D#4", black: true },
    { label: "R", code: "KeyR", note: "E4" },
    { label: "T", code: "KeyT", note: "F4" },
    { label: "6", code: "Digit6", note: "F#4", black: true },
    { label: "Y", code: "KeyY", note: "G4" },
    { label: "7", code: "Digit7", note: "G#4", black: true },
    { label: "U", code: "KeyU", note: "A4" },
    { label: "8", code: "Digit8", note: "A#4", black: true },
    { label: "I", code: "KeyI", note: "B4" },
    { label: "O", code: "KeyO", note: "C5" },
    { label: "0", code: "Digit0", note: "C#5", black: true },
    { label: "P", code: "KeyP", note: "D5" },
    { label: "?", code: "Minus", note: "D#5", black: true },
    { label: "Å", code: "BracketLeft", note: "E5" },
    { label: "^", code: "BracketRight", note: "F5" },
  ],
  [
    { label: "Z", code: "KeyZ", note: "C2" },
    { label: "S", code: "KeyS", note: "C#2", black: true },
    { label: "X", code: "KeyX", note: "D2" },
    { label: "D", code: "KeyD", note: "D#2", black: true },
    { label: "C", code: "KeyC", note: "E2" },
    { label: "V", code: "KeyV", note: "F2" },
    { label: "G", code: "KeyG", note: "F#2", black: true },
    { label: "B", code: "KeyB", note: "G2" },
    { label: "H", code: "KeyH", note: "G#2", black: true },
    { label: "N", code: "KeyN", note: "A2" },
    { label: "J", code: "KeyJ", note: "A#2", black: true },
    { label: "M", code: "KeyM", note: "B2" },
    { label: ",", code: "Comma", note: "C3" },
    { label: "L", code: "KeyL", note: "C#3", black: true },
    { label: ".", code: "Period", note: "D3" },
    { label: "Ø", code: "Semicolon", note: "D#3", black: true },
    { label: "-", code: "Slash", note: "E3" },
  ],
];

export const Keyboard: React.FC<{
  notes: NoteDescriptor[];
  onChange: (notes: NoteDescriptor[]) => void;
  velocity: number;
  onVelocityChange: (next: number) => void;
}> = (props) => {
  const [velocity, setVelocity] = useState(props.velocity);

  useKeys((codes) =>
    props.onChange(
      keys
        .flat()
        .filter(({ code }) => codes.includes(code))
        .map(({ note }) => ({ note, velocity }))
    )
  );

  return (
    <Panel verticalHeader title="Keyboard">
      <ControlStrip>
        <Control label="Keys">
          <div className="keyboard">
            {keys.map((row, index) => (
              <ul key={index} className="keyboard__keys">
                {row.map((key) => (
                  <Key
                    key={key.code}
                    notes={props.notes.map(({ note }) => note)}
                    {...key}
                  />
                ))}
              </ul>
            ))}
          </div>
        </Control>

        <ControlStack>
          <Control label="Velocity">
            <Knob
              min={0}
              max={1}
              step={0.01}
              value={velocity}
              onChange={setVelocity}
            />
          </Control>
        </ControlStack>
      </ControlStrip>
    </Panel>
  );
};

const Key: React.FC<Key & { notes: Note[] }> = ({
  black,
  label,
  note,
  notes,
}) => {
  const isActive = notes.includes(note);

  return (
    <div className="keyboard__key-wrapper">
      <div
        className={cn("keyboard__key", {
          "keyboard__key--black": black,
          "keyboard__key--active": isActive,
        })}
      >
        <div>{label}</div>
        <div className="keyboard__key-note">{note}</div>
      </div>
    </div>
  );
};
