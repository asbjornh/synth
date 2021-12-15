import cn from "classnames";
import React from "react";

import "./label.scss";

export const Label: React.FC<{ className?: string; title?: string }> = ({
  className,
  children,
  title,
}) => {
  return (
    <div className={cn("label", className)} title={title}>
      {children}
    </div>
  );
};
