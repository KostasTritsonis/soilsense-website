"use client";

import Loader from "./loader";

interface ButtonLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function ButtonLoader({
  isLoading,
  children,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: ButtonLoaderProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center gap-2 transition-all duration-200 ${
        isLoading || disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading && (
        <div className="w-4 h-4">
          <Loader size="sm" text="" />
        </div>
      )}
      <span className={isLoading ? "opacity-80" : ""}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
}
