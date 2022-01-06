import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDrag } from "../../hooks/use-drag";
import { clamp, mapRange } from "../../util";

import "./knob.scss";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";

/** Returns the x coordinate for a y in 2^x */
const expX = (y: number) => Math.log(y) / Math.log(2);

const interpolateLinear = (
  value: number,
  delta: number,
  min: number,
  max: number
) => {
  const v = mapRange(value, [min, max], [0, 1]);
  return mapRange(v + delta, [0, 1], [min, max]);
};

const interpolateExponential = (value: number, delta: number, max: number) =>
  Math.pow(2, expX(value) + delta);

const colors = {
  red: "#ff9797",
  orange: "#ffb171",
  yellow: "#ffdf38",
  lime: "#9ce159",
  green: "#3cf59b",
  purple: "#b085f9",
  blue: "#77bbe9",
};

export const Knob: React.FC<{
  centered?: boolean;
  interpolation?: "linear" | "exponential";
  min: number;
  max: number;
  value: number;
  resolution?: number;
  step: number;
  theme?: keyof typeof colors;
  onChange: (next: number) => void;
}> = ({
  centered,
  interpolation = "linear",
  min,
  max,
  value,
  onChange,
  resolution = 200,
  step,
  theme = "red",
}) => {
  const [knobValue, setKnobValue] = useState(value);
  const [input, setInput] = useState("");
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  const color = colors[theme];

  const quantize = (value: number) =>
    Math.round(value * (1 / step)) / (1 / step);

  useAfterMountEffect(() => {
    if (value !== quantize(knobValue)) {
      setKnobValue(value);
    }
  }, [value]);

  const onDrag = useCallback(
    (mouseDelta: { x: number; y: number }) => {
      const delta = (mouseDelta.x - mouseDelta.y) / resolution;
      const next =
        interpolation === "linear"
          ? interpolateLinear(knobValue, delta, min, max)
          : interpolateExponential(knobValue, delta * 8, max);
      const clamped = clamp(next, min, max);
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

  const ratio =
    interpolation === "linear"
      ? mapRange(knobValue, [min, max], [0, 1])
      : mapRange(expX(knobValue), [expX(min), expX(max)], [0, 1]);
  const position = mapRange(ratio, [0, 1], [-130, 130]);
  const meterRotate = centered ? -90 : 135;
  const meterOffset = !centered
    ? mapRange(ratio, [0, 1], [314, 104])
    : ratio > 0.5
    ? mapRange(ratio, [0.5, 1], [314, 210])
    : mapRange(ratio, [0.5, 0], [314, 418]);

  return (
    <div className="knob">
      <div className="knob__wrapper">
        <svg className="knob__meter">
          <circle
            className="knob__meter-background"
            cx="50%"
            cy="50%"
            r="45%"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="314% 1000%"
            strokeDashoffset="104%"
            style={{ transform: "rotate(135deg)" }}
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            strokeWidth={4}
            stroke={color}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="314% 280%"
            strokeDashoffset={`${meterOffset}%`}
            style={{ transform: `rotate(${meterRotate}deg)` }}
          />
        </svg>
        <div className="knob__wheel-wrapper">
          <div
            ref={(el) => setEl(el)}
            className="knob__wheel"
            style={{ transform: `rotate(${position}deg)` }}
          >
            <div className="knob__dot" />
          </div>
        </div>
      </div>

      <div className="knob__input">
        <input value={input} onChange={(e) => onInput(e.target.value)} />
      </div>
    </div>
  );
};
