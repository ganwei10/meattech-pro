import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: '获取产品失败', detail: String(error) }, { status: 500 });
  }
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
