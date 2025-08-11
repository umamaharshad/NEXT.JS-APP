'use client';

import { useEffect, useMemo, useState } from 'react';
import ProviderCard, { type ProviderListItem } from './ProviderCard';

type Category = { id: number; name: string; slug: string };

export default function NearbyProviders() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [query, setQuery] = useState('');
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  const params = useMemo(() => {
    const s = new URLSearchParams();
    if (coords) {
      s.set('lat', String(coords.lat));
      s.set('lng', String(coords.lng));
    }
    if (selectedCategory) s.set('category', selectedCategory);
    if (query.trim()) s.set('q', query.trim());
    s.set('limit', '50');
    return s.toString();
  }, [coords, selectedCategory, query]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/providers?${params}`)
      .then((r) => r.json())
      .then((data: ProviderListItem[]) => setProviders(data))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, [params]);

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      alert('Geolocation not supported in this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
        alert('Failed to get location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services (e.g., plumber, fan repair, math tutor)"
          className="w-full rounded border px-3 py-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={useMyLocation}
          className="rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
        >
          Use my location
        </button>
      </div>

      {loading && <div className="text-gray-600">Loading providers…</div>}

      {!loading && providers.length === 0 && (
        <div className="text-gray-600">No providers found. Try adjusting filters.</div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />)
        )}
      </div>
    </section>
  );
}