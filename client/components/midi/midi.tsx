import React, { useEffect, useState } from "react";
import { Note } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Panel } from "../panel/panel";
import { Select } from "../select/select";
import { parse } from "./message-parser";

export const Midi: React.FC<{
  devices: WebMidi.MIDIInput[];
  notes: Note[];
  onChange: (notes: Note[]) => void;
}> = ({ devices, notes, onChange }) => {
  const [device, setDevice] = useState(devices[0]);

  const deviceOptions = devices.map((device) => ({
    label: `${device.manufacturer || ""} ${device.name || "Unknown"}`,
    value: device.id,
  }));

  const updateDevice = (id: string) => {
    const device = devices.find((device) => device.id === id);
    if (device) setDevice(device);
  };

  useEffect(() => {
    device.onmidimessage = (message) => {
      const event = parse(message);
      if (!event) return;
      if (event.event === "noteOn") {
        onChange(notes.concat(event.note));
      } else if (event.event === "noteOff") {
        onChange(notes.filter((n) => n !== event.note));
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
      </ControlStrip>
    </Panel>
  );
};
