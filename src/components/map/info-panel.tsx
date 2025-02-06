type InfoPanelProps = {
  lng: number;
  lat: number;
  zoom: number;
  polygonArea: number | null;
  selectedColor: string;
  onColorChange: (color: string) => void;
};
  
  export default function InfoPanel({ lng, lat, zoom, polygonArea, selectedColor, onColorChange }: InfoPanelProps) {
    return (
      <div className="bg-zinc-950/90 sm:text-[14px] text-[11px] text-zinc-50 p-3 text-sm rounded-lg absolute sm:bottom-4 sm:left-4 md:bottom-10 md:left-10 z-10">
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        {polygonArea !== null && <div>Area: {polygonArea.toFixed(2)} &#13217;</div>}
        <div className="mt-2">
          <label htmlFor="color-picker" className="block mb-1">Select Color:</label>
          <input
            id="color-picker"
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    );    
  };