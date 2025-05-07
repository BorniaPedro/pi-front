'use client';

import { useEffect, useRef, } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';

interface OLMapProps {
  onSelectInfo?: (info: {
    lat: number;
    lon: number;
    clima: string | null;
    gez: string | null;
  }) => void;
}

export default function OLMap({ onSelectInfo }: OLMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

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
      url: '/mapas/GEZParana.geojson',
      format: new GeoJSON(),
    });
    const paranaSource = new VectorSource({
      url: '/mapas/parana.geojson',
      format: new GeoJSON(),
    });

    const estiloSemBorda = new Style({
      fill: new Fill({
        color: 'rgba(0, 128, 255, 0.0)', // azul claro com transparência
      }),
    });

    const climaLayer = new VectorLayer({
      source: climaSource,
      style: estiloSemBorda,
    });

    const gezLayer = new VectorLayer({
      source: gezSource,
      style: estiloSemBorda,
    });

    const paranaLayer = new VectorLayer({
      source: paranaSource,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 1)', // preto
          width: 2,
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        climaLayer,
        gezLayer,
        paranaLayer,
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
          climaZona = feature.get('zona_nome') || 'Desconhecida';
        }
      });

      let gezTipo: string | null = null;
      gezSource.forEachFeature((feature) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          gezTipo = feature.get('zona_nome') || 'Desconhecida';
        }
      });

      onSelectInfo?.({
        lat: Number(lat.toFixed(6)),
        lon: Number(lon.toFixed(6)),
        clima: climaZona,
        gez: gezTipo,
      });
    });

    return () => map.setTarget(undefined);
  }, [onSelectInfo]);

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

