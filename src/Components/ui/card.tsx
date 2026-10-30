import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;