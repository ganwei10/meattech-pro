import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const status = searchParams.get('status');

    const where: any = {};
    if (region) where.region = region;
    if (status) where.status = status;

    const lines = await prisma.pilotLine.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(lines);
  } catch (error) {
    return NextResponse.json({ error: '获取产线失败', detail: String(error) }, { status: 500 });
  }
}
