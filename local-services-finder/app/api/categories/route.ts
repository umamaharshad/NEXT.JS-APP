import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return Response.json(categories);
}