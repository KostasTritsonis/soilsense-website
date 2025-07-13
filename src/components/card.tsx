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
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-green-200/60">
      <h3 className="flex gap-2 items-center text-green-900 text-md font-extrabold">
        {props.icon}
        {props.title}
      </h3>
      <div className="mt-auto flex items-center gap-2">
        <p className="text-2xl font-extrabold text-green-800">{props.value}</p>
        {props.subtitle && (
          <p className="text-lg text-green-700">{props.subtitle}</p>
        )}
      </div>
    </div>
  );
}
