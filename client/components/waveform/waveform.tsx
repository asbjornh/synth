import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { mapRange } from "../../util";
import "./waveform.scss";

type State = {
  samples: number[];
  freq: number;
  sampleRate: number;
  t: number;
};

export const Waveform: React.FC = (props) => {
  const [state, setState] = useState<State>({
    samples: [],
    freq: 0,
    sampleRate: 0,
    t: 0,
  });

  const canvas = useRef<HTMLCanvasElement>(null);
  const width = 150;
  const height = 70;
  const padding = 10;

  useEffect(() => {
    const socket = io({ transports: ["websocket"] });

    socket.on("frame", ({ samples, freq, sampleRate, t }) => {
      setState({ samples, freq, sampleRate, t });
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    const { samples, freq, sampleRate, t } = state;
    ctx.clearRect(0, 0, width, height);

    if (samples.length === 0 || !freq) return;

    const period = 1 / freq;
    const frameDur = samples.length / sampleRate;
    const frameDiff = frameDur % period;
    const diff = (t / frameDur) * frameDiff;
    // NOTE: Nudge period slightly to avoid left line for square and saw flickering
    const start = Math.round((period * 0.99 - (diff % period)) * sampleRate);
    const numSamples = sampleRate * period * 4;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const color = matchMedia("(prefers-color-scheme: dark)").matches
      ? "#62ffb3"
      : "black";
    ctx.strokeStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.lineWidth = 2;
    samples.slice(start, start + numSamples).forEach((point, index) => {
      const x = padding + index * ((width - 2 * padding) / numSamples);
      const y = padding + mapRange(point, [-1, 1], [0, height - 2 * padding]);
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [state]);

  return (
    <div className="waveform">
      <canvas width={width} height={height} ref={canvas} />
    </div>
  );
};
