type InfoPanelProps = {
  lng: number;
  lat: number;
  fieldArea: number | null;
};
  
  export default function InfoPanel({ lng, lat, fieldArea }: InfoPanelProps) {

    return (
      <div className="bg-zinc-950/90 sm:text-[14px] text-[11px] text-zinc-50 p-3 text-sm rounded-lg absolute sm:bottom-4 sm:left-4 md:bottom-16 md:left-2 z-10">
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        {fieldArea !== null && <div>Area: {fieldArea.toFixed(2)} &#13217;</div>}
      </div>
    );    
  };