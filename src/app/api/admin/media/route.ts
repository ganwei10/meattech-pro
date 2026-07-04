import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

// GET /api/admin/media - 媒体列表
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || '';      // IMAGE 或 VIDEO
  const folder = searchParams.get('folder') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  try {
    const where: any = {};
    if (type) where.type = type;
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { alt: { contains: search } },
        { caption: { contains: search } },
      ];
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.media.count({ where }),
    ]);

    // 获取所有文件夹
    const folders = await prisma.media.groupBy({
      by: ['folder'],
      _count: { folder: true },
    });

    return NextResponse.json({
      media,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      folders: folders.map(f => ({ name: f.folder, count: f._count.folder })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/media - 创建媒体（URL输入或文件上传）
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 文件上传
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const folder = (formData.get('folder') as string) || 'default';
      const alt = (formData.get('alt') as string) || '';
      const caption = (formData.get('caption') as string) || '';

      if (!file) {
        return NextResponse.json({ error: '未上传文件' }, { status: 400 });
      }

      // 生成文件名
      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || '';
      const filename = `${timestamp}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      const filepath = join(uploadsDir, filename);

      // 确保目录存在
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // 保存文件
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      const url = `/uploads/${filename}`;
      const isVideo = file.type.startsWith('video/');
      const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

      const media = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          url,
          mimeType,
          size: file.size,
          type: isVideo ? 'VIDEO' : 'IMAGE',
          folder,
          alt,
          caption,
        },
      });

      return NextResponse.json({ ok: true, media });
    }

    // URL 输入
    const body = await req.json();
    const { url, originalName, folder, alt, caption } = body;

    if (!url) {
      return NextResponse.json({ error: '缺少 URL' }, { status: 400 });
    }

    // 判断类型
    const isVideo = url.match(/\.(mp4|webm|ogg|avi|mov)(\?|$)/i) || url.includes('video');
    const type = isVideo ? 'VIDEO' : 'IMAGE';

    const media = await prisma.media.create({
      data: {
        filename: url.split('/').pop() || 'unknown',
        originalName: originalName || url.split('/').pop() || 'unknown',
        url,
        mimeType: type === 'VIDEO' ? 'video/mp4' : 'image/jpeg',
        size: 0,
        type,
        folder: folder || 'default',
        alt: alt || '',
        caption: caption || '',
      },
    });

    return NextResponse.json({ ok: true, media });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
