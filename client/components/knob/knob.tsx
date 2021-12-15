import React, { useCallback, useEffect, useState } from "react";
import { useDrag } from "../../hooks/use-drag";
import { clamp, mapRange } from "../../util";

import interpolate from "color-interpolate";

const getColor = interpolate([
  "#ff4242",
  "#ff9c3a",
  "#ffdf38",
  "#c5fc2f",
  "#3cf59b",
]);

import "./knob.scss";
import { Label } from "../label/label";

export const Knob: React.FC<{
  label: string;
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (next: number) => void;
}> = ({ label, min, max, value, onChange, step }) => {
  const [knobValue, setKnobValue] = useState(value);
  const [input, setInput] = useState("");
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  const quantize = (value: number) =>
    Math.round(value * (1 / step)) / (1 / step);

  const onDrag = useCallback(
    (delta: { x: number; y: number }) => {
      const { x, y } = delta;
      const v = mapRange(knobValue, [min, max], [-100, 100]);
      const mapped = mapRange(v + x - y, [-100, 100], [min, max]);
      const clamped = clamp(mapped, min, max);
      setKnobValue(clamped);
      onChange(quantize(clamped));
    },
    [knobValue]
  );

  const onInput = (input: string) => {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      const clamped = clamp(value, min, max);
      setKnobValue(quantize(clamped));
      onChange(quantize(clamped));
    }
    setInput(input);
  };

  useEffect(() => {
    if (String(value) !== input) {
      setInput(String(quantize(value)));
    }
  }, [value]);

  useDrag(el, onDrag);

  const rotation = mapRange(knobValue, [min, max], [-130, 130]);
  const color = getColor(mapRange(knobValue, [min, max], [0, 1]));

  return (
    <div className="knob">
      <Label className="knob__label">{label}</Label>
      <div className="knob__wrapper">
        <svg className="knob__meter">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            strokeWidth={4}
            stroke={color}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="314% 1000%"
            strokeDashoffset={`${mapRange(knobValue, [min, max], [320, 110])}%`}
          />
        </svg>
        <div className="knob__wheel-wrapper">
          <div
            ref={(el) => setEl(el)}
            className="knob__wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="knob__dot" />
          </div>
        </div>
      </div>

      <input value={input} onChange={(e) => onInput(e.target.value)} />
    </div>
  );
};
