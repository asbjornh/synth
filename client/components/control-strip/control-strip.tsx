import React from "react";
import { Label } from "../label/label";
import "./control-strip.scss";

export const ControlStrip: React.FC = ({ children }) => (
  <div className="control-strip">{children}</div>
);

export const Control: React.FC<{ label?: string; title?: string }> = ({
  children,
  label,
  title,
}) => (
  <div className="control-strip__control">
    {label && (
      <Label className="control-strip__control-label" title={title}>
        {label}
      </Label>
    )}
    <div className="control-strip__control-content">{children}</div>
  </div>
);

export const ControlStack: React.FC = ({ children }) => (
  <div className="control-strip__control-stack">{children}</div>
);
