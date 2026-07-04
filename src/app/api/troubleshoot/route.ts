import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const where: any = {};
    if (category) where.category = category;
    const nodes = await prisma.troubleshootNode.findMany({ where, orderBy: { id: 'asc' } });
    return NextResponse.json(nodes);
  } catch (error) {
    return NextResponse.json({ error: '查询失败', detail: String(error) }, { status: 500 });
  }
}
