import cn from "classnames";
import React from "react";
import "./panel.scss";

export const Panel: React.FC<{
  actions?: JSX.Element;
  title: string;
  verticalHeader?: boolean;
}> = ({ actions, children, title, verticalHeader }) => (
  <div className={cn("panel", { "panel--vertical-header": verticalHeader })}>
    <div className="panel__header">
      <h2>{title}</h2>
      {actions && <div className="panel__actions">{actions}</div>}
    </div>
    <div className="panel__content">{children}</div>
  </div>
);
