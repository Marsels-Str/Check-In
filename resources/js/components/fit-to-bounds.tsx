import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type Point = [number, number];

export default function FitToBounds({
  points,
  padding = [40, 40],
  fallbackZoom = 15,
}: {
  points: Point[];
  padding?: [number, number];
  fallbackZoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points?.length) return;

    try {
      map.fitBounds(points as any, { padding });
    } catch {
      map.setView(points[0], fallbackZoom);
    }
  }, [map, JSON.stringify(points), padding[0], padding[1], fallbackZoom]);

  return null;
}
