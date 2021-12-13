import { useEvent } from "./use-event";

export const useKeydown = (code: string, fn: () => void) =>
  useEvent("keydown", (e) => {
    if ((e as KeyboardEvent).code === code) {
      fn();
    }
  });
