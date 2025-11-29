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
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-medium hover:scale-[1.02] group min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-4">
        {props.icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
            {props.icon}
          </div>
        )}
        <h3 className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide truncate">
          {props.title}
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
        <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {props.value}
        </p>
        {props.subtitle && (
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {props.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
