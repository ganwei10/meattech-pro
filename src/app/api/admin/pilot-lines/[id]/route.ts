import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取单个产线详情（管理员）
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const line = await prisma.pilotLine.findUnique({
      where: { id: parseInt(params.id) },
      include: { bookings: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    if (!line) {
      return NextResponse.json({ error: 'Pilot line not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, line });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pilot line', detail: String(error) },
      { status: 500 }
    );
  }
}

// 更新产线（管理员）
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const line = await prisma.pilotLine.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(name && { name }),
        ...(region && { region }),
        ...(status && { status }),
        ...(specs !== undefined && { specs }),
        ...(capacity !== undefined && { capacity }),
        ...(equipment !== undefined && { equipment }),
        ...(capabilities !== undefined && { capabilities }),
        ...(contactPerson !== undefined && { contactPerson }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(pricePerDay !== undefined && { pricePerDay: parseFloat(pricePerDay) }),
        ...(serviceFeePercent !== undefined && { serviceFeePercent: parseFloat(serviceFeePercent) }),
        ...(description !== undefined && { description }),
        ...(images !== undefined && { images }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, line });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update pilot line', detail: String(error) },
      { status: 500 }
    );
  }
}

// 删除产线（管理员）
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 检查是否有预约关联
    const bookingCount = await prisma.booking.count({
      where: { lineId: parseInt(params.id) },
    });

    if (bookingCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${bookingCount} booking(s) exist for this line` },
        { status: 400 }
      );
    }

    await prisma.pilotLine.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true, message: 'Pilot line deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete pilot line', detail: String(error) },
      { status: 500 }
    );
  }
}
