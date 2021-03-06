import cn from "classnames";
import React, { ButtonHTMLAttributes } from "react";
import "./button.scss";

type Attributes = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Attributes & { color?: "light" | "dark" }> = ({
  color,
  className,
  ...props
}) => {
  return (
    <button
      className={cn("button", className, { "button--dark": color === "dark" })}
      {...props}
    />
  );
};
