import React from "react";
import "./panel.scss";

export const Panel: React.FC<{ actions?: JSX.Element; title: string }> = ({
  actions,
  children,
  title,
}) => (
  <div className="panel">
    <div className="panel__header">
      {actions && <div className="panel__actions">{actions}</div>}
      <h2>{title}</h2>
    </div>
    <div className="panel__content">{children}</div>
  </div>
);
