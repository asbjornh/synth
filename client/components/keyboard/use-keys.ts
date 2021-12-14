import { useCallback, useRef } from "react";
import { Note } from "../../../interface/osc";
import { useKeydown } from "../../hooks/use-keydown";
import { useKeyup } from "../../hooks/use-keyup";

const id = (note: Note): string => note.name + note.oct;

export const useKeys = (onChange: (codes: string[]) => void) => {
  const pressed = useRef<Record<string, boolean>>({});

  const update = () =>
    onChange(
      Object.entries(pressed.current)
        .filter(([_, pressed]) => pressed)
        .map(([code]) => code)
    );

  useKeydown((e) => {
    if (pressed.current[e.code]) return;
    pressed.current[e.code] = true;
    update();
  });
  useKeyup((e) => {
    pressed.current[e.code] = false;
    update();
  });
};
