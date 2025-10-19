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

// Enhanced Full screen loader with modern animations
export function FullScreenLoader({ text = "SoilSense" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Brand with enhanced styling */}
      <div className="text-center">
        <h1
          className={`${inter.className} text-4xl font-bold bg-gradient-to-r from-neutral-900 via-primary-700 to-neutral-900 bg-clip-text text-transparent animate-pulse`}
        >
          {text}
        </h1>
        <p className="text-lg text-neutral-500 font-medium">
          Agricultural Intelligence
        </p>
      </div>

      {/* Enhanced Loading Animation */}
      <div className="flex flex-col items-center space-y-6">
        {/* Animated dots with gradient */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="relative">
            <div
              className="w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-ping opacity-30"
              style={{ animationDelay: "150ms" }}
            ></div>
          </div>
          <div className="relative">
            <div
              className="w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-bounce shadow-lg"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-ping opacity-30"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Loading Text with typewriter effect */}
      <div className="text-center space-y-2">
        <p className="text-lg text-neutral-600 font-medium animate-pulse">
          Loading your agricultural data...
        </p>
        <div className="flex items-center justify-center gap-1">
          <div className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
          <div
            className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
