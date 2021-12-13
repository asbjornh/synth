import { useEvent } from "./use-event";

export const useKeyup = (code: string, fn: () => void) =>
  useEvent("keyup", (e) => {
    if ((e as KeyboardEvent).code === code) {
      fn();
    }
  });
