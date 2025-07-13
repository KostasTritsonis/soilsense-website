"use client";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["600", "700"],
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
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-green-600`}
      ></div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
}

// Full screen loader
export function FullScreenLoader({ text = "soilSense" }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 px-12 py-10 flex flex-col items-center space-y-8">
        {/* Main text with gradient */}
        <div className={`${poppins.className} font-extrabold text-center`}>
          <span className="bg-gradient-to-r text-4xl md:text-5xl from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            {text}
          </span>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-4 mt-2">
          <div
            className="w-5 h-5 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-5 h-5 bg-green-700 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-5 h-5 bg-green-800 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
