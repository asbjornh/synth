import { Note } from "../../../interface/state";
import { mapRange } from "../../util";

const status = {
  noteOn: 144,
  noteOff: 128,
};

type Event =
  | { event: "noteOn"; note: Note; velocity: number }
  | { event: "noteOff"; note: Note };

// https://www.midimountain.com/midi/midi_status.htm
export const parse = (message: WebMidi.MIDIMessageEvent): Event | undefined => {
  const one = message.data[0];
  const two = message.data[1];
  const three = message.data[2];
  const data: [number, number, number] | undefined =
    one !== undefined && two !== undefined && 3 !== undefined
      ? [one, two, three]
      : undefined;
  if (data === undefined) return undefined;

  const [statusCode, second, third] = data;

  if (statusCode === status.noteOn) {
    const note = notes[second];
    const velocity = mapRange(third, [0, 127], [0, 1]);
    return note ? { event: "noteOn", note, velocity } : undefined;
  }
  if (statusCode === status.noteOff) {
    const note = notes[second];
    return note ? { event: "noteOff", note } : undefined;
  }
};

const notes: Note[] = [
  "C0",
  "C#0",
  "D0",
  "D#0",
  "E0",
  "F0",
  "F#0",
  "G0",
  "G#0",
  "A0",
  "A#0",
  "B0",
  "C1",
  "C#1",
  "D1",
  "D#1",
  "E1",
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
  "C6",
  "C#6",
  "D6",
  "D#6",
  "E6",
  "F6",
  "F#6",
  "G6",
  "G#6",
  "A6",
  "A#6",
  "B6",
  "C7",
  "C#7",
  "D7",
  "D#7",
  "E7",
  "F7",
  "F#7",
  "G7",
  "G#7",
  "A7",
  "A#7",
  "B7",
  "C8",
  "C#8",
  "D8",
  "D#8",
  "E8",
  "F8",
  "F#8",
  "G8",
  "G#8",
  "A8",
  "A#8",
  "B8",
  // NOTE: not supported in backend
  // "C9",	"C#9",  "D9",  "D#9",  "E9",  "F9",  "F#9",  "G9",  "G#9",  "A9",  "A#9","B9",
  // "C10","C#10","D10", "D#10", "E10", "F10", "F#10","G10",
];
