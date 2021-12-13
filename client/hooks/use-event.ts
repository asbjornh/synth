import { useEffect } from "react";

export const useEvent = (name: string, listener: (e: Event) => void) => {
  useEffect(() => {
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }, []);
};
