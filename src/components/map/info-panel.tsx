type InfoPanelProps = {
  lng: number;
  lat: number;
  fieldArea: number;
};
  
  export default function InfoPanel({ lng, lat, fieldArea }: InfoPanelProps) {

    return (
      <div className="p-4 border-t border-b border-zinc-700">
        <div className="space-y-2 text-sm">
          <div className="flex">
            <p>Longitude:</p>
            <p className="ml-auto">{lng.toFixed(4)}</p>
          </div>
          <div className="flex">
            <p>Latitude:</p>
            <p className="ml-auto">{lat.toFixed(4)}</p>
          </div>
          <div className="flex">
            <p>Area:</p>
            <p className="ml-auto">{fieldArea.toFixed(2)} &#13217;</p>
          </div>
        </div>
      </div>
    );    
  };