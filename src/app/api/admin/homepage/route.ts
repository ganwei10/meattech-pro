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
        key: { in: ['homepage_carousel', 'homepage_industry', 'homepage_footer', 'homepage_pilot', 'homepage_sections', 'homepage_reverse', 'site_global'] },
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
      pilot: config.homepage_pilot || null,
      sections: config.homepage_sections || null,
      reverse: config.homepage_reverse || [],
      global: config.site_global || null,
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
    const { carousel, industry, footer, pilot, sections, reverse, global: globalConfig } = body;

    const upsertSetting = async (key: string, value: string) => {
      const existing = await prisma.setting.findUnique({ where: { key } });
      if (existing) {
        await prisma.setting.update({ where: { key }, data: { value } });
      } else {
        await prisma.setting.create({ data: { key, value } });
      }
    };

    if (carousel !== undefined) {
      await upsertSetting('homepage_carousel', JSON.stringify(carousel));
    }

    if (industry !== undefined) {
      await upsertSetting('homepage_industry', JSON.stringify(industry));
    }

    if (footer !== undefined) {
      await upsertSetting('homepage_footer', JSON.stringify(footer));
    }

    if (pilot !== undefined) {
      await upsertSetting('homepage_pilot', JSON.stringify(pilot));
    }

    if (sections !== undefined) {
      await upsertSetting('homepage_sections', JSON.stringify(sections));
    }

    if (reverse !== undefined) {
      await upsertSetting('homepage_reverse', JSON.stringify(reverse));
    }

    if (globalConfig !== undefined) {
      await upsertSetting('site_global', JSON.stringify(globalConfig));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save homepage config', detail: String(error) }, { status: 500 });
  }
}
