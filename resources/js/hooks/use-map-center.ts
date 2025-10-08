import { useEffect, useState } from 'react';

type Profile = { country?: string; city?: string };

export default function useMapCenter(profile?: Profile | null) {
  const [center, setCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function determineCenter() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
          async () => {
            await fallbackCenter();
          }
        );
      } else {
        await fallbackCenter();
      }
    }

    async function fallbackCenter() {
      try {
        if (profile?.country || profile?.city) {
          const query = encodeURIComponent(`${profile.city ?? ''}, ${profile.country ?? ''}`);
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
          const results = await res.json();

          if (results.length > 0) {
            setCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
            return;
          }
        }
      } catch {}

      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          const lat = parseFloat(ipData.latitude);
          const lon = parseFloat(ipData.longitude);
          if (!isNaN(lat) && !isNaN(lon)) {
            setCenter([lat, lon]);
            return;
          }
        }
      } catch {}
    }

    determineCenter();
  }, [profile]);

  return center;
}
