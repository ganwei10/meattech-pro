import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

// GET /api/admin/media/[id] - 媒体详情
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!media) {
      return NextResponse.json({ error: '媒体不存在' }, { status: 404 });
    }
    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/admin/media/[id] - 更新媒体信息
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { alt, caption, folder } = body;

    const media = await prisma.media.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(alt !== undefined && { alt }),
        ...(caption !== undefined && { caption }),
        ...(folder !== undefined && { folder }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, media });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/admin/media/[id] - 删除媒体
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!media) {
      return NextResponse.json({ error: '媒体不存在' }, { status: 404 });
    }

    // 删除本地文件
    if (media.url.startsWith('/uploads/')) {
      const filepath = join(process.cwd(), 'public', media.url);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    // 删除数据库记录
    await prisma.media.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
