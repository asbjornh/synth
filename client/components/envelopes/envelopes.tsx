import React from "react";
import { PlusSquare } from "react-feather";
import { Envelope as EnvelopeOpts } from "../../../interface/state";
import { Button } from "../button/button";
import { defaultEnvelope, Envelope } from "../envelope/envelope";
import { Panel } from "../panel/panel";

export const Envelopes: React.FC<{
  envelopes: EnvelopeOpts[];
  onChange: (envelopes: EnvelopeOpts[]) => void;
}> = ({ envelopes, onChange }) => {
  const add = () => onChange(envelopes.concat(defaultEnvelope));

  const set = (index: number) => (envelope: EnvelopeOpts) =>
    onChange(envelopes.map((e, i) => (i === index ? envelope : e)));

  const remove = (index: number) =>
    onChange(envelopes.filter((_, i) => i !== index));

  return (
    <Panel
      actions={
        <Button onClick={add} color="dark">
          <PlusSquare />
        </Button>
      }
      title="Envelopes"
      verticalHeader={envelopes.length > 0}
    >
      {envelopes.length > 0 && (
        <div className="envelopes__envelopes">
          {envelopes.map((envelope, index) => (
            <Envelope
              key={envelope.target}
              envelope={envelope}
              onChange={set(index)}
              onDelete={() => remove(index)}
            />
          ))}
        </div>
      )}
    </Panel>
  );
};
