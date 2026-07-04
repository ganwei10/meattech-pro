import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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
}
