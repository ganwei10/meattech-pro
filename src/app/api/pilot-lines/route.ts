import { NextResponse } from 'next/server';
import { safeFindPilotLines } from '@/lib/safeQuery';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const status = searchParams.get('status');

    let lines = await safeFindPilotLines('desc');
    // Filter in JS since safeFindPilotLines doesn't support where clause
    if (region) lines = lines.filter((l: any) => l.region === region);
    if (status) lines = lines.filter((l: any) => l.status === status);

    return NextResponse.json(lines);
  } catch (error) {
    return NextResponse.json({ error: '获取产线失败', detail: String(error) }, { status: 500 });
  }
}
