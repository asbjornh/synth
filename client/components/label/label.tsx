import cn from "classnames";
import React from "react";

import "./label.scss";

export const Label: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return <div className={cn("label", className)}>{children}</div>;
};
