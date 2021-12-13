import { useEffect, useRef } from "react";

export const useAfterMountEffect = (fn: () => void, deps: any[]) => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    fn();
  }, deps);
};
