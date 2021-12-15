import React from "react";
import { PlusSquare } from "react-feather";
import { Osc } from "../../../interface/state";
import { Button } from "../button/button";
import { defaultOsc, Oscillator } from "../oscillator/oscillator";
import { Panel } from "../panel/panel";

import "./oscillators.scss";

export const Oscillators: React.FC<{
  oscillators: Osc[];
  onChange: (oscillators: Osc[]) => void;
}> = ({ oscillators, onChange }) => {
  const addOsc = () => onChange(oscillators.concat(defaultOsc()));

  const setOsc = (index: number) => (osc: Osc) =>
    onChange(oscillators.map((o, i) => (i === index ? osc : o)));

  const rmOsc = (index: number) =>
    onChange(oscillators.filter((_, i) => i !== index));

  return (
    <Panel
      title="Oscillators"
      actions={
        <Button onClick={addOsc} color="dark">
          <PlusSquare />
        </Button>
      }
    >
      <div className="oscillators">
        {oscillators.map((osc, index) => (
          <div key={osc.id}>
            <Oscillator
              osc={osc}
              onChange={setOsc(index)}
              onRemove={() => rmOsc(index)}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
};
