export default function RatingStars({
  rating,
  count,
}: {
  rating: number | null;
  count?: number;
}) {
  if (rating === null) return <span className="text-sm text-gray-500">No ratings</span>;
  const full = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < full ? 'text-yellow-500' : 'text-gray-300'}>
      ★
    </span>
  ));
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-label={`Rating ${rating} out of 5`} className="font-medium">
        {rating.toFixed(1)}
      </span>
      <span>{stars}</span>
      {typeof count === 'number' && (
        <span className="text-gray-500">({count})</span>
      )}
    </span>
  );
}