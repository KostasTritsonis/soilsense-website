type InfoPanelProps = {
  lng: number;
  lat: number;
  fieldArea: number | null;
};
  
  export default function InfoPanel({ lng, lat, fieldArea }: InfoPanelProps) {

    return (
      <div className="p-4 border-t border-b border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">Field Information</h2>
        <div className="space-y-2 text-sm">
          <p>Longitude: {lng.toFixed(4)}</p>
          <p>Latitude: {lat.toFixed(4)}</p>
          {fieldArea !== null && <p>Area: {fieldArea.toFixed(2)} &#13217;</p>}
        </div>
      </div>
    );    
  };