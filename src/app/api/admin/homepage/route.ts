import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 获取首页配置
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['homepage_carousel', 'homepage_industry', 'homepage_footer'] },
      },
    });

    const config: Record<string, any> = {};
    for (const s of settings) {
      try {
        config[s.key] = JSON.parse(s.value);
      } catch {
        config[s.key] = [];
      }
    }

    return NextResponse.json({
      carousel: config.homepage_carousel || [],
      industry: config.homepage_industry || [],
      footer: config.homepage_footer || { title: '', subtitle: '', groups: [] },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch homepage config', detail: String(error) }, { status: 500 });
  }
}

// 保存首页配置
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { carousel, industry, footer } = body;

    if (carousel !== undefined) {
      const existing = await prisma.setting.findUnique({ where: { key: 'homepage_carousel' } });
      const value = JSON.stringify(carousel);
      if (existing) {
        await prisma.setting.update({ where: { key: 'homepage_carousel' }, data: { value } });
      } else {
        await prisma.setting.create({ data: { key: 'homepage_carousel', value } });
      }
    }

    if (industry !== undefined) {
      const existing = await prisma.setting.findUnique({ where: { key: 'homepage_industry' } });
      const value = JSON.stringify(industry);
      if (existing) {
        await prisma.setting.update({ where: { key: 'homepage_industry' }, data: { value } });
      } else {
        await prisma.setting.create({ data: { key: 'homepage_industry', value } });
      }
    }

    if (footer !== undefined) {
      const existing = await prisma.setting.findUnique({ where: { key: 'homepage_footer' } });
      const value = JSON.stringify(footer);
      if (existing) {
        await prisma.setting.update({ where: { key: 'homepage_footer' }, data: { value } });
      } else {
        await prisma.setting.create({ data: { key: 'homepage_footer', value } });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save homepage config', detail: String(error) }, { status: 500 });
  }
}
