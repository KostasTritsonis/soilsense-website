"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

// Regular loader component for buttons and small areas
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
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600`}
      ></div>
      {text && <span className="ml-2 text-sm text-neutral-600">{text}</span>}
    </div>
  );
}

// Full screen loader
export function FullScreenLoader({ text = "SoilSense" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-medium">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <div className="text-center">
          <h1
            className={`${inter.className} text-3xl font-bold text-neutral-900`}
          >
            {text}
          </h1>
          <p className="text-base text-neutral-500">
            Agricultural Intelligence
          </p>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>

      {/* Loading Text */}
      <p className="text-base text-neutral-500 font-medium">
        Loading your agricultural data...
      </p>
    </div>
  );
}
