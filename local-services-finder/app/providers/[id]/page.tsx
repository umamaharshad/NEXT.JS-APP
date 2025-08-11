import { prisma } from '@/app/lib/prisma';
import RatingStars from '@/app/components/RatingStars';
import ReviewForm from './review-form';

export default async function ProviderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!provider) return <div className="p-6">Provider not found.</div>;

  const ratings = provider.reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
      10
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{provider.name}</h1>
        <div className="mt-1 text-gray-700">{provider.category.name}</div>
        <div className="mt-2">
          <RatingStars rating={avgRating} count={provider.reviews.length} />
        </div>
        {provider.description && <p className="mt-3 text-gray-800">{provider.description}</p>}
        {provider.address && <p className="mt-1 text-gray-600">{provider.address}</p>}
        <div className="mt-4 flex gap-2">
          <a href={`tel:${provider.phone.replace(/\D/g, '')}`} className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Call</a>
          <a
            href={`https://wa.me/${(provider.whatsapp ?? provider.phone).replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">Add a review</h2>
        <ReviewForm providerId={provider.id} />
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        {provider.reviews.length === 0 && (
          <div className="text-gray-600">No reviews yet.</div>
        )}
        <ul className="space-y-3">
          {provider.reviews.map((r) => (
            <li key={r.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.reviewerName}</div>
                <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm"><span className="text-yellow-500">{'★'.repeat(r.rating)}</span>{' '}{r.rating}/5</div>
              {r.comment && <p className="mt-1 text-gray-800">{r.comment}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}