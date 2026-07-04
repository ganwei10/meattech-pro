import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// 获取用户列表
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 20;

    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { email: { contains: keyword } },
        { phone: { contains: keyword } },
        { company: { contains: keyword } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        company: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    // 获取每个用户的预约数
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const [bookingCount, paidBillCount] = await Promise.all([
          prisma.booking.count({ where: { contactEmail: u.email } }),
          prisma.bill.count({ where: { customerEmail: u.email, status: 'PAID' } }),
        ]);
        return {
          ...u,
          bookingCount,
          paidBillCount,
        };
      })
    );

    return NextResponse.json({ users: usersWithStats, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', detail: String(error) },
      { status: 500 }
    );
  }
}

// 创建新用户
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, name, role, phone, company } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: '邮箱、密码和姓名不能为空' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
        name,
        role: role || 'EDITOR',
        phone: phone || null,
        company: company || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        company: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user', detail: String(error) },
      { status: 500 }
    );
  }
}
