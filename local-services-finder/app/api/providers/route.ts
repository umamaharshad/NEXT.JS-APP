import { prisma } from '@/app/lib/prisma';
import { haversineDistanceKm } from '@/app/lib/geo';
import type { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category')?.trim();
  const limit = Number(searchParams.get('limit') ?? '25');

  const where: Prisma.ProviderWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { address: { contains: q } },
    ];
  }
  if (category) {
    where.category = { is: { slug: category } };
  }

  const providers = await prisma.provider.findMany({
    where,
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  const latNum = lat ? Number(lat) : undefined;
  const lngNum = lng ? Number(lng) : undefined;

  const mapped = providers.map((p) => {
    const distanceKm =
      latNum !== undefined && lngNum !== undefined
        ? haversineDistanceKm(latNum, lngNum, p.latitude, p.longitude)
        : undefined;

    const ratings = p.reviews.map((r) => r.rating);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
        10
      : null;

    return {
      id: p.id,
      name: p.name,
      category: p.category.name,
      categorySlug: p.category.slug,
      phone: p.phone,
      whatsapp: p.whatsapp,
      description: p.description,
      address: p.address,
      latitude: p.latitude,
      longitude: p.longitude,
      isVerified: p.isVerified,
      avgRating,
      reviewsCount: ratings.length,
      distanceKm,
    };
  });

  mapped.sort((a, b) => {
    if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
    if (a.distanceKm === undefined) return 1;
    if (b.distanceKm === undefined) return -1;
    return a.distanceKm - b.distanceKm;
  });

  return Response.json(mapped.slice(0, Number.isFinite(limit) ? limit : 25));
}