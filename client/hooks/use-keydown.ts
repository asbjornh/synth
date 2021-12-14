import { useEvent } from "./use-event";

export const useKeydown = (fn: (e: KeyboardEvent) => void) =>
  useEvent("keydown", (e) => fn(e as KeyboardEvent), [fn]);
