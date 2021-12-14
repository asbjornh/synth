import { useCallback, useEffect, useRef } from "react";

export const useDrag = (
  el: HTMLDivElement | null,
  cb: (delta: { x: number; y: number }) => void
) => {
  const isDragging = useRef(false);
  const prevX = useRef(0);
  const prevY = useRef(0);

  const onMouseDown = (e: MouseEvent) => {
    prevX.current = e.x;
    prevY.current = e.y;
    isDragging.current = true;
  };
  const onMouseUp = () => (isDragging.current = false);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      cb({ x: e.x - prevX.current, y: e.y - prevY.current });
      prevX.current = e.x;
      prevY.current = e.y;
    },
    [cb]
  );

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  useEffect(() => {
    if (!el) return;
    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, [el]);
};
