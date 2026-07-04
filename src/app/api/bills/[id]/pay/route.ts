import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 更新账单支付状态（模拟支付）
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { paymentMethod, transactionId } = body;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // 更新账单状态
    const updatedBill = await prisma.bill.update({
      where: { id: parseInt(params.id) },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod,
        transactionId,
      },
    });

    return NextResponse.json({ success: true, bill: updatedBill });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update payment', detail: String(error) },
      { status: 500 }
    );
  }
}
