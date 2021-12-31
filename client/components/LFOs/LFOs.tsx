import React from "react";
import { PlusSquare } from "react-feather";
import { LFO as LFOOpts } from "../../../interface/state";
import { Button } from "../button/button";
import { defaultLFO, LFO } from "../LFO/LFO";
import { Panel } from "../panel/panel";
import "./LFOs.scss";

export const LFOs: React.FC<{
  LFOs: LFOOpts[];
  onChange: (LFOs: LFOOpts[]) => void;
}> = ({ LFOs, onChange }) => {
  const add = () => onChange(LFOs.concat(defaultLFO()));

  const set = (index: number) => (LFO: LFOOpts) =>
    onChange(LFOs.map((l, i) => (i === index ? LFO : l)));

  const remove = (index: number) =>
    onChange(LFOs.filter((_, i) => i !== index));

  return (
    <Panel
      verticalHeader={LFOs.length > 0}
      actions={
        <Button onClick={add} color="dark">
          <PlusSquare />
        </Button>
      }
      title="LFOs"
    >
      {LFOs.length > 0 && (
        <div className="lfos__lfos">
          {LFOs.map((props, index) => (
            <LFO
              key={props.id}
              LFO={props}
              onChange={set(index)}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </Panel>
  );
};
