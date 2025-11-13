"use client";

// Simple loader component for buttons and small areas
export default function Loader({
  size = "md",
  text = "",
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-primary-600 dark:border-t-primary-400`}
      ></div>
      {text && (
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          {text}
        </span>
      )}
    </div>
  );
}
