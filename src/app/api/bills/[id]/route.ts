import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeFindPilotLine } from '@/lib/safeQuery';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let bill: any;
    try {
      bill = await prisma.bill.findUnique({
        where: { id: parseInt(params.id) },
        include: { line: true },
      });
    } catch {
      bill = await prisma.bill.findUnique({
        where: { id: parseInt(params.id) },
      });
      if (bill) bill.line = await safeFindPilotLine(bill.lineId);
    }

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bill', detail: String(error) },
      { status: 500 }
    );
  }
}
