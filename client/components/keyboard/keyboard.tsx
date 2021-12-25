import cn from "classnames";
import React from "react";
import { Note } from "../../../interface/state";
import { useKeys } from "./use-keys";

import "./keyboard.scss";
import { Panel } from "../panel/panel";

type Key = {
  black?: boolean;
  label: string;
  code: string;
  note: Note;
};

const keys: Key[] = [
  { label: "Z", code: "KeyZ", note: "C4" },
  { label: "S", code: "KeyS", note: "C#4", black: true },
  { label: "X", code: "KeyX", note: "D4" },
  { label: "D", code: "KeyD", note: "D#4", black: true },
  { label: "C", code: "KeyC", note: "E4" },
  { label: "V", code: "KeyV", note: "F4" },
  { label: "G", code: "KeyG", note: "F#4", black: true },
  { label: "B", code: "KeyB", note: "G4" },
  { label: "H", code: "KeyH", note: "G#4", black: true },
  { label: "N", code: "KeyN", note: "A4" },
  { label: "J", code: "KeyJ", note: "A#4", black: true },
  { label: "M", code: "KeyM", note: "B4" },
  { label: ",", code: "Comma", note: "C5" },
];

export const Keyboard: React.FC<{
  notes: Note[];
  onChange: (notes: Note[]) => void;
}> = (props) => {
  useKeys((codes) =>
    props.onChange(
      keys.filter(({ code }) => codes.includes(code)).map(({ note }) => note)
    )
  );

  return (
    <div className="keyboard">
      <Panel title="Keyboard">
        <ul className="keyboard__keys">
          {keys.map((key) => (
            <Key
              key={key.code}
              notes={props.notes}
              onChange={props.onChange}
              {...key}
            />
          ))}
        </ul>
      </Panel>
    </div>
  );
};

const Key: React.FC<
  Key & { notes: Note[]; onChange: (notes: Note[]) => void }
> = ({ black, label, note, notes }) => {
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
