import React, { useEffect, useState } from "react";
import { NoteDescriptor, Velocity } from "../../../interface/state";
import {
  Control,
  ControlGroup,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Panel } from "../panel/panel";
import { Select } from "../select/select";
import { parse } from "./message-parser";
import { VelocityTargets } from "./velocity-targets";

export const Midi: React.FC<{
  devices: WebMidi.MIDIInput[];
  notes: NoteDescriptor[];
  onChange: (notes: NoteDescriptor[]) => void;
  onChangeVelocity: (velocity: Velocity) => void;
  velocity: Velocity;
}> = ({ devices, notes, onChange, onChangeVelocity, velocity }) => {
  const [device, setDevice] = useState(devices[0]);
  const [scale, setScale] = useState(velocity.scale);
  const [offset, setOffset] = useState(velocity.offset);
  const [targets, setTargets] = useState(velocity.targets);

  const deviceOptions = devices.map((device) => ({
    label: `${device.manufacturer || ""} ${device.name || "Unknown"}`,
    value: device.id,
  }));

  const updateDevice = (id: string) => {
    const device = devices.find((device) => device.id === id);
    if (device) setDevice(device);
  };

  useEffect(
    () => onChangeVelocity({ scale, offset, targets }),
    [scale, offset, targets]
  );

  useEffect(() => {
    device.onmidimessage = (message) => {
      const event = parse(message);
      if (!event) return;
      if (event.event === "noteOn") {
        onChange(notes.concat({ note: event.note, velocity: event.velocity }));
      } else if (event.event === "noteOff") {
        onChange(notes.filter((n) => n.note !== event.note));
      }
    };
    return () => {
      device.onmidimessage = () => {};
    };
  }, [device, notes, onChange]);

  return (
    <Panel title="MIDI" verticalHeader>
      <ControlStrip>
        <Control label="Device">
          <Select
            options={deviceOptions}
            onChange={updateDevice}
            value={device.id}
          />
        </Control>

        <ControlGroup label="Velocity">
          <Control label="Scale">
            <Knob
              centered
              min={0}
              max={2}
              step={0.01}
              value={scale}
              onChange={setScale}
              theme="blue"
            />
          </Control>

          <Control label="Offset">
            <Knob
              centered
              min={-1}
              max={1}
              step={0.01}
              value={offset}
              onChange={setOffset}
              theme="blue"
            />
          </Control>

          <Control label="Targets">
            <VelocityTargets targets={targets} onChange={setTargets} />
          </Control>
        </ControlGroup>
      </ControlStrip>
    </Panel>
  );
};
