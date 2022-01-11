import React from "react";
import { PlusSquare } from "react-feather";
import { FMOsc as FMOscOpts } from "../../../interface/state";
import { Button } from "../button/button";
import { defaultFMOsc, FMOsc } from "../fm-osc/fm-osc";
import { Panel } from "../panel/panel";
import "./fm-oscillators.scss";

export const FMOscillators: React.FC<{
  FMOscs: FMOscOpts[];
  onChange: (next: FMOscOpts[]) => void;
}> = ({ FMOscs, onChange }) => {
  const addOsc = (osc: FMOscOpts) => onChange(FMOscs.concat(osc));

  const setOsc = (index: number) => (osc: FMOscOpts) =>
    onChange(FMOscs.map((o, i) => (i === index ? osc : o)));

  const rmOsc = (index: number) =>
    onChange(FMOscs.filter((_, i) => i !== index));

  return (
    <Panel
      title="FM"
      verticalHeader
      actions={
        <Button onClick={() => addOsc(defaultFMOsc())} color="dark">
          <PlusSquare />
        </Button>
      }
    >
      <div className="fm-oscillators">
        {FMOscs.map((osc, index) => (
          <FMOsc
            key={osc.id}
            osc={osc}
            onChange={setOsc(index)}
            onRemove={() => rmOsc(index)}
          />
        ))}
      </div>
    </Panel>
  );
};
