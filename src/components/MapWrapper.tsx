'use client';

import dynamic from 'next/dynamic';

// Esse é o componente que importa o mapa dinamicamente
const Map = dynamic(() => import('./Map'), {
  ssr: false,
});

export default function MapWrapper() {
  return <Map />;
}
