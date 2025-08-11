import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response('Invalid JSON', { status: 400 });

  const { providerId, reviewerName, rating, comment } = body as {
    providerId?: number;
    reviewerName?: string;
    rating?: number;
    comment?: string;
  };

  if (!providerId || !reviewerName || !rating) {
    return new Response('Missing required fields', { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return new Response('Rating must be between 1 and 5', { status: 400 });
  }

  const created = await prisma.review.create({
    data: {
      providerId,
      reviewerName,
      rating,
      comment,
    },
  });

  return Response.json(created, { status: 201 });
}