import { useRef } from "react";
import { useKeydown } from "../../hooks/use-keydown";
import { useKeyup } from "../../hooks/use-keyup";

export const useKeys = (onChange: (codes: string[]) => void) => {
  const pressed = useRef<Record<string, boolean>>({});

  const update = () =>
    onChange(
      Object.entries(pressed.current)
        .filter(([_, pressed]) => pressed)
        .map(([code]) => code)
    );

  useKeydown((e) => {
    if (e.getModifierState("Meta")) return;
    if (document.activeElement?.nodeName === "INPUT") return;
    if (pressed.current[e.code]) return;
    pressed.current[e.code] = true;
    update();
  });
  useKeyup((e) => {
    // pressed.current[e.code] = false;
    delete pressed.current[e.code];
    update();
  });
};
