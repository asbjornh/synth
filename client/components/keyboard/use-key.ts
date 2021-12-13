import { useRef } from "react";
import { Note } from "../../../interface/osc";
import { useKeydown } from "../../hooks/use-keydown";
import { useKeyup } from "../../hooks/use-keyup";

const eq = (a: Note) => (b: Note) => a.name === b.name && a.oct === b.oct;
const id = (note: Note): string => note.name + note.oct;

export const useKey = (
  code: string,
  note: Note,
  notes: Note[],
  onChange: (notes: Note[]) => void
) => {
  const pressed = useRef<Record<string, boolean>>({});

  useKeydown(code, () => {
    if (pressed.current[id(note)]) return;
    pressed.current[id(note)] = true;
    onChange(notes.concat(note));
  });
  useKeyup(code, () => {
    pressed.current[id(note)] = false;
    onChange(notes.filter((n) => !eq(n)(note)));
  });
};
