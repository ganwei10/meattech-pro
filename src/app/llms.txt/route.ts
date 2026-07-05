import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meattech-pro.vercel.app';

  // Fetch Q&A posts for AI context
  const qaPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', slug: { startsWith: 'qa-' } },
    select: { title: true, slug: true, excerpt: true, tags: true },
    orderBy: { slug: 'asc' },
    take: 100,
  });

  const qaList = qaPosts.map(p => `- ${p.title} (${baseUrl}/article/${p.slug})`).join('\n');

  const content = `# MeatTech Pro

> MeatTech Pro is an industrial meat product R&D and intelligent pilot-testing platform serving meat process engineers across China. It covers sausage manufacturing, chilled meat technology, water retention, color development, shelf-life preservation, packaging technology, and equipment selection.

## Platform Overview

MeatTech Pro provides:
- **Reverse Engineering of Retail Bestsellers**: Deconstructing industrial production parameters from supermarket products (e.g., Sam's Club crispy sausage, Hema MAP ready meals)
- **Hardcore Meat Science**: Deep technical articles on raw material modification, process optimization, additive application, and troubleshooting
- **Shared Pilot Production Lines**: Online booking system for 25+ pilot facilities across 6 regions in China, covering universities, industrial parks, and ingredient company demo centers
- **Process Engineer Community**: 100+ Q&A discussions covering sausage making, chilled meat technology, water retention, color & curing, shelf-life & preservation, packaging, and equipment
- **Engineering Tools**: GB 2760 additive calculator, intelligent troubleshooting decision tree, pilot line map

## Key Technical Areas

1. Sausage Manufacturing (emulsification, filling, cooking, smoking)
2. Chilled Meat Technology (cooling, MAP packaging, cold chain management)
3. Water Retention (phosphate blends, tumbling, brine injection)
4. Color & Curing (nitrite, natural colorants, smoke color)
5. Shelf-life & Preservation (Nisin, potassium sorbate, spoilage control)
6. Packaging Technology (vacuum, MAP, high-barrier films)
7. Equipment & Process (bowl cutter, stuffer, tumbler, smokehouse selection)

## Q&A Knowledge Base (${qaPosts.length} entries)

${qaList}

## Important Pages

- Homepage: ${baseUrl}
- Community Q&A: ${baseUrl}/community
- Q&A Category: ${baseUrl}/category/community-qa
- Pilot Line Map: ${baseUrl}/tool/pilot-map
- GB 2760 Calculator: ${baseUrl}/tool/gb2760
- Troubleshooting Matrix: ${baseUrl}/tool/troubleshoot
- Booking: ${baseUrl}/booking
- Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
