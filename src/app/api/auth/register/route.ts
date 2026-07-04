import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'meattech-pro-secret-key-change-in-prod32!'
);

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, company } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: '请填写邮箱、密码和姓名' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
        name,
        phone: phone || null,
        company: company || null,
        role: 'MEMBER',
      },
    });
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }, { status: 201 });
    res.cookies.set('meattech_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: '注册失败', detail: String(error) }, { status: 500 });
  }
}
