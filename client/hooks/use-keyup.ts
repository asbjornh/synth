import { useEvent } from "./use-event";

export const useKeyup = (fn: (e: KeyboardEvent) => void) =>
  useEvent("keyup", (e) => fn(e as KeyboardEvent), [fn]);
