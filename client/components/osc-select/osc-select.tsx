import React from "react";
import { Osc } from "../../../interface/osc";

export const defaultOsc: Osc = {
  type: "saw",
};

export const OscSelect: React.FC<Osc> = (props) => {
  return <div>{props.type}</div>;
};
