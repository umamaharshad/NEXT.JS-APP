/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/app/lib/prisma';

export async function GET(_req: Request, context: any) {
  const id = Number(context.params?.id);
  if (!Number.isInteger(id)) {
    return new Response('Invalid id', { status: 400 });
  }

  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!provider) return new Response('Not found', { status: 404 });

  const ratings = provider.reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
      10
    : null;

  return Response.json({ ...provider, avgRating, reviewsCount: ratings.length });
}