import React from "react";
import type { ReactNode } from "react";

type CardProps = {
  props: {
    title: string;
    value: string;
    subtitle?: string;
    icon?: ReactNode;
  };
};

export default function Card({ props }: CardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6 transition-all duration-300 hover:shadow-medium hover:scale-[1.02] group">
      <div className="flex items-center gap-3 pb-4">
        {props.icon && (
          <div className="w-10 h-10 0 rounded-2xl flex items-center justify-center  transition-colors">
            {props.icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
          {props.title}
        </h3>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-neutral-900">{props.value}</p>
        {props.subtitle && (
          <p className="text-sm text-neutral-500 font-medium">
            {props.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
