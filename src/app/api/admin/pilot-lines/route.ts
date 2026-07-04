import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取所有产线（管理员）
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const region = searchParams.get('region');
    const keyword = searchParams.get('keyword');

    const where: any = {};
    if (status) where.status = status;
    if (region) where.region = region;
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const lines = await prisma.pilotLine.findMany({
      where,
      orderBy: { id: 'desc' },
      include: { _count: { select: { bookings: true } } },
    });

    return NextResponse.json({ success: true, lines });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pilot lines', detail: String(error) },
      { status: 500 }
    );
  }
}

// 创建新产线（管理员）
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      region,
      status,
      specs,
      capacity,
      equipment,
      capabilities,
      contactPerson,
      contactPhone,
      contactEmail,
      pricePerDay,
      serviceFeePercent,
      description,
      images,
    } = body;

    if (!name || !region) {
      return NextResponse.json({ error: 'Name and region are required' }, { status: 400 });
    }

    const line = await prisma.pilotLine.create({
      data: {
        name,
        region,
        status: status || 'AVAILABLE',
        specs: specs || '',
        capacity: capacity || '',
        equipment: equipment || '',
        capabilities: capabilities || '',
        contactPerson: contactPerson || '',
        contactPhone: contactPhone || '',
        contactEmail: contactEmail || '',
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : 0,
        serviceFeePercent: serviceFeePercent ? parseFloat(serviceFeePercent) : 5,
        description: description || '',
        images: images || '',
      },
    });

    return NextResponse.json({ success: true, line });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create pilot line', detail: String(error) },
      { status: 500 }
    );
  }
}
