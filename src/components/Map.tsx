'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke } from 'ol/style';

export default function OLMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<{
    lat: number;
    lon: number;
    clima: string | null;
    gez: string | null;
  } | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const southwest = fromLonLat([-55.0, -26.8]);
    const northeast = fromLonLat([-47.8, -22.3]);

    // Mapas GeoJSON
    const climaSource = new VectorSource({
      url: '/mapas/climaParana.geojson',
      format: new GeoJSON(),
    });
    const gezSource = new VectorSource({
      url: '/mapas/gez.json',
      format: new GeoJSON(),
    });
    const paranaSource = new VectorSource({
      url: '/mapas/parana.json',
      format: new GeoJSON(),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),

        new VectorLayer({
          source: climaSource,
          style: new Style({
            stroke: new Stroke({
              color: '#ff6600',
              width: 2,
            }),
          }),
        }),

        new VectorLayer({
          source: gezSource,
          style: new Style({
            stroke: new Stroke({
              color: '#008000',
              width: 2,
            }),
          }),
        }),

        new VectorLayer({
          source: paranaSource,
          style: new Style({
            stroke: new Stroke({
              color: '#0000ff',
              width: 2,
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([-51.4, -24.5]),
        zoom: 6,
        minZoom: 4,
        maxZoom: 20,
        extent: [...southwest, ...northeast],
      }),
    });

    // Clique no mapa
    map.on('click', (evt) => {
      const coord = evt.coordinate;
      const [lon, lat] = toLonLat(coord);

      let isInsideParana = false;
      paranaSource.forEachFeature((feature) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          isInsideParana = true;
        }
      });

      if (!isInsideParana) {
        alert('Selecione um ponto dentro do Paraná!');
        return;
      }


      let climaZona: string | null = null;
      climaSource.forEachFeature((feature) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          climaZona = feature.get('zona_nome') || feature.get('ZONA') || feature.get('nome') || 'Desconhecida';
        }
      });

      let gezTipo: string | null = null;
      gezSource.forEachFeature((feature) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          gezTipo = feature.get('TIPO') || feature.get('nome') || 'Desconhecido';
        }
      });

      setInfo({
        lat: Number(lat.toFixed(6)),
        lon: Number(lon.toFixed(6)),
        clima: climaZona,
        gez: gezTipo,
      });
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '80vh' }} />
      {info && (
        <div className="p-4 bg-black-100 text-sm">
          <strong>Latitude:</strong> {info.lat} <br />
          <strong>Longitude:</strong> {info.lon} <br />
          <strong>Zona Climática:</strong> {info.clima} <br />
          <strong>Zona ecológica global:</strong> {info.gez}
        </div>
      )}
    </>
  );
}