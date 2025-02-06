import React, { useState } from 'react';
import { Polygon } from '@/lib/types';

type PolygonListProps = {
  polygons: Polygon[];
  onPolygonSelect: (polygonId: string) => void;
  selectedPolygonId: string | null;
};

export default function PolygonList({ polygons, onPolygonSelect, selectedPolygonId }: PolygonListProps){

  const [active,setActive] = useState(false);

  const toggleActive = () => setActive(!active);


  return (
    <div className="absolute top-3 left-3 sm:top-7 sm:left-5 md:top-10 md:left-10   z-10 bg-zinc-950/90 p-3 rounded-lg w-[25%] overflow-y-auto max-h-[260px] sm:max-h-[500px] sm:w-auto sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
      <button onClick={toggleActive}><h3 className="text-white text-[12px] sm:text-lg font-semibold mb-2">Field List</h3></button>
      <div className={`space-y-2 ${active? 'block' : 'hidden'}`}>
        {polygons.map((polygon) => (
          <div
            key={polygon.id}
            onClick={() => onPolygonSelect(polygon.id)}
            className={`cursor-pointer py-1 rounded text-sm sm:text-lg ${
              selectedPolygonId === polygon.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                style={{ backgroundColor: polygon.color }}
              />
              <span>{polygon.label || 'Unnamed Field'}</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Area: {((polygon.area || 0)).toFixed(2)} &#13217;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
