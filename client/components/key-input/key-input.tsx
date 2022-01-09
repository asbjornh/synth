import React, { useEffect, useState } from "react";
import { NoteState, Velocity } from "../../../interface/state";
import { Keyboard } from "../keyboard/keyboard";
import { Midi } from "../midi/midi";

export const KeyInput: React.FC<{
  notes: NoteState[];
  onChange: (next: NoteState[]) => void;
  onChangeVelocity: (next: Velocity) => void;
  velocity: Velocity;
}> = ({ notes, onChange, onChangeVelocity, velocity }) => {
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
    <Midi
      devices={devices}
      notes={notes}
      onChange={onChange}
      onChangeVelocity={onChangeVelocity}
      velocity={velocity}
    />
  );
};
