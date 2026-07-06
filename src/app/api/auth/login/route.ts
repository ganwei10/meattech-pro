import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { rateLimit } from '@/lib/rateLimit';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'meattech-pro-secret-key-change-in-prod32!'
);

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success, remaining } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: '操作过于频繁，请稍后再试' }, { status: 429 });
  }

  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
  }
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || '',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  // 更新最后登录时间
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone || '' } });
  res.cookies.set('meattech_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
