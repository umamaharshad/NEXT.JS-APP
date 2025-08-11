import Link from 'next/link';
import RatingStars from './RatingStars';

function digitsOnly(phone?: string | null) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export type ProviderListItem = {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  phone: string;
  whatsapp?: string | null;
  description?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  avgRating: number | null;
  reviewsCount: number;
  distanceKm?: number;
};

export default function ProviderCard({ provider }: { provider: ProviderListItem }) {
  const telHref = `tel:${digitsOnly(provider.phone)}`;
  const waNum = digitsOnly(provider.whatsapp ?? provider.phone);
  const waHref = `https://wa.me/${waNum}`;

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-white flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/providers/${provider.id}`} className="text-lg font-semibold hover:underline">
            {provider.name}
          </Link>
          <div className="text-sm text-gray-600">{provider.category} {provider.isVerified && <span className="ml-2 inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Verified</span>}</div>
        </div>
        <div className="text-right text-sm text-gray-600">
          {typeof provider.distanceKm === 'number' && (
            <div>{provider.distanceKm.toFixed(1)} km</div>
          )}
          <RatingStars rating={provider.avgRating} count={provider.reviewsCount} />
        </div>
      </div>

      {provider.description && (
        <p className="text-sm text-gray-800 line-clamp-2">{provider.description}</p>
      )}
      {provider.address && (
        <div className="text-sm text-gray-600">{provider.address}</div>
      )}

      <div className="mt-1 flex gap-2">
        <a href={telHref} className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
          Call
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-1.5 text-white hover:bg-green-700"
        >
          WhatsApp
        </a>
        <Link
          href={`/providers/${provider.id}`}
          className="ml-auto inline-flex items-center gap-2 rounded border px-3 py-1.5 text-gray-800 hover:bg-gray-50"
        >
          Details
        </Link>
      </div>
    </div>
  );
}