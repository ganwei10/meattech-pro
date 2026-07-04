import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const functionClass = searchParams.get('class');
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { alias: { contains: q } },
        { functionClass: { contains: q } },
      ];
    }
    if (functionClass) {
      where.functionClass = functionClass;
    }
    const additives = await prisma.additive.findMany({ where, orderBy: { name: 'asc' } });
    return NextResponse.json(additives);
  } catch (error) {
    return NextResponse.json({ error: '查询失败', detail: String(error) }, { status: 500 });
  }
}
