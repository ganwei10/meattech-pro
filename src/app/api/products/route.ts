import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      title: body.title,
      category: body.category,
      difficulty: body.difficulty,
      reportUrl: body.reportUrl || null,
      cover: body.cover || null,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
