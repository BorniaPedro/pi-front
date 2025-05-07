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
import { Feature, Overlay } from 'ol';
import { Geometry } from 'ol/geom';

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
  const mapInstance = useRef<Map | null>(null);
  const markerRed = useRef<Overlay | null>(null);

  const onSelectInfoRef = useRef(onSelectInfo);
  useEffect(() => {
    onSelectInfoRef.current = onSelectInfo;
  }, [onSelectInfo]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const southwest = fromLonLat([-60.0, -30.0]);
    const northeast = fromLonLat([-42.0, -18.0]);

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
        color: 'rgba(0, 128, 255, 0.0)',
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
          color: 'rgba(0, 0, 0, 1)',
          width: 2,
        }),
      }),
    });

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.width = '20px';
    markerElement.style.height = '20px';
    markerElement.style.backgroundColor = 'red';
    markerElement.style.borderRadius = '50%';
    markerElement.style.border = '2px solid white';
    markerElement.style.pointerEvents = 'none';

    const markerOverlay = new Overlay({
      element: markerElement,
      positioning: 'center-center',
      stopEvent: false,
    });
    markerRed.current = markerOverlay;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        climaLayer,
        gezLayer,
        paranaLayer,
      ],
      view: new View({
        center: fromLonLat([-51.4, -24.5]),
        zoom: 6.8,
        minZoom: 6,
        maxZoom: 20,
        extent: [...southwest, ...northeast],
      }),
      overlays: [markerOverlay],
    });

    map.on('click', (evt) => {
      const coord = evt.coordinate;
      const [lon, lat] = toLonLat(coord);

      let isInsideParana = false;
      paranaSource.forEachFeature((feature: Feature<Geometry>) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          isInsideParana = true;
        }
      });

      if (!isInsideParana) {
        alert('Selecione um ponto dentro do Paraná!');
        return;
      }

      markerOverlay.setPosition(coord); // Aqui o marcador aparece

      let climaZona: string | null = null;
      climaSource.forEachFeature((feature: Feature<Geometry>) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          climaZona = feature.get('zona_nome') || 'Desconhecida';
        }
      });

      let gezTipo: string | null = null;
      gezSource.forEachFeature((feature: Feature<Geometry>) => {
        if (feature.getGeometry()?.intersectsCoordinate(coord)) {
          gezTipo = feature.get('zona_nome') || 'Desconhecida';
        }
      });

      onSelectInfoRef.current?.({
        lat: Number(lat.toFixed(6)),
        lon: Number(lon.toFixed(6)),
        clima: climaZona,
        gez: gezTipo,
      });
    });

    return () => map.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '80vh' }} />;
}