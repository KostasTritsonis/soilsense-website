'use client';
import { MapSetup } from '@/lib/map-creation';
import { useEffect } from 'react'
import LoadingSpinner from './loading-spinner';
import InfoPanel from './info-panel';
import { useMapHandlers } from '@/lib/hooks';

export default function MapReadOnly() {

  const {
    mapContainer,
    mapRef,
    drawRef,
    lng,
    lat,
  } = MapSetup();


  const {
    isLoading,
    totalArea,
    handleLoad
  } = useMapHandlers({mapRef, drawRef});

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div className={`relative bg-zinc-50 w-[900px]  p-2 md:mt-8`} >
      {(isLoading) && <LoadingSpinner />}
      
      <div ref={mapContainer} className="h-[700px] w-full"/>
      
      <InfoPanel
        lng={lng}
        lat={lat}
        fieldArea={totalArea}
      />
    </div>
    
  )
}
