'use client';

import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export default function OLMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const southwest = fromLonLat([-54.6, -26.7]);
      const northeast = fromLonLat([-48.0, -22.5]); 

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([-51.5, -24.5]), 
          zoom: 15,
          minZoom: 4,
          maxZoom: 20,
          extent: [...southwest, ...northeast],
        }),
      });

      return () => map.setTarget(undefined);
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100vh',
      }}
    />
  );
}
