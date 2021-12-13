import React from "react";
import { Note } from "../../../interface/osc";
import { useKey } from "./use-key";

export const Keyboard: React.FC<{
  notes: Note[];
  onChange: (notes: Note[]) => void;
}> = (props) => {
  useKey("Comma", { name: "C", oct: 5 }, props.notes, props.onChange);
  useKey("KeyM", { name: "B", oct: 4 }, props.notes, props.onChange);
  useKey("KeyJ", { name: "A#", oct: 4 }, props.notes, props.onChange);
  useKey("KeyN", { name: "A", oct: 4 }, props.notes, props.onChange);
  useKey("KeyH", { name: "G#", oct: 4 }, props.notes, props.onChange);
  useKey("KeyB", { name: "G", oct: 4 }, props.notes, props.onChange);
  useKey("KeyG", { name: "F#", oct: 4 }, props.notes, props.onChange);
  useKey("KeyV", { name: "F", oct: 4 }, props.notes, props.onChange);
  useKey("KeyC", { name: "E", oct: 4 }, props.notes, props.onChange);
  useKey("KeyD", { name: "D#", oct: 4 }, props.notes, props.onChange);
  useKey("KeyX", { name: "D", oct: 4 }, props.notes, props.onChange);
  useKey("KeyS", { name: "C#", oct: 4 }, props.notes, props.onChange);
  useKey("KeyZ", { name: "C", oct: 4 }, props.notes, props.onChange);

  return (
    <div>
      <ul>
        {props.notes.map((note) => (
          <li key={note.name + note.oct}>
            {note.name}
            {note.oct}
          </li>
        ))}
      </ul>
    </div>
  );
};
