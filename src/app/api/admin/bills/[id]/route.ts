import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取单个账单详情（管理员）
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(params.id) },
      include: { line: true, booking: true },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bill', detail: String(error) },
      { status: 500 }
    );
  }
}

// 更新账单状态（管理员）
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
      status,
      amount,
      serviceFeePercent,
      invoiceRequested,
      invoiceInfo,
      note,
    } = body;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // 计算更新后的值
    let updateData: any = {};

    if (amount !== undefined) {
      updateData.amount = parseFloat(amount);
      // 重新计算服务费
      const line = await prisma.pilotLine.findUnique({ where: { id: bill.lineId } });
      const feePercent = serviceFeePercent !== undefined ? parseFloat(serviceFeePercent) : (bill.serviceFee / bill.amount * 100);
      updateData.serviceFee = updateData.amount * (feePercent / 100);
      updateData.totalAmount = updateData.amount + updateData.serviceFee;
    }

    if (serviceFeePercent !== undefined) {
      const fee = bill.amount * (parseFloat(serviceFeePercent) / 100);
      updateData.serviceFee = fee;
      updateData.totalAmount = bill.amount + fee;
    }

    if (status) {
      updateData.status = status;
      if (status === 'PAID') {
        updateData.paidAt = new Date();
      }
    }

    if (invoiceRequested !== undefined) updateData.invoiceRequested = invoiceRequested;
    if (invoiceInfo !== undefined) updateData.invoiceInfo = invoiceInfo;
    if (note !== undefined) updateData.note = note;
    updateData.updatedAt = new Date();

    const updatedBill = await prisma.bill.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: { line: true, booking: true },
    });

    return NextResponse.json({ success: true, bill: updatedBill });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bill', detail: String(error) },
      { status: 500 }
    );
  }
}

// 删除账单（管理员）
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.bill.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true, message: 'Bill deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bill', detail: String(error) },
      { status: 500 }
    );
  }
}
