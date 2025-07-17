import MapComponent from "@/components/map/map";
import React from "react";

export default function Page() {
  return (
    <div className="w-full">
      {/* Header Section */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5">
        <h1 className="text-4xl font-bold text-neutral-900">
          Field Management
        </h1>
      </div>

      {/* Map Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
        <MapComponent />
      </div>
    </div>
  );
}
