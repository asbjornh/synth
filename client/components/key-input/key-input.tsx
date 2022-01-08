import React, { useCallback, useEffect, useState } from "react";
import { Note } from "../../../interface/state";
import { Keyboard } from "../keyboard/keyboard";
import { Midi } from "../midi/midi";

export const KeyInput: React.FC<{
  notes: Note[];
  onChange: (next: Note[]) => void;
}> = ({ notes, onChange }) => {
  const [devices, setDevices] = useState<WebMidi.MIDIInput[]>([]);

  useEffect(() => {
    navigator
      .requestMIDIAccess()
      .then((midi) =>
        setDevices(
          Array.from(midi.inputs.entries()).map(([_, device]) => device)
        )
      )
      .catch(() => console.log("No MIDI access"));
  }, []);

  return devices.length === 0 ? (
    <Keyboard notes={notes} onChange={onChange} />
  ) : (
    <Midi devices={devices} notes={notes} onChange={onChange} />
  );
};
