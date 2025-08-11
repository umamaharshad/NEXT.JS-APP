const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Plumber', slug: 'plumber' },
    { name: 'Electrician', slug: 'electrician' },
    { name: 'Tutor', slug: 'tutor' },
    { name: 'Tailor', slug: 'tailor' },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c;
  }

  const base = { lat: 12.9716, lng: 77.5946 };

  const providers = [
    {
      name: 'AquaFix Plumbing Co.',
      categorySlug: 'plumber',
      phone: '+919000000001',
      whatsapp: '+919000000001',
      description: 'Emergency leaks, pipe repair, bathroom fittings.',
      address: 'MG Road, Bengaluru',
      latitude: base.lat + 0.01,
      longitude: base.lng + 0.01,
      isVerified: true,
      reviews: [
        { reviewerName: 'Rahul', rating: 5, comment: 'Quick and professional.' },
        { reviewerName: 'Anita', rating: 4, comment: 'Good service.' },
      ],
    },
    {
      name: 'SparkRight Electricians',
      categorySlug: 'electrician',
      phone: '+919000000002',
      whatsapp: '+919000000002',
      description: 'Wiring, fans, MCB, inverter and more.',
      address: 'Indiranagar, Bengaluru',
      latitude: base.lat - 0.015,
      longitude: base.lng + 0.02,
      isVerified: true,
      reviews: [
        { reviewerName: 'Kiran', rating: 5, comment: 'Knows the job.' },
        { reviewerName: 'Meera', rating: 4, comment: 'On time, good work.' },
      ],
    },
    {
      name: 'Math Mastery Tutor',
      categorySlug: 'tutor',
      phone: '+919000000003',
      whatsapp: '+919000000003',
      description: 'Math and Science for classes 6-10. Home tuitions available.',
      address: 'Koramangala, Bengaluru',
      latitude: base.lat + 0.02,
      longitude: base.lng - 0.02,
      isVerified: false,
      reviews: [
        { reviewerName: 'Parent', rating: 5, comment: 'Great improvement.' },
      ],
    },
    {
      name: 'Stitch & Style Tailors',
      categorySlug: 'tailor',
      phone: '+919000000004',
      whatsapp: '+919000000004',
      description: 'Custom tailoring, alterations, ethnic wear.',
      address: 'Whitefield, Bengaluru',
      latitude: base.lat - 0.01,
      longitude: base.lng - 0.015,
      isVerified: true,
      reviews: [
        { reviewerName: 'Sameer', rating: 4, comment: 'Neat stitching.' },
      ],
    },
    {
      name: 'CityFlow Plumbing',
      categorySlug: 'plumber',
      phone: '+919000000005',
      whatsapp: '+919000000005',
      description: 'All plumbing works with warranty.',
      address: 'Jayanagar, Bengaluru',
      latitude: base.lat + 0.005,
      longitude: base.lng - 0.005,
      isVerified: false,
      reviews: [
        { reviewerName: 'Lakshmi', rating: 3, comment: 'Decent.' },
      ],
    },
  ];

  for (const p of providers) {
    const provider = await prisma.provider.create({
      data: {
        name: p.name,
        phone: p.phone,
        whatsapp: p.whatsapp,
        description: p.description,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        isVerified: p.isVerified,
        category: { connect: { id: createdCategories[p.categorySlug].id } },
      },
    });

    for (const r of p.reviews) {
      await prisma.review.create({
        data: {
          providerId: provider.id,
          reviewerName: r.reviewerName,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });